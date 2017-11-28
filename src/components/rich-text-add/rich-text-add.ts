import { Component, Input, Output } from '@angular/core';
import { IonicPage, ToastController, NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { QiniuService } from '../../services/qiniu';

/**
 * Generated class for the RichTextAddPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'rich-text-add',
  templateUrl: 'rich-text-add.html',
  providers: [QiniuService]
})
export class RichTextAdd {


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public imagePicker: ImagePicker,
    public qiniuService: QiniuService,
    public camera: Camera,
  ) {
  }
  public title: string = this.navParams.get('title') || '';
  // public showHeader: any = this.navParams.get('showHeader');
  public content = [];

  @Input() showHeader: Boolean;

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

  addContentObj(contentObj, index) {
    if (index) {
      this.content.splice(index + 1, 0, contentObj);
    } else {
      this.content.push(contentObj);
    }
  }

  addText(index) {
    this.addContentObj({
      type: 'text',
      value: ''
    }, index);
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

  addImages(index) {
    this.checkPermission(() => {
      this.imagePicker.getPictures({}).then((results) => {
        if (results.length > 5) {
          let toast = this.toastCtrl.create({
            message: '一次性上传图片不能超过5张',
            duration: 2000,
            position: 'bottom'
          })
          return;
        } else {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.qiniuService.nativeUpload(results[i]).subscribe(res => {
              this.addContentObj({
                type: 'img',
                value: res
              }, index);
            });
          }
        }
      }, (err) => { });
    })
  }
  openCamera(index) {
    //mock
    this.addContentObj({
      type: 'img',
      value: 'http://okyb0e40i.bkt.clouddn.com/FrJdSz1P_4kvFIYjvTc-VmgU1SPs'
    }, index);
    return;
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64:
    //   this.qiniuService.nativeUpload(imageData).subscribe(res => {
    //     this.addContentObj({
    //   type: 'img',
    //   value: res
    // },index);
    //   });
    // }, (err) => {
    //   // Handle error
    // });

  }

  deleteItem(index) {
    this.content.splice(index, 1);
  }

  moveupItem(i) {
    //this.splice(to, 0, this.splice(from, 1)[0]);
    this.arrayMove(this.content, i, i - 1);
  }

  arrayMove(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  }

  addContent(index) {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'rich-bottom-sheet',
      buttons: [
        {
          text: '文字',
          icon: 'create',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('文字 clicked');
            this.addText(index);
          }
        }, {
          text: '图片',
          icon: 'images',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('图片 clicked');
            this.addImages(index);
          }
        }, {
          text: '相机',
          icon: 'camera',
          cssClass: 'sheet-item',
          handler: () => {
            console.log('相机 clicked');
            this.openCamera(index);
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
