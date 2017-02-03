import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AddMapModal, AddLocModal } from '../modals/modals';
import { ContactPage } from '../contact/contact';

import { Map } from '../../modules/map';
import { MapService } from '../../services/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapService]
})
export class HomePage implements OnInit {

  maps: Map[];

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, private mapService: MapService) { }

  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.mapService.getMaps().then(maps => this.maps = maps);
  }
  goContactPage() {
    this.navCtrl.push(ContactPage);
  }
  openAddModal(type) {
    let curModal;
    if (type == 'map') {
      curModal = this.modalCtrl.create(AddMapModal);
    } else {
      curModal = this.modalCtrl.create(AddLocModal);
    }
    curModal.present();
  }
}
