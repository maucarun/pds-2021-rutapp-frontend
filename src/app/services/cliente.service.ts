import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cliente } from "../models/cliente.models";
import { Usuario } from '../models/usuario.models';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = 'http://localhost:8080/cliente';
  constructor(private http: HttpClient, private storage: Storage) { }

  async getAll(): Promise<cliente[]> {
    console.log((await this.usr()))
    return await this.http.get<cliente[]>(`${this.url}/usuario/${(await this.usr()).idUsuario}`).toPromise()
  }

  async get(id: string): Promise<cliente> {
    console.log(`${this.url}/usuario/${(await this.usr()).idUsuario}/cliente/${id}`)
    return await this.http.get<cliente>(`${this.url}/usuario/${(await this.usr()).idUsuario}/cliente/${id}`).toPromise()
  }

  async usr(): Promise<Usuario> {
    return await this.storage.get('Usuario');
  }
}