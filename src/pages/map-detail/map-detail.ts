import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Slides } from 'ionic-angular';
import { ApiService } from '../../services/api';

const STATIC_MAP_KEY = 'c3b4477c4c2ad477141ee0358e4d1c82';

@IonicPage({
  segment: '/map-detail/:id',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
  providers: [ApiService]
})
export class MapDetailPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private apiService: ApiService,
  ) {
  }
  @ViewChild(Slides) slides: Slides;

  public mapInfo: any = {};
  public mapData: any = this.navParams.data;
  public mapLocations: any[] = [];
  public curView: string = 'list';
  public mapStaticImg: string;

  ionViewDidLoad() {
    this.getMapData()
  }

  getMapData(): void {
    console.log(this.mapData)
    this.apiService.getMapById(this.mapData.id).subscribe(res => {
      console.log(res.result);
      if (res.status == 0) {
        this.mapInfo = res.result.map;
        this.mapLocations = res.result.locations;
        let markerGpsStr = '';
        let size = '400*200';
        let color = '0x387ef5';
        if (this.mapLocations && this.mapLocations.length) {
          let markerList = [];
          for (let i = 0; i < this.mapLocations.length && i < 50; i++) {
            markerList.push('mid,' + color + ',' + i + ':' + this.mapLocations[i].lnglat[0] + ',' + this.mapLocations[i].lnglat[1]);
          }
          markerGpsStr = markerList.join('|');
        } else {
          markerGpsStr = '';
        }
        this.mapStaticImg = 'http://restapi.amap.com/v3/staticmap?size=' + size + '&markers=' + markerGpsStr + '&key=' + STATIC_MAP_KEY;
      }
    })
  }
  changeView(): void {
    // if(this.curView == 'list'){
    //   this.curView = 'map';
    // }else{
    //   this.curView = 'list';
    // }
    let mapViewModal = this.modalCtrl.create('MapViewModal', {
      mapData: this.mapData,
      mapInfo: this.mapInfo,
      mapLocations: this.mapLocations
    });
    mapViewModal.present();
  }

  goLocationDetail(locationData) {
    this.navCtrl.push('LocationDetailPage', {
      id: locationData._id
    })
  }
}
