import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Slides, AlertController, ToastController } from 'ionic-angular';
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
    public modalCtrl: ModalController,
    private storage: Storage,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
  private isOwner = false;

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
        this.storage.get('userId').then(userID => {
          this.isOwner = userID == res.result.map.creater._id;
        })
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
    this.storage.get('userId').then(userID => {
      this.apiService.getLikeInfo(this.mapParams.id, userID).subscribe(res => {
        if (res.status == 0) {
          console.log(res);
          this.likeCount = res.result.count;
          this.hasLiked = res.result.hasLiked;
        }
      })
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
  editMap(): void {
    let addMapModal = this.modalCtrl.create('AddMapModal', {
      mapInfo: this.mapInfo
    });
    addMapModal.present();
  }

  delMap(): void {
    let confirm = this.alertCtrl.create({
      title: '确定要删除此地图集吗?',
      message: '删除后不可恢复',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.apiService.delMap(this.mapParams.id).subscribe(res => {
              if (res.status == 0) {
                let toast = this.toastCtrl.create({
                  message: '删除成功',
                  duration: 1500,
                  position: 'bottom'
                })
                toast.onDidDismiss(() => {
                  this.navCtrl.pop();
                });
                toast.present();
              }
            })
          }
        }
      ]
    });
    confirm.present();
  }

  addLocation():void {
    let addLocationModal = this.modalCtrl.create('SearchLocModal', {
      mapInfo: this.mapInfo
    });
    addLocationModal.present();
  }

  sendLike(): void {
    this.storage.get('userId').then(userID => {
      if (userID) {
        this.apiService.sendLike({
          targetId: this.mapParams.id,
          targetType: 'map',
          creater: userID,
          hasLiked: this.hasLiked
        }).subscribe(res => {
          if (res.status == 0) {
            this.hasLiked = res.result.hasLiked;
            if (res.result.hasLiked) {
              this.likeCount++;
            } else {
              this.likeCount--;
            }
          }
        })
      } else {
        this.navCtrl.push('LoginPage', {
          callback: () => {
            this.navCtrl.push('ProfilePage')
          }
        });
      }

    })
  }
}
