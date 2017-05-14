import { Component, NgZone } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
  templateUrl: 'search-loc.html'
})
export class SearchLocModal {
  constructor(
    public viewCtrl: ViewController,
    public zone: NgZone
  ) { }
  tips: any[] = [];
  isShowTipSelecter = false;
  citycode: string;
  keyword: string = '';
  curSelectPlace: any;
  hasInitDrag = false;
  gdService: any;

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ngOnInit(): void {
    this.gdService = new GDMap();
  }

  autoSearch() {
    if (this.keyword && this.keyword.trim()) {
      this.gdService.autoSearch(this.keyword, (status, result) => {
        console.log(status, result);
        if (status == 'complete') {
          this.zone.run(() => {
            this.isShowTipSelecter = true;
            this.tips = result.tips;
          })
          // this.tips = result.poiList.pois;
        }
      })
    } else {
      this.isShowTipSelecter = false;
    }
  }
  handleTipSelect(tip: any) {
    console.log(tip);
    this.isShowTipSelecter = false;
    // this.gdMap.placeSearch.search(tip.name);
    this.keyword = '';
    this.curSelectPlace = tip;
    this.gdService.clearMap();
    this.gdService.addMarker([tip.location.lng, tip.location.lat], () => {
      if (!this.hasInitDrag) {
        this.gdService.initDragLocate((result) => {
          this.zone.run(() => {
            let city = result.addressComponent.city;
            let province = result.addressComponent.province;
            let district = result.addressComponent.district;
            let township = result.addressComponent.township;
            this.curSelectPlace = {
              name: result.formattedAddress.replace(province, '').replace(city, '').replace(district, '').replace(township, '') + result.addressComponent.street + result.addressComponent.streetNumber,
              address: result.formattedAddress,
              location: result.location,
              district: result.addressComponent.district,
              citycode: result.addressComponent.citycode,
              adcode: result.addressComponent.adcode
            };
            console.log(this.curSelectPlace.name);
          })
        });
        this.hasInitDrag = true;
      }
    });
  }

  submit() {
    // this.gdMap.addMarker([116.405467, 39.907761]);
    // console.log(this.curSelectPlace);
    this.viewCtrl.dismiss(this.curSelectPlace);
  }
}