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

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  private userData = new BehaviorSubject(null);
  url = environment.apiUrl + '/usuario';

  constructor(private http: HttpClient) { 
    this.loadsData();
  }

  async loadsData() {
    this.loadToken();
    this.loadUser();
  }

  async loadUser() {
    const user = await Storage.get({ key: USER });    
    if (user && user.value) {
      console.log('set user: ', user.value);
      this.userData.next(user.value);
    } else {
      this.userData.next(false);
    }
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

  login(credentials: {username, password}): Observable<any> {
    return this.http.post(this.url + '/login', credentials).pipe(
      map((data: any) => data),
      switchMap(data => {
        Storage.set({key: USER, value: JSON.stringify(data) });
        return from(Storage.set({key: TOKEN_KEY, value: 'test_token'}));
      }),
      tap(_ => {
        this.loadUser();
        this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }

  getUser() {
    // await this.loadUser()
    console.log(this.userData)
    return this.userData.getValue();
  }

  setSessionUser(user: Usuario) {
    console.log('actualizo sesion')
    Storage.set({key: USER, value: JSON.stringify(user) });
    this.loadUser();
  }
}
