import { Component, OnInit } from '@angular/core';
import { Platform} from '@ionic/angular';
import { LoadingService } from './loading.service';
import { CameraService } from './camera.service';
import { ImageUploadService } from './image-upload.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  imagePaths: string[];

  // loadingSpinner = this.loadingCtrl.create({ content: 'Loading images...' });
  // uploadingSpinner = this.loadingCtrl.create({ content: 'Uploading images...' });

  isDesktop: boolean;
  userid = 1;
  type = 'avatar';

  constructor(
    private image: ImageUploadService,
    private loading: LoadingService,
    private camera: CameraService,
    public platform: Platform) {}

  async ngOnInit() {
    this.isDesktop = this.platform.is('android');
    try {
      // this.loading.show('Yükleniyor');
      // await this.loadImagePaths();
      // this.loading.hide();
    } catch (error) {
      // console.log(error);
      // this.loading.hide();
    }
  }

  async getFromGallery() {
    this.camera.getImageFromPhone(this.type).then( data => {
      console.log('Galeri Image Data: ', data);
      this.image.imageUpload(data, this.type, this.userid).then (res => {
        console.log('image upload from gallery: ', res);
      });
    });
  }

  async takePhoto() {
    this.camera.takePhoto(this.type).then( data => {
      console.log('Take Photo Image Data: ', data);
      this.image.imageUpload(data, this.type, this.userid).then (res => {
        console.log('image upload from take photo: ', res);
      });
    });
  }



}
