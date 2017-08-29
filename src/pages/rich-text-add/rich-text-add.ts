import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the RichTextAddPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rich-text-add',
  templateUrl: 'rich-text-add.html',
})
export class RichTextAddPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
  }
  public title: string = this.navParams.get('title') || '';
  public showHeader: any = this.navParams.get('showHeader');

  ionViewDidLoad() {

  }

  addContent() {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'rich-bottom-sheet',
      buttons: [
        {
          text: '文字',
          icon: 'ios-create',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('文字 clicked');
          }
        }, {
          text: '图片',
          icon: 'ios-images',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('图片 clicked');
          }
        }, {
          text: '相机',
          icon: 'ios-camera',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('相机 clicked');
          }
        }, {
          text: '取消',
          role: 'cancel',
          cssClass:'cancel-btn',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
