/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, AlertController, ToastController, MenuController, LoadingController, ModalController } from '@ionic/angular';
import firebase from 'firebase/app';
import { ForgotPasswordModalComponent } from 'src/app/component/forgot-password-modal/forgot-password-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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
    //firebase
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService,
    //plugin
    private platform: Platform,
    private googlePlus: GooglePlus
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

  // loginGoogle() {
  //   if (this.platform.is('android')) {
  //     this.loginGoogleAndroid();
  //   } else {
  //     this.loginGoogleWeb();
  //   }
  // }
  async loginGoogle(): Promise<void> {
    if (this.platform.is('android')) {
      // this.loginGoogleAndroid();
      const res = await this.googlePlus.login({
        webClientId: '',
        offline: true
      });
      await this.loginGoogleOFacebookWeb(firebase.auth.GoogleAuthProvider.credential(res.idToken));
    } else {
      // this.loginGoogleWeb();
      await this.loginGoogleOFacebookWeb(new firebase.auth.GoogleAuthProvider());
    }
  }
  // async loginGoogleAndroid() {
  //   const res = await this.googlePlus.login({
  //     webClientId: '',
  //     offline: true
  //   });
  //   const resConfirmed = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));

  //   const user = resConfirmed.user;
  //   // this.picture = user.photoURL;
  //   // this.name = user.displayName;
  //   // this.email = user.email;
  // }

//   async loginGoogleWeb() {
//     const res = await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
//
//const user = res.user;
//     console.log(user);
//     this.picture = user.photoURL;
//     this.name = user.displayName;
//     this.email = user.email;
//   }
//   ...
// }
  async loginFacebook(): Promise<void> {
    await this.loginGoogleOFacebookWeb(new firebase.auth.FacebookAuthProvider());
  }

  forgotPass() {
    //enviar un mail con la contraseña
    console.log('Se olvidó la contraseña');
    // this.mostrarModalRemitos();
    this.mostrarInputEmail();
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

  async loginGoogleOFacebookWeb(proveedorDeDatos): Promise<void> {
    const loading = await this.loadingController.create({ message: 'Verificando datos' });
    await loading.present();
    let resDeFirebase;
    try {
      if (this.platform.is('android')) {
        resDeFirebase = await this.afAuth.signInWithCredential(proveedorDeDatos);
        // resDeFirebase = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
      }else{
        resDeFirebase = await this.afAuth.signInWithPopup(proveedorDeDatos);
      }
      // const resDeFirebase = await this.afAuth.signInWithPopup(proveedorDeDatos);
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

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async mostrarInputEmail() {
    const msjConfirmacion = await this.alertController.create({
      header: 'Confirme',
      message: '¿Está seguro que quiere reestablecer la contraseña?',
      inputs: [
        {
          name: 'email',
          placeholder: 'juan@perez.com',
          type: 'email'
        },
        // {
        //   name: 'password',
        //   placeholder: 'Password',
        //   type: 'password'
        // }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          // handler: async () => {
          //   // await this.productoService.delete(this.productoId)
          //   //   .then(() => {
          //   //     this.toastService.presentToast('Eliminado el producto ' + this.producto.nombre);
          //   //     this.redirigirAProductos();
          //   //   })
          //   //   .catch(err => {
          //   //     console.log(err);
          //   //     this.toastService.presentToast(err.error.message);
          //   //   });
          // }
          handler: data => {
            console.log('data: ', data);
            //1) verificar si este email existe en bd
            //2) generar una clave aleatoria
            const clave = this.generatePassword(8);
            console.log('clave: ', clave);
            //3) actualizar la nueva clave en bd
            this.usuarioService.guardarNuevaContraseñaGenerada(data.email, clave).then((res)=>{
              console.log('enviar un mail con la clave: ', clave);
            }).catch(e=>{
              console.error(e);
              // this.toastService.presentToast(err.error.message);
            });
            //4) enviar un mail al correo brindado (pendiente)
            //5) - si el correo no existe en bd "usuario inexistente"
            return true;
            // if (User.isValid(data.username, data.password)) {
            //   // logged in!
            // } else {
            //   // invalid login
            //   return false;
            // }
          }
        }
      ]
    });
    await msjConfirmacion.present();
  }
  //generar contraseña
  generatePassword(logitud: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < logitud; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  // let r = Math.random().toString(36).substring(7);
}
