import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resourceUsage } from 'process';
import { Direccion } from '../models/direccion.models';
import { Posicion } from '../models/routific.models';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(private http: HttpClient) { }

  async getGeoLocation(direccion: Direccion): Promise<Posicion> {
      const dir: string = (direccion.calle + " " + direccion.altura.toString() + ", " + direccion.localidad + ", " + direccion.provincia).split(' ').join('%20')
      console.log('dir' + dir)
      const geocoder = new google.maps.Geocoder()
      let resultado: Posicion = new Posicion()

      const rta: any = await this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBB8lOfl92dPmFV1QroRSG-4F2131yse3o&address=' + dir).toPromise()
      console.log('lat google')
      console.log(rta.results[0].geometry.location.lat)
      resultado.lat = rta.results[0].geometry.location.lat
      resultado.lng = rta.results[0].geometry.location.lng
      /* geocoder.geocode({ 'address': dir }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          resultado = new Posicion()
          console.log(results[0].geometry.location.lat())
          resultado.lat = results[0].geometry.location.lat()
          resultado.lng = results[0].geometry.location.lng()
        }
        else{
          console.log('error')
        }
      }) */

      return resultado
  }

  async direcciongeolocalidada(dir: Direccion): Promise<Posicion> {

      let posicion:Posicion 
      await this.getGeoLocation(dir).then((rta: Posicion)=>posicion = rta)
      console.log(posicion)
      return posicion
  }
}
