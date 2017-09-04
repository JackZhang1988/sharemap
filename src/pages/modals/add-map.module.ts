import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMapModal } from './add-map';
import { FileTransfer } from '@ionic-native/file-transfer';

@NgModule({
    declarations: [
        AddMapModal
    ],
    imports: [IonicPageModule.forChild(AddMapModal)],
    exports: [
        AddMapModal
    ],
    providers: [FileTransfer]
})
export class AddMapModule { }



