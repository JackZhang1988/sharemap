import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLocModal } from './add-loc';

@NgModule({
    declarations: [
        AddLocModal
    ],
    imports: [IonicPageModule.forChild(AddLocModal)],
    exports: [
        AddLocModal
    ]
})
export class AddLocModule { }



