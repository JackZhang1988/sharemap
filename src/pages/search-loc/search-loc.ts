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

    locationInfo: any = this.navParams.get('locationInfo');
    tips: any[] = [];
    isShowTipSelecter = false;
    citycode: string;
    keyword: string = '';
    curSelectPlace: any;
    hasInitDrag = false;
    curCity: string = '';
    loading = true;
    loadingText = '正在定位中...';
    private mapInfo: any = this.navParams.get('mapInfo');

    // ionViewWillEnter() {
    //     typeof StatusBar !== 'undefined' && StatusBar.backgroundColorByHexString('#f8f8f8');
    // }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    ngOnInit(): void {
        this.gdService.initMap();
        this.gdService.initCity();
        this.gdService.initGeocoder();
        let __initMapContent = (curLocalResult) => {
            let cityStr = curLocalResult.addressComponent.city || curLocalResult.addressComponent.province;
            this.curCity = cityStr.replace('市', '');
            this.gdService.addMarker([curLocalResult.position.lng, curLocalResult.position.lat]);
            this.setSelectPlace(curLocalResult);
        }
        if (this.locationInfo) {
            __initMapContent(this.locationInfo);
        } else {
            this.gdService.initLocate({
                success: curLocalResult => {
                    this.zone.run(() => {
                        if (curLocalResult.addressComponent) {
                            __initMapContent(curLocalResult);
                        } else {
                            this.loading = true;
                            this.loadingText = '定位失败，请检查您的网络';
                        }
                    });
                },
                error: () => {
                    this.zone.run(() => {
                        this.loading = true;
                        this.loadingText = '定位失败，请检查您的网络';
                    });
                }
            });
        }

        if (!this.hasInitDrag) {
            this.gdService.initDragLocate(dragResult => {
                this.zone.run(() => {
                    this.setSelectPlace(dragResult);
                });
            });
            this.hasInitDrag = true;
        }
    }

    showCityList() {
        let cityListModal = this.modalCtrl.create('CityListPage');
        cityListModal.onDidDismiss(data => {
            if (data) {
                this.gdService.gdMap.setCity(data.adcode);
                this.gdService.auto.setCity(data.adcode);
                this.curCity = data.cityName;
            }
        });
        cityListModal.present();
    }

    setSelectPlace(result) {
        this.loading = false;
        let city = result.addressComponent.city;
        let province = result.addressComponent.province;
        let district = result.addressComponent.district;
        let township = result.addressComponent.township;
        this.curSelectPlace = {
            name:
                result.formattedAddress
                    .replace(province, '')
                    .replace(city, '')
                    .replace(district, '')
                    .replace(township, ''),
            address: result.formattedAddress,
            location: result.location,
            district: result.addressComponent.district,
            citycode: result.addressComponent.citycode,
            adcode: result.addressComponent.adcode
        };
        console.log('curSelectPlace:', this.curSelectPlace);
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
                    });
                    // this.tips = result.poiList.pois;
                }
            });
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
        this.gdService.addMarker([tip.location.lng, tip.location.lat], () => { });
    }

    submit() {
        this.viewCtrl.dismiss({
            curSelectPlace:this.curSelectPlace
        })
        // let curModal = this.modalCtrl.create('AddLocModal', {
        //     curSelectPlace: this.curSelectPlace,
        //     mapInfo: this.mapInfo
        // });
        // curModal.onDidDismiss(data => {
        //     console.log(data);
        //     if (data) {
        //         //有数据返回表示添加成功
        //         this.viewCtrl.dismiss(data, 'add-location-done', {
        //             animate: false
        //         });
        //     }
        // });
        // curModal.present();
    }
}
