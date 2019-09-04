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

  async uploadPhoto(imageFileUri: any, name: any) {
    return new Promise((resolve, reject) => {
    // this.loading.show('Yükleniyor...');
    this.file.resolveLocalFilesystemUrl(imageFileUri).then(entry => {
      (entry as FileEntry).file(file => {
        const reader = new FileReader();
        const formData = new FormData();
        reader.onloadend = () => {
          const imgBlob = new Blob([reader.result], {type: file.type});
          formData.append('file', imgBlob, name);
            this.post('ipba/image_upload.php', {}, formData
            ).subscribe(response => {
              resolve(response);
            }, err => {
              console.log(err);
              reject(err);
            });        
          };
          reader.readAsArrayBuffer(file);
      });
    }).catch(err => console.log(err));
    });
  }

  private post(endpoint: string, params: any = null, body: any = null) {
    return this.http.post<ApiResponse>(this.baseUrl + '/' + endpoint, body, {
      params
    });
  }

}
