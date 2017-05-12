import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMapModal } from './add-map';

@NgModule({
    declarations: [
        AddMapModal
    ],
    imports: [IonicPageModule.forChild(AddMapModal)],
    exports: [
        AddMapModal
    ]
})
export class AddMapModule { }



