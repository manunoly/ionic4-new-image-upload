import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingService } from './loading.service';

@Injectable()
export class CameraService {
  myphoto: any;
  options: any;

  constructor( public camera: Camera, public loader: LoadingService ) { }

  async getImageFromPhone(type: any) {
    this.loader.show('');
    const options1: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true
    };
    const options2: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
      };

    if (type === 'cover' ) {
      this.options = options1;
    } else if (type === 'avatar') {
      this.options = options2;
    }

    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then((imageData) => {
          this.myphoto = 'data:image/jpeg;base64,' + imageData;
          this.loader.hide();
            resolve(this.myphoto);
        }, (err) => {
          this.loader.hide();
          reject(err);
        });
    });

  }

  async takePhoto(type: any) {
    this.loader.show('');
    const options1: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
    };
    const options2: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
      };

    if (type === 'cover') {
      this.options = options1;
    } else if (type === 'avatar') {
      this.options = options2;
    }

    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then((imageData) => {
        this.myphoto = 'data:image/jpeg;base64,' + imageData;
        this.loader.hide();
        resolve(this.myphoto);
      }, (err) => {
        reject(err);
        this.loader.hide();
      });
    });

  }

}
