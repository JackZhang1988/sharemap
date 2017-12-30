import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { IonicPage, ModalController, NavController, FabContainer } from 'ionic-angular';
import { Map } from '../../common/models';
import { ApiService } from '../../services/api';
import { AuthServiceProvider } from '../../providers/auth';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService, AuthServiceProvider, FabContainer]
})
export class HomePage implements OnInit {

  maps: Map[];

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private authService: AuthServiceProvider,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.apiService.getMaps().subscribe(res => {
      if (res.status == 0) {
        this.maps = res.result;
      }
    });
  }

  goContactPage() {
    this.authService.checkLogin().then(token => {
      this.navCtrl.push('ProfilePage');
    }, () => {
      this.navCtrl.push('LoginPage', {
        callback: () => {
          this.navCtrl.push('ProfilePage')
        }
      });
    })
  }

  goMapDetail(mapData) {
    this.navCtrl.push('MapDetailPage', {
      id: mapData._id
    })
  }

  openAddModal(type, fab: FabContainer) {
    fab.close();
    this.authService.checkLogin().then(token => {
      let curModal;
      if (type == 'map') {
        curModal = this.modalCtrl.create('AddMapModal');
      } else {
        curModal = this.modalCtrl.create('SearchLocModal');
      }
      curModal.present();

    }, () => {
      this.navCtrl.push('LoginPage');
    })
  }

  goSearchPage(e) {
    e.stopPropagation();
    this.navCtrl.push('SearchPage');
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
