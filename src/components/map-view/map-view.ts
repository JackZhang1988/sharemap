import { Component, Input, SimpleChanges } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';
/**
 * Generated class for the MapViewComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'map-view',
  templateUrl: 'map-view.html',
  providers: [GDMap]
})
export class MapViewComponent {
  @Input() mapStaticImg: string;
  @Input() viewTitle: string;
  @Input() location?: any;
  @Input() viewType: string; //表示map-view展示类型

  private STATIC_MAP_KEY: string;

  constructor(public modalCtrl: ModalController, private gdService: GDMap) {
    this.STATIC_MAP_KEY = this.gdService.getStaticMapKey();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }
  init() {
    if (this.location) {
      let size = '400*200';
      let color = '0x387ef5';
      let markerGpsStr = '';
      if (this.viewType == 'location-view') {
        //地点位置视图下 this.location 为单个lnglat 数组
        this.viewTitle = this.viewTitle || '地图视图';
        markerGpsStr = `-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:${this.location[0]},${
          this.location[1]
        }`;
        // http://restapi.amap.com/v3/staticmap?size=400*200&markers=-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:116.326778,40.0033&key=c3b4477c4c2ad477141ee0358e4d1c82
        this.mapStaticImg =
          'http://restapi.amap.com/v3/staticmap?size=' +
          size +
          '&markers=' +
          markerGpsStr +
          '&key=' +
          this.STATIC_MAP_KEY;
      } else if (this.viewType == 'map-locations') {
        //地图坐标下，this.location 为多个lnglat数组
        if (this.location && this.location.length) {
          let markerList = [];
          let lLength = this.location.length > 10 ? 10 : this.location.length;
          for (let i = 0; i < lLength && i < 50; i++) {
            markerList.push(
              'mid,' + color + ',' + i + ':' + this.location[i].lnglat[0] + ',' + this.location[i].lnglat[1]
            );
          }
          markerGpsStr = markerList.join('|');
        } else {
          markerGpsStr = '';
        }
        this.mapStaticImg =
          'http://restapi.amap.com/v3/staticmap?size=' +
          size +
          '&markers=' +
          markerGpsStr +
          '&key=' +
          this.STATIC_MAP_KEY;
      }
    }
  }
  changeView() {
    let mapModalData;
    if (this.viewType == 'location-view') {
      mapModalData = [
        {
          lnglat: this.location
        }
      ];
    } else {
      mapModalData = this.location;
    }
    let mapViewModal = this.modalCtrl.create('MapViewModal', {
      type: this.viewType,
      title: this.viewTitle,
      mapLocations: mapModalData
    });
    mapViewModal.present();
  }
}
