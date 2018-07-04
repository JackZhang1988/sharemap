import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController } from 'ionic-angular';
import { BottomSheetProvider } from '../../providers/bottom-sheet/bottom-sheet';
import { ApiService } from '../../services/api';
/**
 * Generated class for the AddLocationCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-location-category',
  templateUrl: 'add-location-category.html',
  providers: [ApiService, BottomSheetProvider]
})
export class AddLocationCategoryPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private apiService: ApiService,
    public bottomSheet: BottomSheetProvider) {
  }

  public markerIcon: string;
  public iconListBottomSheet;
  public colorListBottomSheet;
  public title: string;
  public curColor: string = '#ff5d00';
  public curIcon: string = 'far fa-circle';

  ngOnInit() {
    this.iconListBottomSheet = this.bottomSheet.initBottomSheet({
      modalPageName: 'IconListPage',
      params: {
        type: 'icon'
      },
      onDidDismiss: data => {
        if (data) {
          this.curIcon = data.result;
        }
      }
    })
    this.colorListBottomSheet = this.bottomSheet.initBottomSheet({
      modalPageName: 'IconListPage',
      params: {
        type: 'color'
      },
      onDidDismiss: data => {
        if (data) {
          this.curColor = data.result;
        }
      }
    })

  }

  selectIcon() {
    this.iconListBottomSheet.present();
  }

  selectColor() {
    this.colorListBottomSheet.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveCategory() {
    if (!this.title) {
      let toast = this.toastCtrl.create({
        message: '请填写分类名称',
        duration: 1000,
        position: 'bottom'
      });
      toast.present();
      return;
    }
    this.storage.get("userId").then(userId => {
      this.apiService.saveLocationCategory({
        userId,
        title: this.title,
        iconClass: this.curIcon,
        iconColor: this.curColor
      }).subscribe(res => {
        if (res.status == 0) {
          this.viewCtrl.dismiss({
            status: 'save-success',
            data: res.result
          });
        }
      });
    })
  }
}
