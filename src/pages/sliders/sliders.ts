import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the SlidersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sliders',
  templateUrl: 'sliders.html',
})
export class SlidersPage {

  @ViewChild(Slides) slides: Slides;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }
  imgList: string[] = this.navParams.get('imgList');
  index: number = this.navParams.get('index');

  goToSlide() {
    this.slides.slideTo(2, 500);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
