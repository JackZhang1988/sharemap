import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AddMapModal, AddLocModal, SearchLocModal, SearchTips } from '../pages/modals/modals';

@NgModule({
  declarations: [
    MyApp,
    AddMapModal,
    AddLocModal,
    SearchLocModal,
    SearchTips,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { backButtonText: '' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddMapModal,
    AddLocModal,
    SearchLocModal,
    SearchTips,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: 'IMGURL', useValue: 'http://okyb0e40i.bkt.clouddn.com/' },
    SplashScreen,
    StatusBar
  ]
})
export class AppModule { }