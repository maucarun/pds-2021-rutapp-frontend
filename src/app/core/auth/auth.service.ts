import { Platform, SelectValueAccessor } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.models';

const TOKEN_KEY = "Rutaap-Auth-Application-Token";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authState$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(private storage: Storage, private platform: Platform) {
    this.platform.ready().then(_ => {
      this.checkToken()
    })
  }

  private async checkToken(): Promise<void> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authState$.next(true);
      }
    })
  }

  public async login(usr: Usuario) {
    this.storage.set('Usuario', usr)
    return this.storage.set(TOKEN_KEY,  'Bearer 123456').then(res => {
      this.authState$.next(true);
    })
  }

  public async logout(): Promise<void> {
    return this.storage.remove(TOKEN_KEY).then(_ => {
      this.authState$.next(false);
    })
  }

  public getAuthStateObserver(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  public isAuthenticated() {
    return this.authState$.value;
  }
}
