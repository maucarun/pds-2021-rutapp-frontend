import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario;
  onlyView = true;
  constructor(
    private authService: AuthenticationService,
    private usuarioService: UsuarioService,
    private loading: LoadingService,
    private toastController: ToastController,
    private router: Router,
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

  async guardarPerfil() {
    //Verificar que no queden los campos vacios
    console.log('Guardando perfil...');
    this.loading.present();
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
