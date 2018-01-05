import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PathPlanPopOverPage } from './path-plan-pop-over';
@NgModule({
	declarations: [
		PathPlanPopOverPage
	],
	imports: [IonicPageModule.forChild(PathPlanPopOverPage)],
	exports: [
		PathPlanPopOverPage
	]
})
export class PathPlanPopOverModule { }

