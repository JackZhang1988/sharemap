import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { LocationCategory } from '../../common/models';

@IonicPage()
@Component({
  selector: 'page-location-category',
  templateUrl: 'location-category.html',
  providers: [ApiService]
})
export class LocationCategoryPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private apiService: ApiService,
    public modalCtrl: ModalController, ) {
  }

  public categoryList: LocationCategory[]

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    this.getMapCategory();
  }

  getMapCategory() {
    this.storage.get("userId").then(userId => {
      this.apiService.getLocaionCategory(userId).subscribe(res => {
        if (res.status == 0) {
          this.categoryList = res.result;
        }
      })
    })
  }

  addNewCategroy() {
    let curModal = this.modalCtrl.create('AddLocationCategoryPage');
    curModal.onDidDismiss(data => {
      if (data && data.type == 'save-success') {
        this.getMapCategory();
      }
    });
    curModal.present();
  }

  selectCategory(category: LocationCategory) {
    // console.log(category);
    this.viewCtrl.dismiss({
      type: 'category-select',
      data: category
    })
  }
} 
