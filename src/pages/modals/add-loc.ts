import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  AlertController,
  ViewController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Storage } from "@ionic/storage";

import { ApiService } from "../../services/api";
import { QiniuService } from "../../services/qiniu";

import { Map } from "../../common/models";
import { ModalContent } from "./modal-content";

@IonicPage()
@Component({
  templateUrl: "add-loc.html",
  providers: [ApiService, QiniuService]
})
export class AddLocModal extends ModalContent {
  constructor(
    private storage: Storage,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public qiniuService: QiniuService,
    private apiService: ApiService
  ) {
    super(viewCtrl);
  }
  curLocation: any = this.navParams.data
    ? this.navParams.data.curSelectPlace
    : {};
  pageType = "status";
  maps: Map[] = [];
  curSelectedMapId: string;
  locationImgs: string[] = [];
  description: string;
  isShowImgUploader = true;
  showHeader = true;
  private mapInfo: any = this.navParams.get("mapInfo");
  private locationInfo: any = this.navParams.get("locationInfo");

  ngOnInit(): void {
    this.getMaps();
    if (this.locationInfo) {
      //编辑地点
      this.locationImgs = this.locationInfo.imgs;
      this.description = this.locationInfo.description;
      this.curLocation = this.locationInfo.locationInfo;
    }
  }
  getMaps(): void {
    this.storage.get("userId").then(userID => {
      this.apiService.getUserMaps(userID).subscribe(res => {
        if (res.status == 0) {
          this.maps = res.result;
          if (this.mapInfo) {
            //在地图集中添加地点
            this.curSelectedMapId = this.mapInfo._id;
          }
        }
      });
    });
  }
  imgChange(event) {
    let target = event.target || event.srcElement;
    if (
      event.srcElement.files.length <= 9 &&
      this.locationImgs.length + event.srcElement.files.length <= 9
    ) {
      this.imgLoading = true;
      for (let i = 0; i < event.srcElement.files.length; i++) {
        let file = event.srcElement.files[i];
        this.addImage(file, imgUrl => {
          this.locationImgs.push(imgUrl);
          if (this.locationImgs.length >= 9) {
            this.isShowImgUploader = false;
          }
        });
      }
    } else {
      let toast = this.toastCtrl.create({
        message: "最多上传9张图片",
        duration: 1000,
        position: "bottom"
      });
      toast.present();
    }
    target.value = '';
  }
  // showMapModal() {
  //   let curModal;
  //   curModal = this.modalCtrl.create('SearchLocModal');
  //   curModal.onDidDismiss(data => {
  //     // console.log(data);
  //     if (data) {
  //       this.curLocation = data;
  //     }
  //   });
  //   curModal.present();
  // }
  submit() {
    let requireField = [
      {
        key: this.curLocation.name,
        errorMsg: "缺少地理位置信息，请返回重新添加"
      },
      {
        key: this.curSelectedMapId,
        errorMsg: "请选择要添加的地图集"
      },
      {
        key: this.description,
        errorMsg: "请填写位置描述"
      }
    ];
    let errorMsg = "";
    requireField.forEach((item, index) => {
      if (!item.key) {
        errorMsg = item.errorMsg;
        return false;
      }
    });
    if (errorMsg) {
      let alert = this.alertCtrl.create({
        title: errorMsg,
        buttons: ["关闭"]
      });
      alert.present();
    } else {
      this.storage.get("userId").then(userID => {
        if (this.locationInfo) {
          //编辑地点
          this.apiService
            .updateLocation({
              userId: userID,
              id: this.locationInfo._id,
              imgs: this.locationImgs,
              description: this.description
            })
            .subscribe(res => {
              console.log(res);
              if (res.status == 0) {
                let toast = this.toastCtrl.create({
                  message: "更新成功",
                  duration: 1500,
                  position: "bottom"
                });
                toast.onDidDismiss(() => {
                  this.navCtrl.pop();
                });
                toast.present();
              } else {
                let toast = this.toastCtrl.create({
                  message: "更新失败",
                  duration: 1500,
                  position: "bottom"
                });
                toast.present();
              }
            });
          return;
        }
        let lnglat = this.curLocation.location
          ? [this.curLocation.location.lng, this.curLocation.location.lat]
          : null;
        // delete this.curLocation.location;
        this.apiService
          .addNewLocation({
            userId: userID,
            locationInfo: this.curLocation,
            lnglat: lnglat,
            mapId: this.curSelectedMapId,
            imgs: this.locationImgs,
            description: this.description
          })
          .subscribe(res => {
            console.log(res);
            if (res.status == 0) {
              let toast = this.toastCtrl.create({
                message: "添加成功",
                duration: 2000,
                position: "bottom"
              });
              toast.onDidDismiss(() => {
                this.navCtrl.push("LocationDetailPage", {
                  id: res.result._id
                });
                this.viewCtrl.dismiss({
                  status: "add-location-done",
                  data: res.result
                });
              });
              toast.present();
            } else {
              let toast = this.toastCtrl.create({
                message: "添加失败",
                duration: 2000,
                position: "bottom"
              });
              toast.present();
            }
          });
      });
    }
  }
}
