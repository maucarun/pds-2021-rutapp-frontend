import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  url = 'https://ui-avatars.com/api';

  constructor() { }

  getAvatar(nombre: string) {
    return this.url + '/?name=' + nombre;
  }

  getAvatarPendiente(nombre: string) {
    return this.url + '/?name=' + nombre + '&background=F3FF00&color=000';
  }

  getAvatarEntregado(nombre: string) {
    return this.url + '/?name=' + nombre + '&background=0FFF00&color=000';
  }

  getAvatarCancelado(nombre: string) {
    return this.url + '/?name=' + nombre + '&background=FF0000&color=fff';
  }

}