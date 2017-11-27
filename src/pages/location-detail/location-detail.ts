import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';
@IonicPage({
  segment: '/location-detail/:id',
})
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
  providers: [ApiService],
})
export class LocationDetailPage {

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiService
  ) {
  }

  public locationInfo: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];

  ionViewDidLoad() {
    console.log(this.navParams);
    this.getLocationData();
  }
  getLocationData() {
    this.apiService.getLocationById(this.locationParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.locationInfo = res.result;
        this.lnglat = res.result.lnglat;
      }
    })
  }

}
