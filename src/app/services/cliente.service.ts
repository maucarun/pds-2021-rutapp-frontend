import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.models';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
import { AuthenticationService } from './authentication.service';
import { Disponibilidad } from '../models/disponibilidad.models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  idUsuario: number;
  username: string;
  password: string;
  url = environment.apiUrl + '/cliente';

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private authService: AuthenticationService) {
    this.authService.loadsData();
    const user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
    this.username = JSON.parse(user).username;
    this.password = JSON.parse(user).password;
  }

  async getAll(idUsuario: number): Promise<Cliente[]> {
    console.log('Buscaré los clientes del usuario ' + this.idUsuario)
    return await this.http.get<Cliente[]>(this.url + '/activo/usuario/' + this.idUsuario).toPromise()
  }

  async get(idUsuario: number, id: string): Promise<Cliente> {
    return await this.http.get<Cliente>(this.url + '/usuario/' + idUsuario + '/cliente/' + id).toPromise()
  }

  async getDisponibilidades(): Promise<Disponibilidad[]> {
    return await this.http.get<Disponibilidad[]>(this.url + '/disponibilidades').toPromise()
  }

  async create(cliente: Cliente): Promise<Cliente> {
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return await this.http.post<Cliente>(this.url, cliente, { headers }).toPromise()
  }

  async update(cliente: Cliente): Promise<Cliente> {
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return await this.http.put<Cliente>(this.url, cliente, { headers }).toPromise()
  }

  async delete(id: string) {
    console.log("Eliminado el cliente id " + id);
  }
}
