import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the IconListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-icon-list',
  templateUrl: 'icon-list.html',
})
export class IconListPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  public iconList = [
    "far fa-circle",
    "far fa-child",
    "fas fa-map-pin",
    "fas fa-address-book",
    "fas fa-building",
    "fas fa-bus",
    "fas fa-car",
    "fas fa-cart-plus",
    "fas fa-dice",
    "fas fa-futbol",
    "fas fa-coffee",
    "fas fa-gem",
    "fas fa-ambulance",
    "fas fa-ambulance",
    "fas fa-ambulance",
    "fas fa-beer",
    "fas fa-bed",
    "fas fa-birthday-cake",
    "fas fa-burn",
    "fas fa-church",
    "fas fa-couch",
    "fas fa-crow",
    "fas fa-diagnoses",
    "fas fa-baseball-ball",
    "fas fa-gas-pump",
    "fas fa-glass-martini",
    "fas fa-hand-holding-heart",
    "fas fa-grimace",
    "fas fa-grin-alt",
    "fas fa-grin-beam-sweat",
    "fas fa-grin-hearts",
    "fas fa-grin-squint",
    "fas fa-grin-stars",
    "fas fa-grin-tears",
    "fas fa-grin-tongue-wink",
    "fas fa-grin-tongue-squint",
    "fas fa-grin-wink",
  ]

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconListPage');
  }
  selectIcon(iconStr) {
    this.viewCtrl.dismiss({
      curIconStyle: iconStr
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
