import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { MapService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';

class ModalContent {
  constructor(public viewCtrl: ViewController) { }
  dismiss() {
    this.viewCtrl.dismiss();
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
    private qiniuService: QiniuService,
    private mapService: MapService
  ) {
    super(viewCtrl);
  }
  private imgLoading = false;
  public coverImg: string;
  public title: string;
  public description: string;

  public imgChange(event) {
    console.log(event);
    var self = this;
    self.imgLoading = true;
    this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl => {
      if (imgUrl) {
        self.imgLoading = false;
        self.coverImg = imgUrl;
      }
    })
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
  templateUrl: 'add-loc.html'
})
export class AddLocModal extends ModalContent {
  constructor(public viewCtrl: ViewController, private qiniuService: QiniuService) {
    super(viewCtrl);
  }
}
