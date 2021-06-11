import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service'
// import { AuthenticationService } '../../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: UsuarioService, private router: Router, private menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false)
  }

  errorMessage: string = '';

  login(form: NgForm) {
      this.authService.login(form.value.user, form.value.password)
      .then(()=>{
        this.menu.enable(true)
        this.router.navigate(['clientes']) 
      })
      .catch(
        ()=>{console.log('credenciales invalidas')
        this.errorMessage = 'credenciales invalidas'} 
      )
  }
}
