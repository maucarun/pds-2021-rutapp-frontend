import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Remito } from '../models/remito.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RemitoService {
  idUsuario: number;
  //username: string;
  //password: string;
  url = environment.apiUrl + '/remito';
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.authService.loadsData();
    const user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
    //this.username = JSON.parse(user).username;
    //this.password = JSON.parse(user).password;
  }

  async getAll(idUsuario: number): Promise<Remito[]> {
    console.log("Buscaré los remitos del usuario " + this.idUsuario)
    return await this.http.get<Remito[]>(this.url + '/all/' + this.idUsuario).toPromise()
  }

  async getAllRemitosPorCliente(idCliente: number, estado: string): Promise<Remito[]> {
    console.log("Buscaré los remitos del cliente " + idCliente);
    return this.http.get<Remito[]>(`${this.url}/all/?idCliente=${idCliente}&estado=${estado}`).toPromise();
  }

  async get(idRemito: string): Promise<Remito> {
    return this.http.get<Remito>(`${this.url}/${idRemito}`).toPromise();
  }

  async cancelarRemito(idRemito: string) {
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
    });
    return await this.http.delete<Remito>(this.url + '/' + idRemito, { headers }).toPromise();
  }

  async guardarRemito(remito: Remito) {
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
      contentType: 'application/json',
    });
    return await this.http.post<Remito>(this.url, remito, { headers }).toPromise();
  }

  async actualizarRemito(remito: Remito) {
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
      contentType: 'application/json',
    });
    return await this.http.put<Remito>(this.url, remito, { headers }).toPromise();
  }

}
