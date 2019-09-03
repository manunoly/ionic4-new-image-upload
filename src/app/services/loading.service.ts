import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor( public loadingController: LoadingController ) {
  }

  async show(message: string) {

    const loading = await this.loadingController.create({
      message,
      duration: 5000
    });
    await loading.present();

  }

  async hide() {
    this.loadingController.dismiss();
  }

}


