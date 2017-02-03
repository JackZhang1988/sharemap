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
  constructor(private http: Http) { }

  getMaps(): Promise<Map[]> {
    return Promise.resolve(MAPS);
  }

  addNewMap(): Promise<any> {
    return null;
  }
}
