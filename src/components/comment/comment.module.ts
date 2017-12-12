import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommentComponent } from './comment';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [CommentComponent],
  imports: [IonicModule, PipesModule],
  exports: [CommentComponent]
})
export class CommentComponentModule { }