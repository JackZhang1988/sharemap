import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { AddMapModule } from '../modals/add-map.module';
import { AddLocModule } from '../modals/add-loc.module';
import { SearchLocModule } from '../search-loc/search-loc.module';
import { PipesModule } from '../../pipes/pipes.module';
import { LocationCategoryPageModule } from '../location-category/location-category.module';
import { MapViewModule } from '../map-view/map-view.module';


@NgModule({
    declarations: [
        HomePage,
        // ImagefilterPipe
    ],
    imports: [
        AddMapModule,
        AddLocModule,
        SearchLocModule,
        PipesModule,
        LocationCategoryPageModule,
        MapViewModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }
