import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLocModal } from './add-loc';
import { PipesModule } from '../../pipes/pipes.module';
import { RichTextAddModule } from '../../components/rich-text-add/rich-text-add.module';

@NgModule({
    declarations: [
        AddLocModal
    ],
    imports: [
        PipesModule,
        RichTextAddModule,
        IonicPageModule.forChild(AddLocModal)
    ],
    exports: [
        AddLocModal
    ]
})
export class AddLocModule { }



