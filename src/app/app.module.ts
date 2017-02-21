import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AddMapModal, AddLocModal, SearchLocModal } from '../pages/modals/modals';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AddMapModal,
    AddLocModal,
    SearchLocModal
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }, {})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AddMapModal,
    AddLocModal,
    SearchLocModal
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: 'IMGURL', useValue: 'http://okyb0e40i.bkt.clouddn.com/' }]
})
export class AppModule { }
