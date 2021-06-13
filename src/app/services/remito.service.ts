import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Remito } from '../models/remito.models';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class RemitoService {

  url = 'http://localhost:8080/remito';
  constructor(private http: HttpClient, private storage: Storage) { }

  async getAll(idCliente: number, estado: string): Promise<Remito[]> {
    return this.http.get<Remito[]>(`${this.url}/all/?idCliente=${idCliente}&estado=${estado}`).toPromise();
  }

  async get(idRemito: string): Promise<Remito> {
    return this.http.get<Remito>(`${this.url}/${idRemito}`).toPromise();
  }

}
