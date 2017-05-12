import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { AddMapModule } from '../modals/add-map.module';
import { AddLocModule } from '../modals/add-loc.module';
// import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        HomePage, 
    ],
    imports: [
        AddMapModule,
        AddLocModule,
        // ComponentsModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }
