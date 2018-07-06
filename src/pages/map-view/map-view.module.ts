import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapViewModal } from './map-view';
import { PipesModule } from '../../pipes/pipes.module';

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



