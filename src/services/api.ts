import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from "angular2-jwt";

import { Map, Location } from '../common/models';
import { ENV } from '@app/env';

@Injectable()
export class ApiService {
  private serverHost = ENV.API_URL;

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getMaps(): Observable<any> {
    return this.http.get(this.serverHost + '/map/list')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getMapById(mapId): Observable<any> {
    return this.http.get(this.serverHost + '/map?mapId=' + mapId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getLocationById(locationId): Observable<any> {
    return this.http.get(this.serverHost + '/map/location?locationId=' + locationId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getMapLocations(mapId): Observable<any> {
    return this.http.get(this.serverHost + '/map/locations')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  addNewMap(map: Map): Observable<any> {
    return this.authHttp.post(this.serverHost + '/map', map)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  addNewLocation(location: Location): Observable<any> {
    return this.authHttp.post(this.serverHost + '/map/location', location)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  signup(userInfo: any): Observable<any> {
    return this.http.post(this.serverHost + '/user/signup', userInfo)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  updateUser(userInfo: any): Observable<any> {
    return this.authHttp.post(this.serverHost + '/user/update', userInfo)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  login(data: any): Observable<any> {
    return this.http.post(this.serverHost + '/user/login', data)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  sendMsgCode(phone: string): Observable<any> {
    return this.http.post(this.serverHost + '/user/msgCode', { phone: phone })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getUserInfo(userId: string): Observable<any> {
    return this.http.get(this.serverHost + '/user?userId=' + userId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
  getUserMaps(userId: string): Observable<any> {
    return this.authHttp.get(this.serverHost + '/map/usermaps?userId=' + userId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getComments(pageId: string): Observable<any> {
    return this.http.get(this.serverHost + '/comment?pageId=' + pageId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getMapCommentCount(pageId: string): Observable<any> {
    return this.http.get(this.serverHost + '/comment/count?pageId=' + pageId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getMapLikeInfo(pageId: string): Observable<any> {
    return this.http.get(this.serverHost + '/like/info?targetId=' + pageId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  sendComment(commentData: any): Observable<any> {
    return this.authHttp.post(this.serverHost + '/comment', commentData)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  sendLike(likeData: any): Observable<any> {
    return this.authHttp.post(this.serverHost + '/like', likeData)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
}
