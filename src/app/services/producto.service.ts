import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models'
import { Usuario } from '../models/usuario.models';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  idUsuario: number;
  url = environment.apiUrl + '/producto';
  constructor(private http: HttpClient, private authService: AuthenticationService ) {
    this.authService.loadsData();
    let user = this.authService.getUser();
    this.idUsuario = JSON.parse(user).idUsuario;
  }

  async getAll(): Promise<Producto[]> {
    // console.log((await this.usr()))
    return await this.http.get<Producto[]>(this.url + '/all/' + this.idUsuario).toPromise()
  }

  async get(id: string): Promise<Producto> {
    return await this.http.get<Producto>(this.url + id).toPromise()
  }

  // async usr(): Promise<Usuario> {
  //   return await this.storage.get('Usuario');
  // }
}