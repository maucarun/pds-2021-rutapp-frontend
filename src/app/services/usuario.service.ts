import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.models'
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { error } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'http://localhost:8080/usuario';
  constructor(private http: HttpClient, private authService: AuthService) { }

  async login(username: string, password: string) {
    let usr = {
      username: username,
      password: password
    }
      const rta: Usuario = await this.http.post<Usuario>(`${this.url}/login`, usr).toPromise()
      this.authService.login(rta)
  }
}
