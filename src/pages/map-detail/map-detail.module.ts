import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapDetailPage } from './map-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { LocationDetailPageModule } from '../location-detail/location-detail.module';
import { ComponentsModule } from '../../components/components.module';
import { MapCommentsPageModule } from '../map-comments/map-comments.module';

@NgModule({
  declarations: [
    MapDetailPage,
  ],
  imports: [
    PipesModule,
    ComponentsModule,
    LocationDetailPageModule,
    MapCommentsPageModule,
    IonicPageModule.forChild(MapDetailPage),
  ],
  exports: [
    MapDetailPage
  ]
})
export class MapDetailPageModule {}
