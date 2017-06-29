import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Map, Location } from '../common/models';

@Injectable()
export class ApiService {
  private serverHost = 'http://localhost:3000';

  constructor(private http: Http) { }

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

  getMapLocations(mapId): Observable<any> {
    return this.http.get(this.serverHost + '/map/locations')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  addNewMap(map: Map): Observable<any> {
    return this.http.post(this.serverHost + '/map', map)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  addNewLocation(location: Location): Observable<any> {
    return this.http.post(this.serverHost + '/map/location', location)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  signup(userInfo: any): Observable<any> {
    return this.http.post(this.serverHost + '/user/signup', userInfo)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
}
