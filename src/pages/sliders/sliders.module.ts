import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlidersPage } from './sliders';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SlidersPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SlidersPage),
  ],
})
export class SlidersPageModule {}
