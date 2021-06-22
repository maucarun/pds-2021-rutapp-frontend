import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  errorMessage = '';
  picture;
  name;
  email;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private menu: MenuController,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],//['homer', [Validators.required]],
      password: ['', [Validators.required]],//['abcd1', [Validators.required]],
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
  // var provider = new firebase.auth.GoogleAuthProvider();
  async loginGoogle() {
    //loginGoogle es registrarse también
    const res = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = res.user;
    console.log(user);
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
  }

  loginFacebook() {
    console.log('Login con Facebook');
  }



// Aa: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ZGYxMzgwM2I3NDM2NjExYWQ0ODE0NmE4ZGExYjA3MTg2ZmQxZTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2ViYXN0aWFuIEF2aWxhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlHdkN1N251MHRUSENGNmJPZVNpQkxEcjFLVjRPdGRRNHd3Tm9BPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3J1dGFwcC0yMDIxIiwiYXVkIjoicnV0YXBwLTIwMjEiLCJhdXRoX3RpbWUiOjE2MjQxNDY4NTUsInVzZXJfaWQiOiJUNGdZejF2UUdHZmp0cGdpa1pxRzg2MUJndW4xIiwic3ViIjoiVDRnWXoxdlFHR2ZqdHBnaWtacUc4NjFCZ3VuMSIsImlhdCI6MTYyNDE0Njg1NSwiZXhwIjoxNjI0MTUwNDU1LCJlbWFpbCI6ImF2aWxhdHVhbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNzk3MDEyODE0MDUwNzY2MjI5OCJdLCJlbWFpbCI6WyJhdmlsYXR1YW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.mN8EdE9DWrKz3oJMS9lTaBeOIjeXuQtW2IEg9-YCvxFEw_2Ut_SO6GDtf8fJwSrO-LMb5T7kiz20LEoeK8UIN8fpIXpT3TYp842imVLH9_dYQxlYBz4sX-cB-EgJZreOivsa9pLWHEx9CrB5mgQ_lyBQYoH6_czaz8IF-HGL-k5YGGaCu9WlF5Ql1MZp5T5VkYDLHKvgQDBqmD4HSetOVZqDZQZGVbg2Del68NJ_qMXfMVgVVuEYCiIK7y4UXP_Vui3OmPJaQTMlNnBJ02M8Z3prIeVaoZ7nZ9rUBv7J6kzGkikdQWHyimWghwvpXsNbpB-47kM7oQE2kb3274e34Q"
// Ba: function Ba(f)
// D: Object { c: 30000, f: 960000, a: 30000, … }
// N: Array[]
// Oa: function Oa(f)
// P: true
// Pa: function Pa(f)
// S: Object { a: { … }, b: [], c: (), … }
// W: Array[()]
// _lat: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ZGYxMzgwM2I3NDM2NjExYWQ0ODE0NmE4ZGExYjA3MTg2ZmQxZTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2ViYXN0aWFuIEF2aWxhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlHdkN1N251MHRUSENGNmJPZVNpQkxEcjFLVjRPdGRRNHd3Tm9BPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3J1dGFwcC0yMDIxIiwiYXVkIjoicnV0YXBwLTIwMjEiLCJhdXRoX3RpbWUiOjE2MjQxNDY4NTUsInVzZXJfaWQiOiJUNGdZejF2UUdHZmp0cGdpa1pxRzg2MUJndW4xIiwic3ViIjoiVDRnWXoxdlFHR2ZqdHBnaWtacUc4NjFCZ3VuMSIsImlhdCI6MTYyNDE0Njg1NSwiZXhwIjoxNjI0MTUwNDU1LCJlbWFpbCI6ImF2aWxhdHVhbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNzk3MDEyODE0MDUwNzY2MjI5OCJdLCJlbWFpbCI6WyJhdmlsYXR1YW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.mN8EdE9DWrKz3oJMS9lTaBeOIjeXuQtW2IEg9-YCvxFEw_2Ut_SO6GDtf8fJwSrO-LMb5T7kiz20LEoeK8UIN8fpIXpT3TYp842imVLH9_dYQxlYBz4sX-cB-EgJZreOivsa9pLWHEx9CrB5mgQ_lyBQYoH6_czaz8IF-HGL-k5YGGaCu9WlF5Ql1MZp5T5VkYDLHKvgQDBqmD4HSetOVZqDZQZGVbg2Del68NJ_qMXfMVgVVuEYCiIK7y4UXP_Vui3OmPJaQTMlNnBJ02M8Z3prIeVaoZ7nZ9rUBv7J6kzGkikdQWHyimWghwvpXsNbpB-47kM7oQE2kb3274e34Q"
// a: Object { c: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw", l: "https://securetoken.googleapis.com/v1/token", h: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/", … }
// aa: Array[]
// b: Object { u: 1624147044312, D: "rutapp-2021.firebaseapp.com", v: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw", … }
// ba: function ()
// bc: Object { l: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw", m: "angular-auth-firebase", s: "rutapp-2021.firebaseapp.com", … }
// displayName: "Sebastian Avila"
// email: "avilatuan@gmail.com"
// emailVerified: true
// h: Object { f: { … }, a: "AGEhc0Dcdo4Q6Ec94Z34H1nAJHvku5TUb-I0r8PG8MbxrAKKV7Xz5fnzuoX2XOUOk9jnc8xgPGtH-Kt8tCrZpqbYHHjmDg8BTlyuhjOXLKmBvte-IzO9RyJPSaeNDIhtt9zBxQMMCwto1-Z14ONhk6s71kTsBAbUFYoF3Cj0hrhQOURKCc3IreZhYC4ZG5x6rJQpzEz-AHK8HmOoF1-70aprNXPJEu7Ef9vZL-8xvRYedS3L_1zHSZzpKuPpvd22Q8bD_mdXmVtY19cxjy-CTxwhuVwOj-YcJSQ9__LWGjNwcmi9ml-EtKwJfsn8iPZ6uiaL9lqvJXEDDSSk46M_RyYxPbggjuqoH_rxx9qe8lujgtHeL8ezFnZDADqk0fOwq9kzWRprCSoZLd5S3hXNsnMRPcP6iD36oQ", c: 1624150644770, … }
// ha: Object { a: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw:angular-auth-firebase", b: { … } }
// hb: null
// i: null
// isAnonymous: false
// ja: Object { l: false, settings: { … }, W: "T4gYz1vQGGfjtpgikZqG861Bgun1", … }
// l: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw"
// m: "angular-auth-firebase"
// metadata: Object { a: "1624146855384", b: "1624147066005", lastSignInTime: "Sat, 19 Jun 2021 23:57:46 GMT", … }
// multiFactor: Object { a: { … }, b: [], c: (), … }
// pa: undefined
// phoneNumber: null
// photoURL: "https://lh3.googleusercontent.com/a/AATXAJyGvCu7nu0tTHCF6bOeSiBLDr1KV4OtdQ4wwNoA=s96-c"
// providerData: Array[{ … }]
// qa: Object { l: false, settings: { … }, W: "T4gYz1vQGGfjtpgikZqG861Bgun1", … }
// refreshToken: "AGEhc0Dcdo4Q6Ec94Z34H1nAJHvku5TUb-I0r8PG8MbxrAKKV7Xz5fnzuoX2XOUOk9jnc8xgPGtH-Kt8tCrZpqbYHHjmDg8BTlyuhjOXLKmBvte-IzO9RyJPSaeNDIhtt9zBxQMMCwto1-Z14ONhk6s71kTsBAbUFYoF3Cj0hrhQOURKCc3IreZhYC4ZG5x6rJQpzEz-AHK8HmOoF1-70aprNXPJEu7Ef9vZL-8xvRYedS3L_1zHSZzpKuPpvd22Q8bD_mdXmVtY19cxjy-CTxwhuVwOj-YcJSQ9__LWGjNwcmi9ml-EtKwJfsn8iPZ6uiaL9lqvJXEDDSSk46M_RyYxPbggjuqoH_rxx9qe8lujgtHeL8ezFnZDADqk0fOwq9kzWRprCSoZLd5S3hXNsnMRPcP6iD36oQ"
// s: "rutapp-2021.firebaseapp.com"
// tenantId: null
// u: null
// uid: "T4gYz1vQGGfjtpgikZqG861Bgun1"
// v: Object { src: { … }, a: { … }, b: 4 }
// ya: false
// za: null
}


