import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { BottomSheetProvider } from '../../providers/bottom-sheet/bottom-sheet';

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
  providers: [BottomSheetProvider]
})
export class AddLocationCategoryPage {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public bottomSheet: BottomSheetProvider) {
  }

  public markerIcon: string;
  public iconListBottomSheet;
  public colorListBottomSheet;
  public curColor: string = '#ff5d00';
  public curIcon: string = 'far fa-circle';

  ngOnInit() {
    this.iconListBottomSheet = this.bottomSheet.initBottomSheet({
      modalPageName: 'IconListPage',
      params: {
        type: 'icon'
      },
      onDidDismiss: data => {
        console.log(data);
        this.curIcon = data.result;
      }
    })
    this.colorListBottomSheet = this.bottomSheet.initBottomSheet({
      modalPageName: 'IconListPage',
      params: {
        type: 'color'
      },
      onDidDismiss: data => {
        console.log(data);
        this.curColor = data.result;
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
}
