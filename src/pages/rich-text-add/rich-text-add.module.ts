import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RichTextAddPage } from './rich-text-add';

@NgModule({
  declarations: [
    RichTextAddPage,
  ],
  imports: [
    IonicPageModule.forChild(RichTextAddPage),
  ],
})
export class RichTextAddPageModule {}
