import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from "../models/cliente.models";
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  idUsuario: number;
  url = environment.apiUrl + '/cliente';
  
  constructor(private http: HttpClient, private usuarioService: UsuarioService, private authService: AuthenticationService) {
    this.authService.loadsData();
    let user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
    // this.user = JSON.parse(user)
   }

  async getAll(idUsuario: number): Promise<Cliente[]> {
    console.log("Buscaré los clientes del usuario " + this.idUsuario)
    return await this.http.get<Cliente[]>(this.url+ '/activo/usuario/' + this.idUsuario).toPromise()
  }

  async get(idUsuario: number, id: string): Promise<Cliente> {
    return await this.http.get<Cliente>(this.url + '/usuario/' + idUsuario + '/cliente/' + id).toPromise()
  }
}