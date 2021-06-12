import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.models'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.apiUrl + '/usuario';
  constructor(private http: HttpClient) { }

  async getUsuarioById(idUsuario: any): Promise<Usuario> {
    const usuario: Usuario = await this.http.get<any>(this.url + '/' + idUsuario).toPromise();
    console.log(usuario);
    return usuario;
  }
}
