import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { IonicPage, ModalController, NavController, FabContainer } from 'ionic-angular';
import { Map } from '../../common/models';
import { MapService } from '../../services/api';
import { ContactPage } from '../contact/contact';


@IonicPage({
  name:'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapService, FabContainer]
})
export class HomePage implements OnInit {

  maps: Map[];

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.mapService.getMaps().subscribe(res => {
      if (res.status == 0) {
        this.maps = res.result;
      }
    });
  }

  goContactPage() {
    this.navCtrl.push(ContactPage);
  }

  goMapDetail(mapData) {
    this.navCtrl.push('MapDetailPage', {
      id: mapData._id
    })
  }
  // saveMap(data) {
  //   //todo: save to db
  //   console.log(data)
  // }
  // saveLoc(data) {
  //   //todo: save to db
  //   console.log(data);
  // }
  openAddModal(type, fab: FabContainer) {
    let curModal;
    fab.close();
    if (type == 'map') {
      curModal = this.modalCtrl.create('AddMapModal');
    } else {
      curModal = this.modalCtrl.create('AddLocModal');
    }
    // curModal.onDidDismiss(data => {
    //   if (type == 'map') {
    //     this.saveMap(data);
    //   } else {
    //     this.saveLoc(data);
    //   }
    // })
    curModal.present();
  }
}
