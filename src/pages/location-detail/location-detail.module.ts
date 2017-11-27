import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { LocationDetailPage } from './location-detail';

@NgModule({
  declarations: [
    LocationDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(LocationDetailPage),
  ],
})
export class LocationDetailPageModule {}
