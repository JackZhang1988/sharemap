import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { FeedbackPage } from './feedback';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(FeedbackPage),
  ],
})
export class FeedbackPageModule {}
