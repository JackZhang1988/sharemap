import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapListPage } from './map-list';
import { Storage } from "@ionic/storage";
import { PipesModule } from '../../pipes/pipes.module';

import { ApiService } from '../../services/api';
@NgModule({
  declarations: [
    MapListPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MapListPage),
  ],
  exports: [
    MapListPage
  ]
})
export class MapListPageModule {}
