import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'path-plan-pop-over',
  templateUrl: 'path-plan-pop-over.html'
})
export class PathPlanPopOverPage {

  text: string;

  constructor() {
    console.log('Hello PathPlanPopOverComponent Component');
  }
  pathPlan(pathPlanType) {

  }
}
