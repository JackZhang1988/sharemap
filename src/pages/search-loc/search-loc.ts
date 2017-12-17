import { Component, NgZone } from '@angular/core';
import { IonicPage, ViewController, ModalController, NavParams } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
  templateUrl: 'search-loc.html',
  providers: [GDMap]
})
export class SearchLocModal {
  constructor(
    public viewCtrl: ViewController,
    public zone: NgZone,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private gdService: GDMap
  ) { }
  tips: any[] = [];
  isShowTipSelecter = false;
  citycode: string;
  keyword: string = '';
  curSelectPlace: any;
  hasInitDrag = false;
  loading = true;
  loadingText = '正在定位中...';
  private mapInfo: any = this.navParams.get('mapInfo');

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ngOnInit(): void {
    this.gdService.initMap();
    this.gdService.initLocateMap({}, (curLocalResult) => {
      this.zone.run(() => {
        if (curLocalResult.addressComponent) {
          this.gdService.addMarker([curLocalResult.position.lng, curLocalResult.position.lat]);
          this.setSelectPlace(curLocalResult);
        } else {
          this.loading = true;
          this.loadingText = '定位失败，请检查您的网络';
        }
      })
    }, () => {
      this.zone.run(() => {
        this.loading = true;
        this.loadingText = '定位失败，请检查您的网络';
      });
    });

    if (!this.hasInitDrag) {
      this.gdService.initDragLocate((dragResult) => {
        this.zone.run(() => {
          this.setSelectPlace(dragResult);
        })
      });
      this.hasInitDrag = true;
    }
  }

  setSelectPlace(result) {
    this.loading = false;
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
  }

  autoSearch() {
    if (this.keyword && this.keyword.trim()) {
      this.gdService.autoSearch(this.keyword, (status, result) => {
        // console.log(status, result);
        if (status == 'complete') {
          this.zone.run(() => {
            this.loading = false;
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

    });
  }

  submit() {
    let curModal = this.modalCtrl.create('AddLocModal', {
      curSelectPlace: this.curSelectPlace,
      mapInfo: this.mapInfo
    })
    curModal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        //有数据返回表示添加成功
        this.viewCtrl.dismiss();
      }
    });
    curModal.present();
  }
}