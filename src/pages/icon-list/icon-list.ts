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

  public type = this.navParams.get('type') || 'icon';

  public iconList = [
    "far fa-circle",
    "fas fa-child",
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

  public colorList = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#9e9e9e',
    '#607d8b',
  ]

  selectIcon(iconStr) {
    this.viewCtrl.dismiss({
      type: 'icon',
      result: iconStr
    })
  }

  selectColor(colorStr) {
    this.viewCtrl.dismiss({
      type: 'color',
      result: colorStr
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
