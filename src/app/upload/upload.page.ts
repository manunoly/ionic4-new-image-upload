import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  // NavParams,
  ToastController
} from '@ionic/angular';

import { Camera } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';

export interface ApiResponse {
  success: string;
  object: any;
  message: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  userId = 123;
  baseUrl = 'https://mobileapp.ipbaccess.com';
  pageTitle = 'Loren ipsum';

  public loading;
  public myPhoto: any;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public camera: Camera,
    public file: File,
    public loadingCtrl: LoadingController,
    // public navParams: NavParams,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
    ) { }

  ngOnInit() {
  }

  async presentActionSheet() {

    const random = Math.floor(Math.random() * 100);
    const type = 'avatar';
    const name = type + '-photo-u' + 1 + '-' + random + '.jpg';

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload Image',
      buttons: [        {
        text: 'From camera',
        handler: () => {
          this.fromCamera(name);
        }
      },
      {
        text: 'From Gallery',
        handler: () => {
          this.fromGallery(name);
        }
      },
      {
        text: 'Cancel'
      }]
    });
    await actionSheet.present();
  }

  private fromCamera(name) {
    this.camera.getPicture({
      quality: 50,
      targetWidth: 360,
      targetHeight: 360,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.PNG,
      allowEdit: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData, name);
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  private fromGallery(name): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 50,
      targetWidth: 360,
      targetHeight: 360,
      encodingType: this.camera.EncodingType.PNG,
      allowEdit: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData, name);
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  private uploadPhoto(imageFileUri: any, name: any): void {
    this.file.resolveLocalFilesystemUrl(imageFileUri).then(entry => {
      console.log('reading entry', entry);
      (entry as FileEntry).file(file => {
        file.name = name;
        this.readFile(file);
      });
    }).catch(err => console.log(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    console.log('reading file', file);
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  private postData(formData: FormData) {
    this.uploadImage(formData, this.userId).then((result: ApiResponse) => {
      this.dismissLoader();
      console.log('SUCCESS!');

    }, (err) => {
      this.dismissLoader();
      console.log(err);
    });
  }

  private uploadImage(formData, userId) {
    return new Promise((resolve, reject) => {
      this.post('ipba/image_upload.php', {
          id: userId
        }, formData
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  private post(endpoint: string, params: any = null, body: any = null) {
    return this.http.post<ApiResponse>(this.baseUrl + '/' + endpoint, body, {
      params
    });
  }

  /*
  private showLoader(message: string = 'loading') {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.present();
  }
  */

  private dismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

}
