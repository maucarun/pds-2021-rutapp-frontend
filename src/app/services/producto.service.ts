import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  user: Usuario;
  idUsuario: number;
  username: string;
  password: string;
  url = environment.apiUrl + '/producto';

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

  async getAll(): Promise<Producto[]> {
    this.autenticar();
    return this.http.get<Producto[]>(this.url + '/all/' + this.idUsuario).toPromise();
  }

  async get(id: string): Promise<Producto> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.get<Producto>(this.url + '/' + id, { headers }).toPromise();
  }

  async create(id: string, producto: Producto): Promise<Producto> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.post<Producto>(this.url, producto, { headers }).toPromise();
  }

  async update(producto: Producto): Promise<Producto> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.put<Producto>(this.url, producto, { headers }).toPromise();
  }

  async delete(id: string): Promise<Producto> {
    this.autenticar();
    const headers = new HttpHeaders({
      usuario: this.username,
      password: this.password,
    });
    return this.http.delete<Producto>(this.url + '/' + id, { headers }).toPromise();
  }

}
