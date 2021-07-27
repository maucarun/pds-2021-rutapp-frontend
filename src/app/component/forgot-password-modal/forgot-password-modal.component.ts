/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent implements OnInit {
  credenciales: FormGroup;
  errorCredenciales: any;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    public menu: MenuController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }


  ngOnInit() {
    this.credenciales = this.fb.group({
      // username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      // password: ['', [Validators.required]],
    });
    this.menu.enable(false);
  }

  //Anota todos los cambios de los input y valida
  handlerChange(evento: any): void {
    // const { name, value } = evento.target;
    this.errorCredenciales = this.validarForm(this.credenciales);
    console.log('credenciales: ', this.errorCredenciales);
  }

  async enviarClave() {
    //verifico que los campos esten llenos
    this.errorCredenciales = this.validarForm(this.credenciales);
    //si hay errores abro un alert
    if (Object.keys(this.errorCredenciales).length) {
      const alert = await this.alertController.create({
        header: 'Faltan completar campos',
        buttons: ['OK'],
      });
      return await alert.present();
    }
    //loading
    const loading = await this.loadingController.create({ message: 'Verificando datos' });
    await loading.present();

    // que haga lo que tenga que hacer llamar al servicio

    await this.modalController.dismiss(this.seleccionados, 'agregar');
  }

  async cancelar() {
    await this.modalController.dismiss(null, 'cancelar');
  }

  get seleccionados() {
    // return this.remitos.filter(e => e.seleccionado);
    return console.log('clave enviada!');
  }

  validarForm(credencial: any) {
    const errors = {};

    if (!credencial.value.email) {
      errors['email'] = 'El email es requerido';
    }

    return errors;
  }
}
