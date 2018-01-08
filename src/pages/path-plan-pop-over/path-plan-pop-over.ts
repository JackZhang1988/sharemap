import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'path-plan-pop-over',
  templateUrl: 'path-plan-pop-over.html'
})
export class PathPlanPopOverPage {

  text: string;
  curPosition = this.navParams.get('curPosition');
  curMarker = this.navParams.get('curMarker');
  gdService = this.navParams.get('gdService');

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
  }


  pathPlan(pathPlanType) {
    console.log(this.curPosition, this.curMarker);
    if (this.curPosition && this.curMarker) {
      let curPosition = [this.curPosition.position.lng, this.curPosition.position.lat];
      let curMarker = [this.curMarker.getPosition().lng, this.curMarker.getPosition().lat];
      this.gdService.pathSearch(pathPlanType, curPosition, curMarker)
    }
    this.viewCtrl.dismiss();
  }
}
