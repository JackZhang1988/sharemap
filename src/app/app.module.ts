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
import { AuthServiceProvider } from '../providers/auth/auth';
import { FileTransfer } from '@ionic-native/file-transfer';

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
    HttpModule,
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
    FileTransfer,
    JwtHelper, {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, Storage]
    },
  ]
})
export class AppModule { }