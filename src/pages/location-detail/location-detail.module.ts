import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { LocationDetailPage } from './location-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LocationDetailPage,
  ],
  imports: [
    ComponentsModule,
    PipesModule,
    IonicPageModule.forChild(LocationDetailPage),
  ],
})
export class LocationDetailPageModule {}
