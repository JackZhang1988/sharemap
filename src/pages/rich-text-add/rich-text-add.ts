import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { QiniuService } from '../../services/qiniu';

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
  providers: [QiniuService]
})
export class RichTextAddPage {


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
    public qiniuService: QiniuService,
  ) {
  }
  public title: string = this.navParams.get('title') || '';
  public showHeader: any = this.navParams.get('showHeader');
  public content = [];

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    if (this.showHeader) {
      this.content.push({
        type: 'header',
        value: ''
      })
    }
  }
  addText() {
    this.content.push({
      type: 'text',
      value: ''
    })
  }

  checkPermission(job) {
    if (this.imagePicker.hasReadPermission()) {
      job && job();
    } else {
      this.imagePicker.requestReadPermission().then(() => {
        job && job();
      })
    }
  }

  addImages() {
    this.checkPermission(() => {
      this.imagePicker.getPictures({}).then((results) => {
        if (results.length >= 10) {
          let toast = this.toastCtrl.create({
            message: '一次性上传图片不能超过10张',
            duration: 2000,
            position: 'bottom'
          })
          return;
        }else{
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.qiniuService.nativeUpload(results[i]).subscribe(res => {
              this.content.push({
                type: 'img',
                value: res
              })
            });
          }
        }
      }, (err) => { });
    })
  }
  openCamera() {
    // this.checkPermission(() => {
    //   this.imagePicker.getPictures({}).then((results) => {
    //     for (var i = 0; i < results.length; i++) {
    //       console.log('Image URI: ' + results[i]);
    //     }
    //   }, (err) => { });
    // })
  }
  addContent() {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'rich-bottom-sheet',
      buttons: [
        {
          text: '文字',
          icon: 'create',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('文字 clicked');
            this.addText();
          }
        }, {
          text: '图片',
          icon: 'images',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('图片 clicked');
            this.addImages();
          }
        }, {
          text: '相机',
          icon: 'camera',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('相机 clicked');
            this.openCamera();
          }
        }, {
          text: '取消',
          role: 'cancel',
          icon: 'close',
          cssClass: 'cancel-btn',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
