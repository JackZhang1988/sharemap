import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapListPage } from './map-list';
import { Storage } from "@ionic/storage";

import { ApiService } from '../../services/api';
@NgModule({
  declarations: [
    MapListPage,
  ],
  imports: [
    IonicPageModule.forChild(MapListPage),
  ],
  exports: [
    MapListPage
  ]
})
export class MapListPageModule {}
