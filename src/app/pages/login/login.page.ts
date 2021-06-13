import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['homer', [Validators.required]],
      password: ['abcd1', [Validators.required]],
    });
    this.menu.enable(false);
  }

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

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

}
