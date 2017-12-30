import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ApiService } from '../../services/api';
import { Map, Location } from '../../common/models';
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiService,
    private storage: Storage
  ) {
  }

  maps: Map[];
  mapLocations: Location[];
  listType: string = this.navParams.get('listType') || 'map';
  title: string = this.navParams.get('title') || '我创建的地图集';
  navUserId: string = this.navParams.get('navUserId');

  ngOnInit(): void {
    this.storage.get('userId').then(userId => {
      let user = this.navUserId ? this.navUserId : userId;
      if (this.listType == 'map') {
        this.apiService.getUserMaps(user).subscribe(res => {
          if (res.status == 0) {
            this.maps = res.result;
          }
        })
      } else if (this.listType == 'location') {
        this.apiService.getUserLocations(user).subscribe(res => {
          if (res.status == 0) {
            this.mapLocations = res.result;
          }
        })
      }
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
  goLocationDetail(locationData) {
    this.navCtrl.push('LocationDetailPage', {
      id: locationData._id
    })
  }
}
