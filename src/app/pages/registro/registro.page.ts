import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import firebase from 'firebase/app';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  formularioDeRegistro: FormGroup;

  constructor(
    public nav: NavController,
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private menu: MenuController,
    private afAuth: AngularFireAuth,
    private userService: UsuarioService
  ) {
  }
  ngOnInit(): void {
    this.formularioDeRegistro = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.menu.enable(false);
  }
  // register and go to home page
  register() {
    // console.log('HomePage');
    const usuario = {
      idUsuario: null,
      nombre: this.formularioDeRegistro.value.nombre,
      apellido: this.formularioDeRegistro.value.apellido,
      username: this.formularioDeRegistro.value.nombre,
      password: this.formularioDeRegistro.value.password,
      email: this.formularioDeRegistro.value.email,
      activo: true,
    };//);
    this.userService.registrarUsuario(usuario)
      .then(() => {
        alert('Usuario registrado correctamente');
        this.router.navigateByUrl('login', { replaceUrl: true });
      }
      )
      .catch(e => console.error(e));
  }

  // go to login page
  irAlogin() {
    // console.log('LoginPage');
    this.router.navigateByUrl('login', { replaceUrl: true });
  }

  async registroConGoogle() {
    //loginGoogle es registrarse también
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        const user = res.user;
        console.log(user);

        const usuario = {
          idUsuario: null,
          nombre: user.displayName.split(' ')[0],
          apellido: user.displayName.split(' ')[1],
          username: user.displayName.split(' ')[0],
          password: user.uid,
          email: user.email,
          activo: true,
          // telefono: user.phoneNumber,
          // foto: user.photoURL,
        };//);
        this.userService.registrarUsuario(usuario)
          .then(() => {
            alert('Usuario registrado correctamente');
            this.router.navigateByUrl('login', { replaceUrl: true });
          }
          )
          .catch(e => console.error(e));
      });
  }

  registroConFacebook() {
    console.log('Login con Facebook');
  }
}
