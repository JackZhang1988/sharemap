import { NgModule } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicPageModule } from 'ionic-angular';
import { RichTextAddPage } from './rich-text-add';
import { FileTransfer } from '@ionic-native/file-transfer';

@NgModule({
  declarations: [
    RichTextAddPage,
  ],
  imports: [
    IonicPageModule.forChild(RichTextAddPage),
  ],
  providers: [ImagePicker, FileTransfer]
})
export class RichTextAddPageModule { }
