import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  idUsuario: number;
  username: string;
  password: string;
  url = environment.apiUrl + '/producto';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.authService.loadsData();
    const user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
    this.username = JSON.parse(user).username;
    this.password = JSON.parse(user).password;
  }

  async getAll(): Promise<Producto[]> {
    return this.http.get<Producto[]>(this.url + '/all/' + this.idUsuario).toPromise();
  }

  async get(id: string): Promise<Producto> {
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    // console.log('headers: ', headers);
    return this.http.get<Producto>(this.url + '/' + id, { headers }).toPromise();
  }

  async create(id: string, producto: Producto): Promise<Producto> {
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.post<Producto>(this.url, producto, { headers }).toPromise();
  }

  async update(producto: Producto): Promise<Producto> {
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.put<Producto>(this.url, producto, { headers }).toPromise();
  }

  async delete(id: string): Promise<Producto> {// por ahora es put pero en el futuro debería ser delete
    // Esto va a variar dependiendo del usuario logeado
    // const headers = new HttpHeaders({
    //   usuario: 'homer',
    //   password: 'abcd1',
    // });
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.delete<Producto>(this.url + '/' + id, { headers }).toPromise();
  }

}
