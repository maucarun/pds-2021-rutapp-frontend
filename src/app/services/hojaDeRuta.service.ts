/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HojaDeRuta } from '../models/hojaDeRuta.models';

/* Servicios */
@Injectable({
    providedIn: 'root'
})

export class HojaDeRutaService {

    idUsuario: number;
    username: string;
    password: string;
    url = environment.apiUrl + '/hojaDeRuta'

    constructor(private http: HttpClient, private authService: AuthenticationService) {
        this.authService.loadsData();
        const user = this.authService.getUser()
        this.idUsuario = JSON.parse(user).idUsuario
        this.username = JSON.parse(user).username;
        this.password = JSON.parse(user).password;
    }

    async getAll(): Promise<PaginacionService> {
        const headers = new HttpHeaders({
          usuario: this.username,
          password: this.password,
        });
        return await this.http.get<PaginacionService>(
            this.url, { headers }
        ).toPromise()
    }

    async get(id: string): Promise<HojaDeRuta> {
        const headers = new HttpHeaders({usuario: this.username, password: this.password,
        });
        return await this.http.get<HojaDeRuta>(
            this.url + '/' + id, { headers }
        ).toPromise()
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
