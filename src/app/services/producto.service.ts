import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models';
import { Usuario } from '../models/usuario.models';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  idUsuario: number;
  url = environment.apiUrl + '/producto';
  constructor(private http: HttpClient, private authService: AuthenticationService ) {
    this.authService.loadsData();
    const user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
  }

  async getAll(): Promise<Producto[]> {
    return await this.http.get<Producto[]>(this.url + '/all/' + this.idUsuario).toPromise();
  }

  async get(id: string): Promise<Producto> {
    // Esto va a variar dependiendo del usuario logeado
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1'
    });

    return await this.http.get<Producto>(this.url+ '/' + id, {headers}).toPromise();
  }

  async create(id: string, producto: Producto): Promise<Producto> {
    // Esto va a variar dependiendo del usuario logeado
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
      contentType: 'application/json',
    });
    return await this.http.post<Producto>(this.url, producto, {headers}).toPromise();
  }

  async update(id: string, producto: Producto): Promise<Producto> {
    // Esto va a variar dependiendo del usuario logeado
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
      contentType: 'application/json',
    });
    return await this.http.put<Producto>(this.url, producto, {headers}).toPromise();
  }

  async delete(id: string): Promise<Producto> {// por ahora es put pero en el futuro debería ser delete
    // Esto va a variar dependiendo del usuario logeado
    const headers = new HttpHeaders({
      usuario: 'homer',
      password: 'abcd1',
    });
    return await this.http.delete<Producto>(this.url+ '/' + id, {headers}).toPromise();
  }

}
