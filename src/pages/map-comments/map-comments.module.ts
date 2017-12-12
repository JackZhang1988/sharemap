import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapCommentsPage } from './map-comments';
import { CommentComponentModule } from '../../components/comment/comment.module';

@NgModule({
  declarations: [
    MapCommentsPage,
  ],
  imports: [
    CommentComponentModule,
    IonicPageModule.forChild(MapCommentsPage),
  ],
})
export class MapCommentsPageModule {}
