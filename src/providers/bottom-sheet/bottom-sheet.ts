import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

interface BottomSheetOpts {
  modalPageName: string,
  params?: any,
  modalOpts?: any,
  onDidDismiss?: Function
}

@Injectable()
export class BottomSheetProvider {

  constructor(public modalCtrl: ModalController, ) {
    console.log('Hello BottomSheetProvider Provider');
  }

  public curModal;

  initBottomSheet(opts: BottomSheetOpts) {
    opts.modalOpts = Object.assign({
      cssClass: 'bottom-sheet'
    }, opts.modalOpts)
    if (opts.modalPageName) {
      this.curModal = this.modalCtrl.create(opts.modalPageName, opts.params, opts.modalOpts);
    }
    opts.onDidDismiss && this.curModal.onDidDismiss(opts.onDidDismiss);
  }

  showBottomSheet() {
    this.curModal.present();
  }
}
