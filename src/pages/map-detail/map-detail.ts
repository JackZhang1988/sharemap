import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
})
export class MapDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  public title:string = this.navParams.get("title");
  public map: any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapDetail');
    this.getMapData()
  }

  getMapData():void{
    console.log(this.map)
  }

}
