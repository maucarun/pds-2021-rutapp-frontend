import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.models'
import { Usuario } from '../models/usuario.models';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url = 'http://localhost:8080/producto';
  constructor(private http: HttpClient, private storage: Storage) { }

  async getAll(): Promise<Producto[]> {
    console.log((await this.usr()))
    return await this.http.get<Producto[]>(`${this.url}/all/${(await this.usr()).idUsuario}`).toPromise()
  }

  async get(id: string): Promise<Producto> {
    return await this.http.get<Producto>(`${this.url}/${id}`).toPromise()
  }

  async usr(): Promise<Usuario> {
    return await this.storage.get('Usuario');
  }
}