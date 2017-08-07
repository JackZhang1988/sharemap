import { NgModule } from '@angular/core';
import { ImagefilterPipe } from "./imagefilter/imagefilter";


@NgModule({
    declarations: [
        ImagefilterPipe,
    ],
    imports: [

    ],
    exports: [
        ImagefilterPipe,
    ]
})

export class PipesModule { }