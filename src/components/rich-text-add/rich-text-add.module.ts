import { NgModule } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicModule } from 'ionic-angular';
import { RichTextAdd } from './rich-text-add';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RichTextAdd,
  ],
  imports: [
    PipesModule,
    IonicModule
  ],
  providers: [ImagePicker, FileTransfer, Camera],
  exports:[RichTextAdd]
})
export class RichTextAddModule { }
