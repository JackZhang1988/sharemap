import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';

/**
 * Generated class for the LocationCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location-category',
  templateUrl: 'location-category.html',
})
export class LocationCategoryPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController, ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getMapCategory() {

  }

  addNewCategroy() {
    let curModal = this.modalCtrl.create('AddLocationCategoryPage');
    curModal.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    });
    curModal.present();
  }
} 
