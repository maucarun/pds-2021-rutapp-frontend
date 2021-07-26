/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HojaDeRuta } from '../models/hojaDeRuta.models';
import { Estado } from '../models/estado.models';
import { Remito } from '../models/remito.models';
import { Usuario } from '../models/usuario.models';

/* Servicios */
@Injectable({
    providedIn: 'root'
})

export class HojaDeRutaService {

    user: Usuario
    idUsuario: number
    username: string
    password: string
    url = environment.apiUrl + '/hojaDeRuta'

    constructor(private http: HttpClient, private authService: AuthenticationService) {
        this.autenticar()
    }

    autenticar(){
        this.user = this.authService.getUsuario()
        this.idUsuario= this.user.idUsuario
        this.username= this.user.username
        this.password= this.user.password
    }

    async getAll(): Promise<PaginacionService> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password
        });
        return await this.http.get<PaginacionService>(
            this.url, { headers }
        ).toPromise()
    }

    async getAllStatus(): Promise<HojaDeRuta[]> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password
        });
        return await this.http.get<HojaDeRuta[]>(this.url+'/info', { headers }).toPromise()
    }

    async get(id: string): Promise<HojaDeRuta> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password,
        });
        return await this.http.get<HojaDeRuta>(
            this.url + '/' + id, { headers }
        ).toPromise()
    }

    async getRemitosDisponibles(): Promise<PaginacionService> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password,
        });
        return await this.http.get<PaginacionService>(
            environment.apiUrl + '/remito?sinhdr=true&estado=6', { headers }
        ).toPromise()
    }

    async save(hoja: HojaDeRuta): Promise<HojaDeRuta> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password,
        });
        return await this.http.post<HojaDeRuta>(
            this.url, hoja, { headers }
        ).toPromise()
    }

    async update(hoja: HojaDeRuta): Promise<HojaDeRuta> {
        this.autenticar()
        let jsonStr = JSON.stringify(hoja)
        const strHoja = JSON.parse(jsonStr, this.formatearFecha);
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password,
        });
        return await this.http.put<HojaDeRuta>(
            this.url, strHoja, { headers }
        ).toPromise()
    }

    async getEstados(): Promise<Estado[]> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password,
        });
        return await this.http.get<Estado[]>(
            this.url + '/Estados', { headers }
        ).toPromise()
    }

    async delete(id: number, motivo: string): Promise<void> {
        this.autenticar()
        const headers = new HttpHeaders({
            usuario: this.username, password: this.password, 'Content-Type': 'application/json'
        });

        const body = { "id_hoja_de_ruta": id, "justificacion": motivo }
        console.log('eliminacion')
        console.log(body)
        this.http.request('DELETE', this.url, { body, headers }).toPromise()
    }

    formatearFecha(key, value): string {
        const dateFormat = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/;
        if (typeof value === "string" && dateFormat.test(value)) {
            return value.substring(0, 19)
        }
        return value;
    }
    pad(number: number): string {
        if (number < 10) {
            return '0' + number;
        }
        return number + '';
    }
}

export interface PaginacionService {
    cant: number,
    paganro: number,
    cantporpag: number,
    offset: number,
    cantpag: number,
    reultado: any[]
}
