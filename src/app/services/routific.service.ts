import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Remito } from '../models/remito.models';
import { HojaDeRutaService } from './hojaDeRuta.service';
import { GoogleService } from './google.service';
import { Direccion } from '../models/direccion.models';
import { Posicion, RtaRoutific, RutaDeNavegacion, Visita } from '../models/routific.models';
import { HojaDeRuta } from '../models/hojaDeRuta.models';

@Injectable({
  providedIn: 'root'
})
export class RoutificService {

  private url = 'https://api.routific.com/v1/vrp'

  private headers = new HttpHeaders({
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGZjMzFhOTEzOTNiYTAwMTc4MzNkN2IiLCJpYXQiOjE2MjcxNDA1MjF9.EnvVaxJIzeYhoTZ9TcuNx22ynI2GepW6qVz8KB_0oYU',
    'Content-Type': 'application/json'
  });
  private currentLocation: Posicion
  constructor(
    private http: HttpClient,
    private hojaService: HojaDeRutaService,
    private googleService: GoogleService
  ) {
  }

  async get(hoja: HojaDeRuta): Promise<RutaDeNavegacion> {
    console.log('Método routificservice get')

    console.log('ver ahora')
    await this.getLocation().then(coords => {
      this.currentLocation = coords
    })

    let body: string
    console.log('routificservice - 30')
    console.log(hoja)
    const remitos: Remito[] = await this.remitosDisponible(hoja.remitos)

    if (!remitos || remitos.length < 1)
      return null

    await this.getBody(remitos).then(strbody => { body = strbody })
    console.log('routific service 45')
    console.log(body)
    const resultado = await this.http.post<RtaRoutific>(`${this.url}`, body, { headers: this.headers }).toPromise()
    let rutaNavegacion: RutaDeNavegacion = new RutaDeNavegacion()

    //rutaNavegacion.posicionInicial = this.currentPosition
    rutaNavegacion.tiempoEstimado = resultado.total_travel_time
    rutaNavegacion.visitas = [] as Visita[]
    rutaNavegacion.posicionInicial = new Posicion()
    rutaNavegacion.posicionInicial.lat = this.currentLocation.lat
    rutaNavegacion.posicionInicial.lng = this.currentLocation.lng
    for (let i = 1; i < resultado.solution.vehiculo.length; i++) {
      let visita: Visita = new Visita()
      let nro = resultado.solution.vehiculo[i].location_id
      let datos = remitos[+nro]
      visita.numero = i
      visita.remito = datos
      visita.nombre = datos.cliente.nombre
      visita.posicion = new Posicion()
      visita.posicion.lat = datos.cliente.direccion.latitud
      visita.posicion.lng = datos.cliente.direccion.longitud
      visita.calle = datos.cliente.direccion.calle ? datos.cliente.direccion.calle : ''
      visita.altura = datos.cliente.direccion.altura
      visita.localidad = datos.cliente.direccion.localidad ? datos.cliente.direccion.localidad : ''
      visita.provincia = datos.cliente.direccion.provincia ? datos.cliente.direccion.provincia : ''
      rutaNavegacion.visitas.push(visita)
    }
    rutaNavegacion.proximaVisita = new Visita()
    rutaNavegacion.proximaVisita = rutaNavegacion.visitas[0]
    return rutaNavegacion
  }

  private async getBody(elementos: Remito[]): Promise<string> {
    let visits: string[] = new Array();
    let result: string;

    for (let i = 0; i < elementos.length; i++) {
      visits.push('"' + i + '":{' + '"location":{' +
        '"name":"' + elementos[i].idRemito + '_' + elementos[i].cliente.nombre + '",' +
        '"lat": ' + elementos[i].cliente.direccion.latitud + ',' +
        '"lng": ' + elementos[i].cliente.direccion.longitud + '}}')
    }
    result = '{"visits":{' + visits.join(", ") + '},"fleet":{"vehiculo": {"start_location": {"id": "inicio","lat": ' + this.currentLocation.lat + ',"lng": ' + this.currentLocation.lng + '}}}}'
    return result;
  }

  //Recupero los remitos que esten pendientes y disponibles en el dia de la semana de la fecha actual
  private async remitosDisponible(remitos: Remito[]) {
    console.log('Método toutificservice remitosDisponible')
    for (let i = 0; i < remitos.length; i++) {
      if (remitos[i].cliente.direccion.latitud === 0 || remitos[i].cliente.direccion.longitud === 0) {
        await this.googleService.direcciongeolocalidada(remitos[i].cliente.direccion).then(data => {
          remitos[i].cliente.direccion.latitud = data.lat
          remitos[i].cliente.direccion.longitud = data.lng
        })
      }
    }

    return remitos.filter(item => {
      return (item.estado === null || item.estado.nombre == 'Pendiente') &&
        (item.cliente.disponibilidades.filter(disp =>
          disp.diaSemana.id_dia_semana === new Date().getDay() ||
          (disp.diaSemana.id_dia_semana === 7 && new Date().getDay() === 0))).length > 0
    });
  }

  async getLocation(): Promise<Posicion> {
    console.log('Método toutificservice getLocation')
    return new Promise<Posicion>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(Error('No soporta geolocalizacion'));
        return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        resolve({ lat: latitude, lng: longitude });
      });
    });
  }

}