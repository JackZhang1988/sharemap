import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { AddMapModule } from '../modals/add-map.module';
import { AddLocModule } from '../modals/add-loc.module';
import { SearchLocModule } from '../search-loc/search-loc.module';
// import { RichTextAddPageModule } from '../rich-text-add/rich-text-add.module';
import { PipesModule } from '../../pipes/pipes.module';
// import { ImagefilterPipe } from '../../pipes/imagefilter/imagefilter';
// import { ComponentsModule } from '../../components/components.module';

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
        // SearchTipsModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule { }
