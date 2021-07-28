import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async presentToast(infoMessage: string, duracionMs?: number) {
    var toastDuracion = 2000;

    if (duracionMs != undefined || duracionMs != null)
      toastDuracion = duracionMs;

    const toast = await this.toastController.create({
      message: infoMessage,
      duration: toastDuracion
    });
    toast.present();
  }

}