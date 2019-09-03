import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { Storage } from '@ionic/storage';
 
export interface ApiResponse {
  success: string;
  object: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  baseUrl = 'https://mobileapp.ipbaccess.com';

  constructor(
    public file: File,
    public http: HttpClient,
    public loading: LoadingService,
    public storage: Storage
  ) { }

  public uploadPhoto(imageFileUri: any, name: any): void {
    this.loading.show('Yükleniyor...');
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
    this.uploadImage(formData).then(() => {
      this.loading.hide();
      console.log('SUCCESS!');
    }, (err) => {
      this.loading.hide();
      console.log(err);
    });
  }

  private uploadImage(formData: any) {
    return new Promise((resolve, reject) => {
      this.post('ipba/image_upload.php', {}, formData
      ).subscribe(response => {
        console.log('image upload return code');
        this.storage.set('last_image_path', response);
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

}
