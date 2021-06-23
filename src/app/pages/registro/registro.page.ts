import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
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
    private nav: NavController,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private menu: MenuController,
    private afAuth: AngularFireAuth,
    private userService: UsuarioService,
    private toastController: ToastController,
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
    await this.registroConGoogleOFacebook(new firebase.auth.GoogleAuthProvider());
  }

  async registroConFacebook() {
    await this.registroConGoogleOFacebook(new firebase.auth.FacebookAuthProvider());
  }

  async registroConGoogleOFacebook(proveedorDeDatos){
    const loading = await this.loadingController.create({message: 'Cargando datos...'});
    await loading.present();

    this.afAuth.signInWithPopup(proveedorDeDatos)
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
        .then(async () => {
          await loading.dismiss();
          this.presentToast('Usuario registrado correctamente!');
          this.router.navigateByUrl('login', { replaceUrl: true });
        }
        )
        .catch(async (e) => {
          console.error(e);
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            buttons: ['OK'],
          });

          await alert.present();
        });
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
}
