import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommentComponent } from './comment';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';
@NgModule({
  declarations: [CommentComponent],
  imports: [IonicModule, PipesModule, DirectivesModule],
  exports: [CommentComponent]
})
export class CommentComponentModule { }