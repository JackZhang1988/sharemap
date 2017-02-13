import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

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
  constructor(public viewCtrl: ViewController, private qiniuService: QiniuService) {
    super(viewCtrl);
  }
  private imgLoading = false;
  public coverImg = null;
  public imgChange(event){
      console.log(event);
      var self = this;
      self.imgLoading = true;
      this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl =>{
          if (imgUrl) {
              self.imgLoading = false;
              self.coverImg = imgUrl;
          }
      })
  }
  public submit(){
      this.qiniuService.getToken().subscribe(token => console.log(token));
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
