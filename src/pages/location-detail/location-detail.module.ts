import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { LocationDetailPage } from './location-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { CommentComponentModule } from '../../components/comment/comment.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    LocationDetailPage,
  ],
  imports: [
    ComponentsModule,
    CommentComponentModule,
    PipesModule,
    DirectivesModule,
    IonicPageModule.forChild(LocationDetailPage),
  ],
})
export class LocationDetailPageModule {}
