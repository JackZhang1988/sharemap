import { NgModule, ErrorHandler } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtHelper, AuthConfig, AuthHttp } from "angular2-jwt";

import { MyApp } from './app.component';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { AuthServiceProvider } from '../providers/auth/auth';
// import { ComponentsModule } from '../components/components.module';
// import { SearchLocModal } from '../components/search-loc/search-loc';
// import { SearchTips } from '../components/search-tips/search-tips';
export function authHttpServiceFactory(http: Http, options: RequestOptions, storage: Storage) {
  const authConfig = new AuthConfig({
    tokenGetter: (() => storage.get('token')),
  });
  return new AuthHttp(authConfig, http, options);
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ProfilePageModule,
    HttpModule,
    // ComponentsModule,
    IonicModule.forRoot(MyApp, { backButtonText: '' }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: 'IMGURL', useValue: 'http://okyb0e40i.bkt.clouddn.com/' },
    SplashScreen,
    StatusBar,
    AuthServiceProvider,
    JwtHelper, {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, Storage]
    },
  ]
})
export class AppModule { }