import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchLocModal } from './search-loc';
import { SearchTipsModule } from '../../components/search-tips/search-tips.module';


@NgModule({
    declarations: [
        SearchLocModal
    ],
    imports: [SearchTipsModule, IonicPageModule.forChild(SearchLocModal)],
    exports: [
        SearchLocModal
    ]
})
export class SearchLocModule { }



