import { Injectable, Inject }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class QiniuService {
  private tokenApi = 'http://localhost:3000/qiniu/token';

  constructor(private http: Http, @Inject('IMGURL') private ImgUrl: any) { }

  getToken(): Observable<any> {
    return this.http.get(this.tokenApi)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
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
            observer.next(this.ImgUrl+res.hash);
            observer.complete();
          })
      })
    })
  }
}
