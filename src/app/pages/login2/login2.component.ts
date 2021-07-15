/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, AlertController, ToastController, MenuController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss'],
})
export class Login2Component implements OnInit {
  credenciales: FormGroup;
  errorCredenciales: any;
  showPassword = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  // errorCredenciales= {username:'', password:''};
  constructor(
    public nav: NavController,
    public forgotCtrl: AlertController,
    public menu: MenuController,
    public router: Router,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private afAuth: AngularFireAuth,
  ) {
    this.menu.swipeGesture(false);
    this.errorCredenciales = {};
  }
  ngOnInit() {
    this.credenciales = this.fb.group({
      username: ['', [Validators.required]],
      // email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.menu.enable(false);
  }

  // Redirige a registro
  irAregistro() {
    this.router.navigateByUrl('registro', { replaceUrl: true });
  }

  //Anota todos los cambios de los input y valida
  handlerChange(evento: any): void {
    // const { name, value } = evento.target;
    this.errorCredenciales = this.validarForm(this.credenciales);
  }
  // Iniciar sesión
  async login(): Promise<void> {
    //verifico que los campos esten llenos
    this.errorCredenciales = this.validarForm(this.credenciales);
    // console.log('this.credenciales.value: ', this.credenciales.value);
    if (Object.keys(this.errorCredenciales).length) {
      const alert = await this.alertController.create({
        header: 'Faltan completar campos',
        buttons: ['OK'],
      });
      return await alert.present();
    }

    const loading = await this.loadingController.create({ message: 'Verificando datos' });
    await loading.present();

    this.authService.login(this.credenciales.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('', { replaceUrl: true });
      }, async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async loginGoogle(): Promise<void> {
    await this.loginGoogleOFacebook(new firebase.auth.GoogleAuthProvider());
  }

  async loginFacebook(): Promise<void> {
    await this.loginGoogleOFacebook(new firebase.auth.FacebookAuthProvider());
  }
  forgotPass() {
    //enviar un mail con la contraseña
    console.log('Se olvidó la contraseña');
    // const forgot = this.forgotCtrl.create({
    //   title: 'Forgot Password?',
    //   message: 'Enter you email address to send a reset link password.',
    //   inputs: [
    //     {
    //       name: 'email',
    //       placeholder: 'Email',
    //       type: 'email'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Send',
    //       handler: data => {
    //         console.log('Send clicked');
    //         const toast = this.toastCtrl.create({
    //           message: 'Email was sended successfully',
    //           duration: 3000,
    //           position: 'top',
    //           cssClass: 'dark-trans',
    //           closeButtonText: 'OK',
    //           showCloseButton: true
    //         });
    //         toast.present();
    //       }
    //     }
    //   ]
    // });
    // forgot.present();
  }

  async loginGoogleOFacebook(proveedorDeDatos): Promise<void> {
    const loading = await this.loadingController.create({ message: 'Verificando datos' });
    await loading.present();

    try {
      const resDeFirebase = await this.afAuth.signInWithPopup(proveedorDeDatos);
      // const resDeFirebase = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

      this.credenciales = this.fb.group({
        username: [resDeFirebase.user.displayName.split(' ')[0].toString(), [Validators.required]],
        password: [resDeFirebase.user.uid.toString(), [Validators.required]],
      });

      // console.log('***Usuario google: ', this.credenciales.value);
      this.authService.login(this.credenciales.value).subscribe(
        async (res) => {
          await loading.dismiss();
          this.router.navigateByUrl('', { replaceUrl: true });
        }, async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  validarForm(credencial: any) {
    const errors = {};

    if (!credencial.value.username) {
      errors['username'] = 'El username es requerido';
    }

    if (!credencial.value.password) {
      errors['password'] = 'El password es requerido';
    }

    // console.log('error: ', errors);
    return errors;
  }

  // verPassword(evento){
  //   let eye = document.getElementById('login-eye');
  //   console.log('ver password: ', eye);
  //   // console.log('ver password: ', eye.attributes);
  //   // console.log('ver password: ', eye.attributes.getNamedItem('name'));
  //   // console.log('ver password: ', eye.attributes.set('name'));
  // }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
