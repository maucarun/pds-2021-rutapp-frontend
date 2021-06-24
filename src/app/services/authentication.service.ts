import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
const { Storage } = Plugins;
const TOKEN_KEY = 'esa-token';
const USER = 'user';

import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Usuario;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  url = environment.apiUrl + '/usuario';
  private userData = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
  ) {
    this.loadsData();
  }

  async loadsData() {
    await this.loadToken();
    await this.loadUser();
  }

  async loadUser() {
    const user = await Storage.get({ key: USER });
    if (user && user.value) {
      console.log('set user: ', user.value);
      this.userData.next(user.value);
    } else {
      this.userData.next(false);
    }
    this.user = JSON.parse(this.userData.getValue());
    console.log(this.user);
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { username; password }): Observable<any> {
    return this.http.post(this.url + '/login', credentials).pipe(
      map((data: any) => data),
      switchMap(data => {
        Storage.set({ key: USER, value: JSON.stringify(data) });
        return from(Storage.set({ key: TOKEN_KEY, value: 'test_token' }));
      }),
      tap(_ => {
        this.loadUser();
        this.isAuthenticated.next(true);
      })
    );
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.userData.next(null);
    await Storage.remove({ key: TOKEN_KEY });
    return Storage.remove({ key: USER });
    //const token = await Storage.get({ key: TOKEN_KEY });
    //console.log('set token: ', token.value);
    //console.log(await Storage.get({ key: USER }));
    //console.log(this.userData.getValue());
  }

  getUser() {
    // await this.loadUser()
    //console.log(this.userData);
    return this.userData.getValue();
  }

  getUsuario() {
    return this.user;
  }

  setSessionUser(user: Usuario) {
    console.log('actualizo sesion');
    Storage.set({ key: USER, value: JSON.stringify(user) });
    this.loadUser();
  }
}
