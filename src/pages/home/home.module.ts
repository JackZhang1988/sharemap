import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { AddMapModule } from '../modals/add-map.module';
import { AddLocModule } from '../modals/add-loc.module';
import { SearchLocModule } from '../search-loc/search-loc.module';
// import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        AddMapModule,
        AddLocModule,
        SearchLocModule,
        // SearchTipsModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }
