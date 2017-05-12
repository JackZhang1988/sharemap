import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'search-tips',
  template: '<div class="tip-item" *ngFor="let tip of curTips" (click)="handleTipClick(tip)" [hidden]="!isShowTipSelecter">\
        <span class="tip-title">{{tip.name}}</span>\
        <span class="tip-notice">{{tip.district}}</span>\
      </div>'
})
export class SearchTips {
  constructor() { }
  @Input() curTips: any[];
  @Output() tipSelected = new EventEmitter();
  @Input() isShowTipSelecter: Boolean;

  handleTipClick(tip: any) {
    this.isShowTipSelecter = false;
    this.tipSelected.emit(tip)
  }
}