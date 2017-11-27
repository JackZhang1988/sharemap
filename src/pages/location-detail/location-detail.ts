import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { GDMap } from '../../services/gdmap';

const STATIC_MAP_KEY = 'c3b4477c4c2ad477141ee0358e4d1c82';

@IonicPage({
  segment: '/location-detail/:id',
})
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
  providers: [ApiService, GDMap],
})
export class LocationDetailPage {

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiService,
    public modalCtrl: ModalController,
    private gdService: GDMap
  ) {
  }

  public locationInfo: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;

  ngOnInit(): void {
    this.gdService.initMap();
  }
  ionViewDidLoad() {
    console.log(this.navParams);
    this.getLocationData();
  }
  getLocationData() {
    this.apiService.getLocationById(this.locationParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.locationInfo = res.result;
        let size = '400*200';
        let lnglat = res.result.lnglat;
        // http://restapi.amap.com/v3/staticmap?size=400*200&markers=-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:116.326778,40.0033&key=c3b4477c4c2ad477141ee0358e4d1c82
        let markerGpsStr = `-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:${lnglat[0]},${lnglat[1]}`
        this.mapStaticImg = 'http://restapi.amap.com/v3/staticmap?size=' + size + '&markers=' + markerGpsStr + '&key=' + STATIC_MAP_KEY;
        
        // this.gdService.addMarker(res.result.lnglat);
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
      mapLocations: this.locationInfo.lnglat
    });
    mapViewModal.present();
  }
}
