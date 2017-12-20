import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from "@ionic/storage";
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
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private storage: Storage,
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
        this.storage.get('userId').then(userID => {
          this.isOwner = userID == res.result.creater._id;
        })
      }
    })
  }

  editLocation() {
    let curModal = this.modalCtrl.create('AddLocModal', {
      locationInfo: this.locationInfo,
      mapInfo: {
        _id: this.locationInfo.mapId
      }
    })
    curModal.onDidDismiss(data => {
      console.log(data);
      this.getLocationData();
    });
    curModal.present();
  }
  delLocation() {
    let confirm = this.alertCtrl.create({
      title: '确定要删除此地点吗?',
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
            this.apiService.delLocation(this.locationParams.id).subscribe(res => {
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
}
