import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ContactPageModule } from '../pages/contact/contact.module';
// import { ComponentsModule } from '../components/components.module';
// import { SearchLocModal } from '../components/search-loc/search-loc';
// import { SearchTips } from '../components/search-tips/search-tips';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ContactPageModule,
    HttpModule,
    // ComponentsModule,
    IonicModule.forRoot(MyApp, { backButtonText: '' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: 'IMGURL', useValue: 'http://okyb0e40i.bkt.clouddn.com/' },
    SplashScreen,
    StatusBar
  ]
})
export class AppModule { }