import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  segment: 'map-detail/:id'
})
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
})
export class MapDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.map = this.navParams.get("map");
  }
  public map: any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapDetail');
    this.getMapData()
  }

  getMapData():void{
    console.log(this.map)
  }

}
