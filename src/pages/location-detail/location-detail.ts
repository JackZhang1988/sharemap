import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('commentInput') commentInput: ElementRef;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private apiService: ApiService
  ) {
  }

  public locationInfo?: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];
  commentInputValue:string;

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

  resize() {
    var element = this.commentInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.commentInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }
}
