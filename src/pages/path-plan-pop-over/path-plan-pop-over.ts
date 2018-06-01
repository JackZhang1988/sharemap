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
    pathPannel = this.navParams.get('pathPannel');

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {}

    pathPlan(pathPlanType) {
        console.log(this.curPosition, this.curMarker);
        if (this.curPosition && this.curMarker && this.gdService) {
            let curPosition = [this.curPosition.position.lng, this.curPosition.position.lat];
            let curMarker = [this.curMarker.getPosition().lng, this.curMarker.getPosition().lat];
            if (this.pathPannel) {
                //清空之前的pathPannel记录
                this.pathPannel.nativeElement.innerHTML = '';
            }
            this.gdService.clearLastPathSearch();
            this.gdService.pathSearch(pathPlanType, curPosition, curMarker, (status, result) => {
                console.log(status, result);
                if (status == 'error') {
                    this.viewCtrl.dismiss({
                        status,
                        pathSearchTrigger: false
                    });
                } else {
                    this.viewCtrl.dismiss({
                        status,
                        pathSearchTrigger: true,
                        curPathPlanType: pathPlanType
                    });
                }
            });
        }
    }
}
