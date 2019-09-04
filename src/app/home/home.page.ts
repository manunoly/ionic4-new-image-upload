import { Component, OnInit } from '@angular/core';
import { Platform, ActionSheetController} from '@ionic/angular';
// import { LoadingService } from './loading.service';
// import { CameraService } from './camera.service';
import { ImageUploadService } from '../services/image-upload.service';
// import { LoadingService } from '../services/loading.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  myPhoto: any;
  options: any;
  lastimage: any;

  constructor(
    private image: ImageUploadService,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    // private loading: LoadingService,
    public platform: Platform) {}

    async ngOnInit() {

  }

  async presentActionSheet(type: any) {
    const userid = 1;
    const random = Math.floor(Math.random() * 100);
    const name = type + '-photo-u' + userid + '-' + random + '.jpg';
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload Image',
      buttons: [        {
        text: 'From Camera',
        handler: () => {
          this.fromCamera(name, type);
        }
      },
      {
        text: 'From Gallery',
        handler: () => {
          this.fromGallery(name, type);
        }
      },
      {
        text: 'Cancel'
      }]
    });
    await actionSheet.present();
  }

  private fromCamera(name: any, type: any) {
    const target = (type === 'avatar') ? 360 : 0;
    this.camera.getPicture({
      quality: 70,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      allowEdit: true,
      targetWidth: target,
      targetHeight: target
    }).then(imageData => {
      // this.myPhoto = 'data:image/jpeg;base64,' + imageData;
      this.myPhoto = imageData;
      this.image.uploadPhoto(imageData, name).then( res => {
        console.log(type + 'image path: ', res);
        this.lastimage = res;
      });
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  private fromGallery(name: any, type: any): void {
    const target = (type === 'avatar') ? 360 : 0;
    this.camera.getPicture({
      quality: 70,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.PNG,
      targetWidth: target,
      targetHeight: target,
      allowEdit: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.image.uploadPhoto(imageData, name).then(res => {
        console.log(type + 'image path: ', res);
        this.lastimage = res;
      });
    }, error => {
      console.log(JSON.stringify(error));
    });
  }


}
