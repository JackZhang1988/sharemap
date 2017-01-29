import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

class ModalContent {
  constructor(public viewCtrl: ViewController) { }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  templateUrl: 'add-map.html'
})
export class AddMapModal extends ModalContent {
  constructor(public viewCtrl: ViewController) {
    super(viewCtrl);
  }
}


@Component({
  templateUrl: 'add-loc.html'
})
export class AddLocModal extends ModalContent {
  constructor(public viewCtrl: ViewController) {
    super(viewCtrl);
  }
}