//DATOS A TENER EN CUENTA
// l: "AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw" AIzaSyDNZZsx5SoIYN6BHorLq3kgDpAuCmvLBsw
// m: "angular-auth-firebase"

// s: "rutapp-2021.firebaseapp.com"
// uid: T4gYz1vQGGfjtpgikZqG861Bgun1  T4gYz1vQGGfjtpgikZqG861Bgun1
// displayName: "Sebastian Avila"
// email: "avilatuan@gmail.com"
// photoURL: "https://lh3.googleusercontent.com/a/AATXAJyGvCu7nu0tTHCF6bOeSiBLDr1KV4OtdQ4wwNoA=s96-c"
// refreshToken: "AGEhc0Dcdo4Q6Ec94Z34H1nAJHvku5TUb-I0r8PG8MbxrAKKV7Xz5fnzuoX2XOUOk9jnc8xgPGtH-Kt8tCrZpqbYHHjmDg8BTlyuhjOXLKmBvte-IzO9RyJPSaeNDIhtt9zBxQMMCwto1-Z14ONhk6s71kTsBAbUFYoF3Cj0hrhQOURKCc3IreZhYC4ZG5x6rJQpzEz-AHK8HmOoF1-70aprNXPJEu7Ef9vZL-8xvRYedS3L_1zHSZzpKuPpvd22Q8bD_mdXmVtY19cxjy-CTxwhuVwOj-YcJSQ9__LWGjNwcmi9ml-EtKwJfsn8iPZ6uiaL9lqvJXEDDSSk46M_RyYxPbggjuqoH_rxx9qe8lujgtHeL8ezFnZDADqk0fOwq9kzWRprCSoZLd5S3hXNsnMRPcP6iD36oQ"
// phoneNumber: null


// displayName: "abecaman rutapp"
// email: "rutapp2021@gmail.com"
// phoneNumber: null
// photoURL: "https://lh3.googleusercontent.com/a/AATXAJyJoOxVp0p84mQBJFjppmRrz6rQhR44bCyHqrUc=s96-c"
// uid: "C5l3HSzBqlg24QIvLC5DhkhcIAH2"
