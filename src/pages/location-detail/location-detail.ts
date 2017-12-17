import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';
// import { Keyboard } from '@ionic-native/keyboard';

@IonicPage({
  segment: '/location-detail/:id',
})
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
  providers: [ApiService],
})
export class LocationDetailPage {
  @ViewChild('commentInput') commentInput: ElementRef;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private apiService: ApiService,
    // private keyboard: Keyboard
  ) {
  }

  public locationInfo?: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];
  private isOwner = false;

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
