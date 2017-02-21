import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { LngLat } from '../common/models';

@Injectable()
export class GDMap {

  constructor(private http: Http) { }

  gdMap = {};

  initMap(pos?:LngLat,container:string = 'mapContainer'): any {
    this.gdMap = new AMap.Map(container, {
      rotateEnable: true,
      dragEnable: true,
      zoomEnable: true,
      zooms: [3, 18],
      zoom: 15,
      //二维地图显示视口
      view: new AMap.View2D({
        zoom: 13, //地图显示的缩放级别,
        center: pos ? new AMap.LngLat(pos.lng, pos.lat) : null
      })
    });
  }
}
