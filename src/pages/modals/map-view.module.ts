import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapViewModal } from './map-view';
import { PipesModule } from '../../pipes/pipes.module';
import { PathPlanPopOverModule } from '../path-plan-pop-over/path-plan-pop-over.module'

@NgModule({
    declarations: [
        MapViewModal,
    ],
    imports: [
        PipesModule,
        IonicPageModule.forChild(MapViewModal)
    ],
    exports: [
        MapViewModal
    ]
})
export class MapViewModule { }



