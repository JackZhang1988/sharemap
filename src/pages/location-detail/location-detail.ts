import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams,
  AlertController,
  ModalController
} from "ionic-angular";
import { ApiService } from "../../services/api";
import { Storage } from "@ionic/storage";
import { ShareProvider } from "../../providers/share";
// import { Keyboard } from '@ionic-native/keyboard';

@IonicPage({
  segment: "/location-detail/:id"
})
@Component({
  selector: "page-location-detail",
  templateUrl: "location-detail.html",
  providers: [ApiService, ShareProvider]
})
export class LocationDetailPage {
  @ViewChild("commentInput") commentInput: ElementRef;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private storage: Storage,
    public navParams: NavParams,
    private apiService: ApiService,
    private shareProvider: ShareProvider // private keyboard: Keyboard
  ) {}

  public locationInfo?: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];
  private isOwner = false;
  private showSlider = false;

  ionViewDidLoad() {
    console.log(this.navParams);
    this.getLocationData();
  }

  initShare() {
    this.shareProvider.showSharePanel();
  }

  getLocationData() {
    this.apiService.getLocationById(this.locationParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.locationInfo = res.result;
        this.lnglat = res.result.lnglat;
        this.storage.get("userId").then(userID => {
          this.isOwner = userID == res.result.creater._id;
        });
        this.shareProvider.initShareContent({
          title:
            "来看看我分享的地点" + this.locationInfo.locationInfo
              ? ("【" + this.locationInfo.locationInfo.name + "】")
              : "",
          shareDesc: this.locationInfo.description,
          shareImg:
            this.locationInfo.imgs[0] + "?imageView2/0/w/200/h/200/q/75",
          shareUrl: "location/" + this.locationInfo._id
        });
      }
    });
  }

  showSliders(index) {
    let curModal = this.modalCtrl.create("SlidersPage", {
      imgList: this.locationInfo.imgs,
      index: index
    });
    curModal.onDidDismiss(data => {
      console.log(data);
    });
    curModal.present();
  }

  editLocation() {
    let curModal = this.modalCtrl.create("AddLocModal", {
      locationInfo: this.locationInfo,
      mapInfo: {
        _id: this.locationInfo.mapId
      }
    });
    curModal.onDidDismiss(data => {
      console.log(data);
      this.getLocationData();
    });
    curModal.present();
  }
  delLocation() {
    let confirm = this.alertCtrl.create({
      title: "确定要删除此地点吗?",
      message: "删除后不可恢复",
      buttons: [
        {
          text: "取消",
          handler: () => {}
        },
        {
          text: "确定",
          handler: () => {
            this.storage.get("userId").then(userID => {
              this.apiService
                .delLocation({
                  userId: userID,
                  id: this.locationParams.id
                })
                .subscribe(res => {
                  if (res.status == 0) {
                    let toast = this.toastCtrl.create({
                      message: "删除成功",
                      duration: 1500,
                      position: "bottom"
                    });
                    toast.onDidDismiss(() => {
                      this.navCtrl.pop();
                    });
                    toast.present();
                  }
                });
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
