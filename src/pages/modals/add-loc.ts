import { Component } from '@angular/core';
import { IonicPage, AlertController, ViewController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ApiService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';

import { Map } from '../../common/models';
import { ModalContent } from './modal-content';


@IonicPage()
@Component({
  templateUrl: 'add-loc.html',
  providers: [ApiService, QiniuService]
})
export class AddLocModal extends ModalContent {
  constructor(
    private storage: Storage,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public qiniuService: QiniuService,
    private apiService: ApiService
  ) {
    super(viewCtrl);
  }
  curLocation: any = this.navParams.data ? this.navParams.data.curSelectPlace : {};
  pageType = 'status';
  maps: Map[] = [];
  curMap: string;
  locationImgs: string[] = [];
  description: string;
  isShowImgUploader = true;
  showHeader = true;

  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.apiService.getMaps().subscribe(res => {
      if (res.status == 0) {
        this.maps = res.result;
      }
    });
  }
  imgChange(event) {
    this.imgLoading = true;
    this.addImage(event.srcElement.files[0], (imgUrl) => {
      this.locationImgs.push(imgUrl);
      if (this.locationImgs.length >= 4) {
        this.isShowImgUploader = false;
      }
    });
  }
  showMapModal() {
    let curModal;
    curModal = this.modalCtrl.create('SearchLocModal');
    curModal.onDidDismiss(data => {
      // console.log(data);
      if (data) {
        this.curLocation = data;
      }
    });
    curModal.present();
  }
  submit() {
    if (!this.curLocation.name) {
      let alert = this.alertCtrl.create({
        title: '您还没添加地理位置',
        buttons: ['关闭']
      });
      alert.present();
    } else {
      this.storage.get('user').then(userID => {
        let lnglat = this.curLocation.location ? [this.curLocation.location.lng, this.curLocation.location.lat] : null;
        // delete this.curLocation.location;
        this.apiService.addNewLocation({
          creater: userID,
          locationInfo: this.curLocation,
          lnglat: lnglat,
          mapId: this.curMap,
          imgs: this.locationImgs,
          description: this.description
        }).subscribe((res) => {
          console.log(res);
          if (res.status == 0) {
            let toast = this.toastCtrl.create({
              message: '添加成功',
              duration: 2000,
              position: 'middle'
            })
            toast.onDidDismiss(() => this.viewCtrl.dismiss());
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: '添加失败',
              duration: 2000,
              position: 'middle'
            })
            toast.present();
          }
        })
      })
    }
  }
}