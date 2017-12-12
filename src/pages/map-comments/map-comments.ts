import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the MapCommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: '/map-comments/:mapId'
})
@Component({
  selector: 'page-map-comments',
  templateUrl: 'map-comments.html',
  providers: [],
})
export class MapCommentsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }
  private mapId:string = this.navParams.get('mapId');
  private creater: any = this.navParams.get('creater');

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapCommentsPage');
  }
}
