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

  user: Usuario;
  idUsuario: number;
  username: string;
  password: string;
  url = environment.apiUrl + '/cliente';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    this.autenticar();
  }
  
  autenticar() {
    this.user = this.authService.getUsuario()
    this.idUsuario = this.user.idUsuario
    this.username = this.user.username
    this.password = this.user.password
  }

  async getAll(): Promise<Cliente[]> {
    this.autenticar();
    console.log('Buscaré los clientes del usuario ' + this.user.idUsuario);
    return this.http.get<Cliente[]>(this.url + '/activo/usuario/' + this.user.idUsuario).toPromise();
  }

  async get(idCliente: string): Promise<Cliente> {
    this.autenticar();
    return this.http.get<Cliente>(this.url + '/usuario/' + this.idUsuario + '/cliente/' + idCliente).toPromise();
  }

  async getDisponibilidades(): Promise<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(this.url + '/disponibilidades').toPromise();
  }

  async create(cliente: Cliente): Promise<Cliente> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.post<Cliente>(this.url, cliente, { headers }).toPromise();
  }

  async update(cliente: Cliente): Promise<Cliente> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.put<Cliente>(this.url, cliente, { headers }).toPromise();
  }

  async delete(id: string) {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.user.username,
      password: this.user.password,
    });
    return this.http.delete<Cliente>(this.url + '/' + id, { headers }).toPromise();
  }
}
