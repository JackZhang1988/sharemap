import { NgModule } from '@angular/core';
import {IonicModule}  from 'ionic-angular'
import { SearchLocModal } from './search-loc/search-loc';
import { SearchTips } from './search-tips/search-tips';

@NgModule({
  declarations: [
    SearchTips,
    SearchLocModal
  ],
  imports: [IonicModule],
  exports: [
    SearchTips,
    SearchLocModal
  ]
})
export class ComponentsModule { }