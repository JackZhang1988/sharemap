import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapDetailPage } from './map-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MapDetailPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MapDetailPage),
  ],
  exports: [
    MapDetailPage
  ]
})
export class MapDetailPageModule {}
