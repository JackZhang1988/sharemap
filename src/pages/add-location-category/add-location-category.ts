import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

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
})
export class AddLocationCategoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, ) {
  }

  public markerIcon: string;

  selectIcon() {
    let curModal = this.modalCtrl.create('IconListPage');
    curModal.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    });
    curModal.present();
  }
}
