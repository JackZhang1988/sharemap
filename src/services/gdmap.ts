import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { LngLat } from '../modules/location';

@Injectable()
export class GDMap {

  constructor(private http: Http) { }

  gdMap = {};

  initMap(pos:LngLat): any {
    // this.gdMap = new AMap.Map('mapContainer', {
    //   rotateEnable: true,
    //   dragEnable: true,
    //   zoomEnable: true,
    //   zooms: [3, 18],
    //   zoom: 15,
    //   //二维地图显示视口
    //   view: new AMap.View2D({
    //     zoom: 13, //地图显示的缩放级别,
    //     center: pos ? new AMap.LngLat(pos.lng, pos.lat) : null
    //   })
    // });
    // var marker = new AMap.Marker({ //创建自定义点标注
    //   map: mapObj,
    //   position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
    //   offset: new AMap.Pixel(-10, -34),
    //   icon: "http://webapi.amap.com/images/0.png"
    // });
  }
}
