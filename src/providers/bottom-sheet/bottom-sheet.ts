import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

interface BottomSheetOpts {
  modalPageName: string,
  params?: any,
  modalOpts?: any,
  onDidDismiss?: (data: any, role: string) => void
}

@Injectable()
export class BottomSheetProvider {

  constructor(public modalCtrl: ModalController, ) {
    console.log('Hello BottomSheetProvider Provider');
  }

  initBottomSheet(opts: BottomSheetOpts) {
    opts.modalOpts = Object.assign({
      cssClass: 'bottom-sheet'
    }, opts.modalOpts);

    if (opts.modalPageName) {
      let curModal = this.modalCtrl.create(opts.modalPageName, opts.params, opts.modalOpts);
      if (opts.onDidDismiss) {
        curModal.onDidDismiss(opts.onDidDismiss);
      }
      return curModal;
    }
  }
}
