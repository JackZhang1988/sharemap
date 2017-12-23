import { NgModule } from '@angular/core';
import { ImagefilterPipe } from "./imagefilter";
import { EscapeHtmlPipe } from "./keep-html";


@NgModule({
    declarations: [
        ImagefilterPipe,
        EscapeHtmlPipe
    ],
    imports: [

    ],
    exports: [
        ImagefilterPipe, 
        EscapeHtmlPipe
    ]
})

export class PipesModule { }