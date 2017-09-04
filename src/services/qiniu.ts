import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import 'rxjs/add/operator/toPromise';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class QiniuService {
  private tokenApi = 'http://localhost:3000/qiniu/token';

  constructor(private http: Http, @Inject('IMGURL') private ImgUrl: any, private transfer: FileTransfer) { }
  public fileTransfer: FileTransferObject = this.transfer.create();


  getToken(): Observable<any> {
    //七牛token随时获取
    return this.http.get(this.tokenApi)
      .map((res: Response) => res.json())
      .do(res => {
        window.localStorage.setItem('qiniu_token', res.token);
        window.localStorage.setItem('qiniu_token_time', (new Date()).getTime().toString());
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    // let token = window.localStorage.getItem('qiniu_token');
    // let tokenTime = window.localStorage.getItem('qiniu_token_time');
    // //token 存储7天
    // if (token && tokenTime && ((new Date()).getTime() - Number(tokenTime)) <= 1000*60*60*24*7) {
    //   return new Observable(observer => {
    //     observer.next({token:token});
    //     observer.complete();
    //   })
    // } else {
    //   return this.http.get(this.tokenApi)
    //     .map((res: Response) => res.json())
    //     .do(res => {
    //         window.localStorage.setItem('qiniu_token',res.token);
    //         window.localStorage.setItem('qiniu_token_time',(new Date()).getTime().toString());
    //     })
    //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    // }
  }

  addImage(imgData: any): Observable<any> {
    return new Observable(observer => {
      this.getToken().subscribe(tokenRes => {
        let fd = new FormData();
        fd.append('file', imgData);
        fd.append('token', tokenRes.token);
        // console.log(this.ImgUrl);
        //angular2 不需要设置header
        this.http.post('http://up.qiniu.com/', fd)
          .map((res: Response) => res.json())
          .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
          .subscribe(res => {
            observer.next(this.ImgUrl + res.hash);
            observer.complete();
          })
      })
    })
  }

  nativeUpload(fileUrl: string): Observable<any> {
    return new Observable(observer => {
      this.getToken().subscribe(tokenRes => {
        let param = {
          token: tokenRes.token
        }
        let options: FileUploadOptions = {
          params: {
            token: tokenRes.token
          }
        }
        this.fileTransfer.upload(fileUrl, encodeURI('http://up.qiniu.com/'), options).then(result => {
          if (result.responseCode == 200) {
            let resData = JSON.parse(result.response);
            observer.next(this.ImgUrl + resData.hash);
          } else {
            Observable.throw('上传失败');
          }
        }).catch(err => {
          Observable.throw('上传失败');
        });
      })
    })
  }
}
