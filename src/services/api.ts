import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Map } from '../modules/map';

const MAPS: Map[] = [
  {
    coverImg: 'http://ionicframework.com/dist/preview-app/www/assets/img/card-sf.png',
    title: '地图集1',
    description: '41 Listings',
  }, {
    coverImg: 'http://ionicframework.com/dist/preview-app/www/assets/img/card-amsterdam.png',
    title: '地图集2',
    description: '64 Listings',
  }, {
    coverImg: 'http://ionicframework.com/dist/preview-app/www/assets/img/card-sf.png',
    title: '地图集3',
    description: '6 Listings',
  }
]

@Injectable()
export class MapService {
  private mapListUrl = 'http://localhost:3000/map/list';

  constructor(private http: Http) { }

  getMaps(): Observable<any> {
    return this.http.get('http://localhost:3000/map/list')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  addNewMap(map: Map): Observable<any> {
    return this.http.post('http://localhost:3000/map', map)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
}
