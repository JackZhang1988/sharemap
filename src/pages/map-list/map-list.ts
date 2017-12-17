import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ApiService } from '../../services/api';
import { Map } from '../../common/models';
/**
 * Generated class for the MapListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map-list',
  templateUrl: 'map-list.html',
  providers: [ApiService]
})
export class MapListPage {
  maps: Map[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiService: ApiService,
    private storage: Storage
  ) {
  }

  ngOnInit(): void {
    this.storage.get('userId').then(userId => {
      this.apiService.getUserMaps(userId).subscribe(res => {
        if (res.status == 0) {
          this.maps = res.result;
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapListPage');
  }
  goMapDetail(mapData) {
    this.navCtrl.push('MapDetailPage', {
      id: mapData._id
    })
  }
}
