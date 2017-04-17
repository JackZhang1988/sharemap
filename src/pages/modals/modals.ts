import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { AlertController, ViewController, ModalController, ToastController } from 'ionic-angular';

import { MapService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';
import { GDMap } from '../../services/gdmap';

import { Map } from '../../common/models';

class ModalContent {
  constructor(public viewCtrl: ViewController, public qiniuService?: QiniuService) { }
  imgLoading = false;

  dismiss() {
    this.viewCtrl.dismiss();
  }
  public addImage(file, callback) {
    this.qiniuService.addImage(file).subscribe(imgUrl => {
      if (imgUrl) {
        this.imgLoading = false;
        callback(imgUrl);
      }
    })
  }
}

@Component({
  templateUrl: 'add-map.html',
  providers: [MapService, QiniuService]
})
export class AddMapModal extends ModalContent {
  constructor(
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public qiniuService: QiniuService,
    private mapService: MapService
  ) {
    super(viewCtrl);
  }
  // private imgLoading = false;
  public coverImg: string;
  public title: string;
  public description: string;

  public imgChange(event) {
    this.imgLoading = true;
    this.addImage(event.srcElement.files[0], (imgUrl) => this.coverImg = imgUrl);
    // this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl => {
    //   if (imgUrl) {
    //     this.imgLoading = false;
    //     this.coverImg = imgUrl;
    //   }
    // })
  }
  public submit() {
    console.log(this.coverImg, this.title, this.description);
    this.mapService.addNewMap({
      coverImg: this.coverImg,
      title: this.title,
      description: this.description
    }).subscribe(res => {
      console.log(res);
      let toast = this.toastCtrl.create({
        message: '添加成功',
        duration: 2000,
        position: 'middle'
      })
      toast.onDidDismiss(() => this.viewCtrl.dismiss());
      toast.present();
      //   this.viewCtrl.dismiss();
    })

  }
}


@Component({
  templateUrl: 'add-loc.html',
  providers: [MapService, QiniuService]
})
export class AddLocModal extends ModalContent {
  constructor(
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public qiniuService: QiniuService,
    private mapService: MapService
  ) {
    super(viewCtrl);
  }
  curLocation: any = {};
  maps: Map[] = [];
  locationImgs: string[] = [];
  isShowImgUploader = true;
  ngOnInit(): void {
    this.getMaps();
  }
  getMaps(): void {
    this.mapService.getMaps().subscribe(res => {
      if (res.status == 0) {
        this.maps = res.result;
      }
    });
  }
  imgChange(event) {
    this.imgLoading = true;
    this.addImage(event.srcElement.files[0], (imgUrl) => {
      this.locationImgs.push(imgUrl);
      if (this.locationImgs.length >= 4) {
        this.isShowImgUploader = false;
      }
    });
  }
  showMapModal() {
    let curModal;
    curModal = this.modalCtrl.create(SearchLocModal);
    curModal.onDidDismiss(data => {
      // console.log(data);
      if (data) {
        this.curLocation = data;
      }
    });
    curModal.present();
  }
  submit() {
    if (!this.curLocation.name) {
      let alert = this.alertCtrl.create({
        title: '您还没添加地理位置',
        buttons: ['关闭']
      });
      alert.present();
    } else {
      this.viewCtrl.dismiss(this.curLocation);
    }
  }
}

@Component({
  templateUrl: 'search-loc.html',
  providers: [GDMap]
})
export class SearchLocModal {
  constructor(
    public viewCtrl: ViewController,
    public mapService: GDMap,
    public zone: NgZone
  ) { }
  tips: any[];
  isShowTipSelecter = false;
  citycode: String;
  keyword: String = '';
  curSelectPlace: any;
  hasInitDrag = false;

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ngOnInit(): void {
    this.mapService.initMap();
    // this.gdMap.initGeolocation(data => {
    //   console.log(data);
    //   this.citycode = data.addressComponent.citycode;
    //   this.gdMap.initAutoSearch({
    //     city: data.addressComponent.citycode
    //   });
    // }, errorData => { });
    this.mapService.initLocateMap();
    this.tips = [];
  }

  autoSearch() {
    if (this.keyword && this.keyword.trim()) {
      this.mapService.autoSearch(this.keyword, (status, result) => {
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
    this.mapService.clearMap();
    this.mapService.addMarker([tip.location.lng, tip.location.lat], () => {
      if (!this.hasInitDrag) {
        this.mapService.initDragLocate((result) => {
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
    console.log(this.curSelectPlace);
    this.viewCtrl.dismiss(this.curSelectPlace);
  }
}

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
