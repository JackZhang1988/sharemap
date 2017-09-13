import { NgModule } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicPageModule } from 'ionic-angular';
import { RichTextAddPage } from './rich-text-add';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RichTextAddPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(RichTextAddPage),
  ],
  providers: [ImagePicker, FileTransfer, Camera]
})
export class RichTextAddPageModule { }
