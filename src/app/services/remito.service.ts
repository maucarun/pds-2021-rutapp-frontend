import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Remito } from '../models/remito.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class RemitoService {

  user: Usuario;
  idUsuario: number;
  username: string;
  password: string;
  url = environment.apiUrl + '/remito';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.autenticar();
  }

  autenticar() {
    this.user = this.authService.getUsuario()
    this.idUsuario = this.user.idUsuario
    this.username = this.user.username
    this.password = this.user.password
  }

  async getAll(): Promise<Remito[]> {
    this.autenticar();
    console.log('Buscaré los remitos del usuario ' + this.idUsuario);
    return this.http.get<Remito[]>(this.url + '/all/' + this.idUsuario).toPromise();
  }

  async getAllRemitosPorCliente(idCliente: number, estado: string): Promise<Remito[]> {
    console.log('Buscaré los remitos del cliente ' + idCliente);
    return this.http.get<Remito[]>(`${this.url}/all/?idCliente=${idCliente}&estado=${estado}`).toPromise();
  }

  async get(idRemito: string): Promise<Remito> {
    return this.http.get<Remito>(`${this.url}/${idRemito}`).toPromise();
  }

  async cancelarRemito(idRemito: string) {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.delete<Remito>(this.url + '/' + idRemito, { headers }).toPromise();
  }

  async guardarRemito(remito: Remito) {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
      //contentType: 'application/json',
    });
    return this.http.post<Remito>(this.url, remito, { headers }).toPromise();
  }

  async actualizarRemito(remito: Remito) {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
      //contentType: 'application/json',
    });
    return this.http.put<Remito>(this.url, remito, { headers }).toPromise();
  }

}
