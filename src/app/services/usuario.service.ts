import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.apiUrl + '/usuario';
  password: string;
  constructor(private http: HttpClient) { }

  // async getUsuarioById(idUsuario: any): Promise<Usuario> {
  //   const usuario: Usuario = await this.http.get<any>(this.url + '/' + idUsuario).toPromise();
  //   console.log(usuario);
  //   return usuario;
  // }

  async getUsuarioById(idUsuario: number): Promise<Usuario>{
    return await this.http.get<any>(this.url + '/' + idUsuario).toPromise();
  }

  //registrar usuario
  async registrarUsuario(usuario: Usuario): Promise<Usuario>{
    return await this.http.post<any>(this.url+'/registrar', usuario).toPromise();
  }
  //registrar usuario
  async actualizarUsuario(idUsuario: number, usuario: Usuario): Promise<Usuario>{
    return await this.http.put<any>(this.url+'/' + idUsuario, usuario).toPromise();
  }

  //Recuperar contraseña
  async guardarNuevaContraseñaGenerada(email: string, password: string){
    console.log('Password: ', password);
    this.password = password;
    const headers = new HttpHeaders({
      password: this.password,
    });
    // headers.set('password', 'algo');
    // console.log('***headers: ', headers);
    console.log('***headers: ', headers.keys());
    console.log('***headers: ', headers.get('password'));
    // return this.http.put<Usuario>(this.url+'?email='+email, { headers:new HttpHeaders({password}) }).toPromise();
    return this.http.put<any>(this.url+'?email='+email,{}, { headers }).toPromise();
  }

  //login usuario
  // async login(credenciales: {username; password}): Promise<Usuario>{
  // // async login(username: string, password: string){
  //   return await this.http.post<any>(this.url+'/login',credenciales).toPromise();
  //   // return await this.http.post(this.url+'/login',{username, password});
  // }
}
