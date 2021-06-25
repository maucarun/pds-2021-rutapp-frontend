import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Disponibilidad } from '../models/disponibilidad.models';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  /*
  idUsuario: number;
  username: string;
  password: string;
  */
  url = environment.apiUrl + '/cliente';
  user: Usuario;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    /*
    this.authService.loadsData();
    this.user = this.authService.getUser();
    this.idUsuario = JSON.parse(this.user).idUsuario;
    this.username = JSON.parse(this.user).username;
    this.password = JSON.parse(this.user).password;
    */
  }

  async getAll(idUsuario: number): Promise<Cliente[]> {
    /*
    this.user = this.authService.getUser();
    this.idUsuario = JSON.parse(this.user).idUsuario;
    this.username = JSON.parse(this.user).username;
    this.password = JSON.parse(this.user).password;
    */
    this.user = this.authService.getUsuario();
    console.log('Buscaré los clientes del usuario ' + this.user.idUsuario);
    return this.http.get<Cliente[]>(this.url + '/activo/usuario/' + this.user.idUsuario).toPromise();
  }

  async get(idUsuario: number, id: string): Promise<Cliente> {
    return this.http.get<Cliente>(this.url + '/usuario/' + idUsuario + '/cliente/' + id).toPromise();
  }

  async getDisponibilidades(): Promise<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(this.url + '/disponibilidades').toPromise();
  }

  async create(cliente: Cliente): Promise<Cliente> {
    this.user = this.authService.getUsuario();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.post<Cliente>(this.url, cliente, { headers }).toPromise();
  }

  async update(cliente: Cliente): Promise<Cliente> {
    this.user = this.authService.getUsuario();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.put<Cliente>(this.url, cliente, { headers }).toPromise();
  }

  async delete(id: string) {
    this.user = this.authService.getUsuario();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.delete<Cliente>(this.url + '/' + id, { headers }).toPromise();
  }
}
