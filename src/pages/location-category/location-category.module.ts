import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationCategoryPage } from './location-category';
import { IconListPageModule } from '../icon-list/icon-list.module';
import { AddLocationCategoryPageModule } from '../add-location-category/add-location-category.module';

@NgModule({
  declarations: [
    LocationCategoryPage,
  ],
  imports: [
    IconListPageModule,
    AddLocationCategoryPageModule,
    IonicPageModule.forChild(LocationCategoryPage),
  ],
})
export class LocationCategoryPageModule {}
