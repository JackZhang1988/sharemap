import { Directive, HostListener, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the NavUserProfileDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[nav-user-profile]' // Attribute selector
})
export class NavUserProfileDirective {

  constructor(public navCtrl: NavController) {
  }
  @Input() userId: string;

  @HostListener('click')
  public onClick(targetEle) {
    this.navCtrl.push('ProfilePage', {
      userId: this.userId
    })
  }
}
