import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { BottomSheetProvider } from '../../providers/bottom-sheet/bottom-sheet';

/**
 * Generated class for the AddLocationCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-location-category',
  templateUrl: 'add-location-category.html',
  providers: [BottomSheetProvider]
})
export class AddLocationCategoryPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public bottomSheet: BottomSheetProvider) {
  }

  public markerIcon: string;
  public addBottomSheet;

  ngOnInit() {
    this.bottomSheet.initBottomSheet({
      modalPageName: 'IconListPage',
      onDidDismiss: data => {
        console.log(data);
      }
    })
  }

  selectIcon() {
    // let curModal = this.modalCtrl.create('IconListPage');
    // curModal.onDidDismiss(data => {
    //   if (data) {
    //     console.log(data);
    //   }
    // });
    // curModal.present();
    this.bottomSheet.showBottomSheet();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
