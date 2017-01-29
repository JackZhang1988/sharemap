import { Component } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AddMapModal, AddLocModal } from '../modals/modals';
import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController) {

  }
  goContactPage(){
      this.navCtrl.push(ContactPage);
  }
  openAddModal(type){
      let curModal;
      if(type == 'map'){
          curModal = this.modalCtrl.create(AddMapModal);
      }else{
          curModal = this.modalCtrl.create(AddLocModal);
      }
      curModal.present();
  }
}
