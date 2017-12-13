import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from "@ionic/storage";

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
    private storage: Storage,
    private apiService: ApiService,
  ) {
  }
  @ViewChild(Slides) slides: Slides;

  public mapInfo: any = {};
  public mapParams: any = this.navParams.data;
  public mapLocations: any[] = [];
  public viewTitle: string;
  private mapCommentCount: Number;
  private likeCount = 0;
  public hasLiked = false;

  ionViewDidLoad() {
    this.getMapData();
    this.getMapCommentCount();
    this.getMapLikeInfo();
  }

  getMapData(): void {
    console.log(this.mapParams)
    this.apiService.getMapById(this.mapParams.id).subscribe(res => {
      console.log(res.result);
      if (res.status == 0) {
        this.mapInfo = res.result.map;
        this.mapLocations = res.result.locations;
        this.viewTitle = this.mapInfo.title;
      }
    })
  }

  getMapCommentCount() {
    this.apiService.getMapCommentCount(this.mapParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.mapCommentCount = res.result;
      }
    })
  }

  getMapLikeInfo() {
    this.apiService.getMapLikeInfo(this.mapParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.likeCount = res.result.count;
        this.hasLiked = res.result.hasLiked;
      }
    })
  }

  goLocationDetail(locationData) {
    this.navCtrl.push('LocationDetailPage', {
      id: locationData._id
    })
  }

  goMapComments(): void {
    this.navCtrl.push('MapCommentsPage', {
      mapId: this.mapParams.id,
      creater: this.mapInfo.creater,
    })
  }

  sendLike(): void {
    this.storage.get('userId').then(userID => {
      this.apiService.sendLike({
        targetId: this.mapParams.id,
        targetType: 'map',
        creater: userID,
        hasLiked: this.hasLiked
      }).subscribe(res => {
        if (res.status == 0) {
          this.hasLiked = res.result.hasLiked;
          if(res.result.hasLiked){
            this.likeCount++;
          }else{
            this.likeCount--;
          }
        }
      })

    })
  }
}
