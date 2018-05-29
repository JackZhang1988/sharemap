import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-city-list',
    templateUrl: 'city-list.html'
})
export class CityListPage {
    constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad CityListPage');
    }

    dismiss() {
      this.viewCtrl.dismiss();
  }
}
