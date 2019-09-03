import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoadingService } from './loading.service';
import { ApiProvider } from './api';

@Injectable()
export class ImageUploadService {
  constructor(
    private platform: Platform,
    private loader: LoadingService,
    private api: ApiProvider,
    ) {
  }

  // ----------------------------
  // UPLOAD FILE
  // ----------------------------
  public imageUpload(data: any, type: any, userid: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const postData = new FormData();
      postData.append('data', data);
      postData.append('type', type);
      postData.append('userid', userid);
      postData.append('name', 'test.jpg');

      const seq = this.api.post('ipba/image_upload.php', postData).pipe();
      seq.subscribe((res: any) => {
        resolve(res);
        console.log(res);
      }, err => {
        reject(err);
        console.error('ERROR', err);
      });
    });
  }
}
