import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ModalController, NavController, FabContainer } from 'ionic-angular';
import { AddMapModal, AddLocModal } from '../modals/modals';
import { ContactPage } from '../contact/contact';

import { Map } from '../../common/models';
import { MapService } from '../../services/api';

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
  openAddModal(type, fab: FabContainer) {
    let curModal;
    fab.close();
    if (type == 'map') {
      curModal = this.modalCtrl.create(AddMapModal);
    } else {
      curModal = this.modalCtrl.create(AddLocModal);
    }
    curModal.present();
  }
}
