import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLocationCategoryPage } from './add-location-category';

@NgModule({
  declarations: [
    AddLocationCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLocationCategoryPage),
  ],
})
export class AddLocationCategoryPageModule {}
