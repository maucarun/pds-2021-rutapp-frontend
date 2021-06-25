import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss', './../../app.component.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario;
  onlyView = true;
  errorRegistro = {};

  constructor(
    private authService: AuthenticationService,
    private usuarioService: UsuarioService,
    private loading: LoadingService,
    private toastController: ToastController,
    private router: Router,
    public alertController: AlertController,
  ) {
    this.authService.loadsData();
  }

  ngOnInit() {
    const user = this.authService.getUser();
    this.cargarUsuario(user);

    this.usuarioService.getUsuarioById(JSON.parse(user).idUsuario)
      .then((res) => {
        console.log('Usuario perfil: ', res);
        this.usuario = res;
      })
      .catch((e) => {
        this.presentToast('Oops algo salio mal');
        setTimeout(() => this.redirigirA('clientes'), 2000);

      });
  }

  cargarUsuario(usuarioLocalStorage) {
    const user = {
      idUsuario: JSON.parse(usuarioLocalStorage).idUsuario,
      username: JSON.parse(usuarioLocalStorage).username,
      nombre: JSON.parse(usuarioLocalStorage).nombre,
      apellido: JSON.parse(usuarioLocalStorage).apellido,
      email: JSON.parse(usuarioLocalStorage).email,
      password: JSON.parse(usuarioLocalStorage).password,
      activo: true,
    };
    console.log('inicio cargarUsuario: ', user);
    this.usuario = user;
    console.log('fin cargarUsuario: ');
  }

  editarPerfil() {
    // this.onlyView = false;//habilito la edición de los campos
    this.cambiarEstadoDeVista();
  }

  cambiarEstadoDeVista() {
    this.onlyView = !this.onlyView;
  }

  handlerChange(evento: any): void {
    // const { name, value } = evento.target;
    this.errorRegistro = this.validarForm(this.usuario);
  }

  validarForm(usuario: Usuario) {
    const errors = {};

    if (!usuario.nombre) {
      // if (!formulario.value.username) {
      errors['nombre'] = 'El nombre es requerido';
    }

    if (!usuario.apellido) {
      // if (!formulario.value.username) {
      errors['apellido'] = 'El apellido es requerido';
    }

    if (!usuario.email) {
      // if (!formulario.value.username) {
      errors['email'] = 'El email es requerido';
    } else if (!this.validateEmail(usuario.email)) {
      errors['email'] = 'El email es invalido';
    }

    if (!usuario.password) {
      errors['password'] = 'El password es requerido';
    } else if (!this.validarPassword(usuario.password)) {
      errors['password'] = 'El password es invalido';
    }

    if (!usuario.username) {
      errors['username'] = 'El username es requerido';
    }

    // console.log('error: ', errors);
    return errors;
  }

  validateEmail(email: string): boolean {
    // eslint-disable-next-line max-len
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  validarPassword(password: string): boolean {
    // Contain at least 8 characters
    // contain at least 1 number
    // contain at least 1 lowercase character (a-z)
    // contain at least 1 uppercase character (A-Z)
    // contains only 0-9a-zA-Z
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return regex.test(String(password));
  }

  async guardarPerfil() {
    //Verificar que no queden los campos vacios
    console.log('Guardando perfil...');
    this.errorRegistro = this.validarForm(this.usuario);
    //verifico que no haya ningún error en el formulario
    if (Object.keys(this.errorRegistro).length) {
      const alert = await this.alertController.create({
        header: 'Faltan completar campos',
        buttons: ['OK'],
      });
      return await alert.present();
    };
    // const loading = await this.loadingController.create({message: 'Espere un momento'});
    this.loading.present('Cargando...');
    this.usuarioService.actualizarUsuario(this.usuario.idUsuario, this.usuario)
      .then(
        () => {
          this.loading.dismiss();
          this.presentToast('Se ha actualizado correctamente!');
        },
        error => {
          console.log(error);
          this.presentToast('Oops algo salio mal');
          this.loading.dismiss();
        }
      );

    this.cambiarEstadoDeVista();

  }
  //convertirlo en servicio
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
  //convertirlo en servicio
  redirigirA(destino: string) {
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }
}
