import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
// import { AddMapModal, AddLocModal, SearchLocModal, SearchTips } from '../modals/modals';
// import { ModalsModule } from '../modals/modals.module';
import { AddMapModule } from '../modals/add-map.module';
import { AddLocModule } from '../modals/add-loc.module';

@NgModule({
    declarations: [
        HomePage, 
    ],
    imports: [
        AddMapModule,
        AddLocModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }
