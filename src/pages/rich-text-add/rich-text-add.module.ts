import { NgModule } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicPageModule } from 'ionic-angular';
import { RichTextAddPage } from './rich-text-add';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    RichTextAddPage,
  ],
  imports: [
    IonicPageModule.forChild(RichTextAddPage),
  ],
  providers: [ImagePicker, FileTransfer, Camera]
})
export class RichTextAddPageModule { }
