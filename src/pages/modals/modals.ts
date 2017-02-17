import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { MapService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';

import { Map } from '../../modules/map';

class ModalContent {
  constructor(public viewCtrl: ViewController, public qiniuService?: QiniuService) { }
  imgLoading = false;

  dismiss() {
    this.viewCtrl.dismiss();
  }
  public addImage(file, callback) {
    this.qiniuService.addImage(file).subscribe(imgUrl => {
      if (imgUrl) {
        this.imgLoading = false;
        callback(imgUrl);
      }
    })
  }
}


@Component({
  templateUrl: 'add-map.html',
  providers: [MapService, QiniuService]
})
export class AddMapModal extends ModalContent {
  constructor(
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public qiniuService: QiniuService,
    private mapService: MapService
  ) {
    super(viewCtrl);
  }
  // private imgLoading = false;
  public coverImg: string;
  public title: string;
  public description: string;

  public imgChange(event) {
    this.imgLoading = true;
    this.addImage(event.srcElement.files[0], (imgUrl) => this.coverImg = imgUrl);
    // this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl => {
    //   if (imgUrl) {
    //     this.imgLoading = false;
    //     this.coverImg = imgUrl;
    //   }
    // })
  }
  public submit() {
    console.log(this.coverImg, this.title, this.description);
    this.mapService.addNewMap({
      coverImg: this.coverImg,
      title: this.title,
      description: this.description
    }).subscribe(res => {
      console.log(res);
      let toast = this.toastCtrl.create({
        message: '添加成功',
        duration: 2000,
        position: 'middle'
      })
      toast.onDidDismiss(() => this.viewCtrl.dismiss());
      toast.present();
      //   this.viewCtrl.dismiss();
    })

  }
}


@Component({
  templateUrl: 'add-loc.html',
  providers: [MapService, QiniuService]
})
export class AddLocModal extends ModalContent {
  constructor(
    public viewCtrl: ViewController,
    public qiniuService: QiniuService,
    private mapService: MapService
  ) {
    super(viewCtrl);
  }
  maps: Map[] = [];
  locationImgs: string[] = [];
  isShowImgUploader = true;
  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.mapService.getMaps().subscribe(res => {
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
}
