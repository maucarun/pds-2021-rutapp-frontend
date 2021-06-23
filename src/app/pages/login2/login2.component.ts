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
  credentials: FormGroup;
  picture: string;
  name: string;
  email: string;

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
  }
  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],//['homer', [Validators.required]],
      password: ['', [Validators.required]],//['abcd1', [Validators.required]],
    });
    this.menu.enable(false);
  }

  // go to register page
  registro() {
    // console.log('ir a RegisterPage');
    this.router.navigateByUrl('registro', { replaceUrl: true });
  }

  // login and go to home page
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('', { replaceUrl: true });
      }, async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          // message: res.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async loginGoogle() {
    //loginGoogle es registrarse también
    this.loginGoogleOFacebook(new firebase.auth.GoogleAuthProvider());

    // const loading = await this.loadingController.create();
    // await loading.present();

    // try {
    //   const resDeFirebase = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    //   this.credentials = this.fb.group({
    //     username: [resDeFirebase.user.displayName.split(' ')[0].toString(), [Validators.required]],
    //     password: [resDeFirebase.user.uid.toString(), [Validators.required]],
    //   });

    //   // console.log('***Usuario google: ', this.credentials.value);
    //   this.authService.login(this.credentials.value).subscribe(
    //     async (res) => {
    //       await loading.dismiss();
    //       this.router.navigateByUrl('', { replaceUrl: true });
    //     }, async (res) => {
    //       await loading.dismiss();
    //       const alert = await this.alertController.create({
    //         header: 'Login failed',
    //         // message: res.error,
    //         buttons: ['OK'],
    //       });

    //       await alert.present();
    //     }
    //   );
    // } catch (error) {
    //   console.error(error);
    // }

  }

  // loginFacebook() {
  //   console.log('Login con Facebook');
  // }
  async loginFacebook() {
    this.loginGoogleOFacebook(new firebase.auth.FacebookAuthProvider());
    // const res = await this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

    // const user = res.user;

    // console.log('Usuario de Facebook: ', user);

    // this.picture = user.photoURL;

    // this.name = user.displayName;

    // this.email = user.email;

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

  async loginGoogleOFacebook(proveedorDeDatos){
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const resDeFirebase = await this.afAuth.signInWithPopup(proveedorDeDatos);
      // const resDeFirebase = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

      this.credentials = this.fb.group({
        username: [resDeFirebase.user.displayName.split(' ')[0].toString(), [Validators.required]],
        password: [resDeFirebase.user.uid.toString(), [Validators.required]],
      });

      // console.log('***Usuario google: ', this.credentials.value);
      this.authService.login(this.credentials.value).subscribe(
        async (res) => {
          await loading.dismiss();
          this.router.navigateByUrl('', { replaceUrl: true });
        }, async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            // message: res.error,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
