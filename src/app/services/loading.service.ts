import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  /**
   *
   * @param message Es el mensaje que se quiere mostrar.
   * @returns {*} Retorna un modal loading.
   */
  async present(message: string) {
    this.isLoading = true;
    return await this.loadingController.create({
        message: message||'Cargando...',
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => {
            // console.log('Cerrando carga de datos')
          });
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() =>{
      //  console.log('dismissed')
      });
  }
}
