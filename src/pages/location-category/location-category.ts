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
    public alertCtrl: AlertController,
    public modalCtrl: ModalController, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationCategoryPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  // showCategoryNotice(): void {
  //   let alert = this.alertCtrl.create({
  //     title: '你可以为一组坐标设置一个分类，这样在查看地图详情时，可以快速找到该分类下的地点信息',
  //     cssClass: 'notice-alert',
  //     buttons: ['知道了']
  //   });
  //   alert.present();
  // }

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
