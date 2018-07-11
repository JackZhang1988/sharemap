import { Component, ViewChild, ElementRef, trigger, state, style, transition, animate, NgZone } from '@angular/core';
import {
    IonicPage,
    ViewController,
    NavController,
    PopoverController,
    NavParams,
    ToastController,
    Platform,
    Slides,
    LoadingController,
} from 'ionic-angular';
import { GDMap } from '../../services/gdmap';
import { ApiService } from '../../services/api';
import { LocationCategory } from '../../common/models'

@IonicPage()
@Component({
    templateUrl: 'map-view.html',
    providers: [ApiService, GDMap],
    animations: [
        trigger('enterAnimation', [
            transition(':enter', [
                style({ transform: 'translate3d(0, -100%, 0)', opacity: 0 }),
                animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'none', opacity: 1 }),
                animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class MapViewModal {
    constructor(
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public zone: NgZone,
        public popoverCtrl: PopoverController,
        public navParams: NavParams,
        public apiService: ApiService,
        private gdService: GDMap,
        private loadingCtrl: LoadingController,
        public plt: Platform,
    ) { }
    @ViewChild(Slides) slides: Slides;
    @ViewChild('pathPannel', { read: ElementRef })
    pathPannel: ElementRef;

    public type: string = this.navParams.get('type');
    public title: string = this.navParams.get('title');
    public mapInfo: any = this.navParams.get('mapInfo');
    public count: Number = this.navParams.get('count'); // 判断marker总个数
    public mapLocations: any[] = this.navParams.get('mapLocations');
    public markerList: any[] = [];
    private preMarker: any;
    private curMarker: any;
    private curPathPlanType: string;
    private curPosition: any;
    private pathSearchTrigger: boolean = false;
    private showPathPanel: boolean = false;
    private showSlides: boolean = true;
    private slidesData: any[] = [];
    public categoryList: LocationCategory[] = [];
    curCateType: string = 'all';
    curCateItem: LocationCategory;
    private loading: any;

    //使用动态id，方式生成多个modal时id重复
    private randomMapId: string = 'mapContainer-' + new Date().getTime().toString(32);

    ionViewDidLoad() {
        let geoTime = 0;
        let buttonOffset;
        if (this.type == 'map-locations') {
            let btnOffsetHeight = this.plt.is('ios') ? 100 : 140;
            buttonOffset = new AMap.Pixel(10, btnOffsetHeight);
        } else {
            buttonOffset = new AMap.Pixel(10, 10);
        }
        this.gdService.initMap({
            container: this.randomMapId
        });
        this.gdService.initGeolocation(
            {
                panToLocation: false,
                zoomToAccuracy: false,
                // buttonPosition: 'LB',
                buttonOffset: buttonOffset
            },
            result => {
                this.zone.run(() => {
                    this.curPosition = result;
                    // 首次加载时不根据定位调整定位视图，用户点击定位按钮后调整
                    if (geoTime) {
                        this.gdService.gdMap.setZoomAndCenter(13, result.position);
                    }
                    geoTime++;
                });
                // AMap.Transfer需要传city字段，所以在获得city信息后再初始化
                this.gdService.initPathPlan('pathPannel');
            }
        );

        this.loading = this.loadingCtrl.create({
            content: '正在初始化地图...'
        });

        // 获得去重后端categoryList
        let __getCategoryList = (mapLocations: any[]): LocationCategory[] => {
            let maplocCateList = mapLocations.filter(item => item.locationCategory).map(item => item.locationCategory);
            let result = [];
            let __hasCate = (resultArr, cateId) => {
                let hasResult = false;
                for (let j = 0; j < resultArr.length; j++) {
                    if (resultArr[j]._id == cateId) {
                        hasResult = true;
                        break;
                    }
                }
                return hasResult;
            }
            for (let i = 0; i < maplocCateList.length; i++) {
                if (__hasCate(result, maplocCateList[i]._id)) {
                    continue;
                } else {
                    result.push(maplocCateList[i]);
                }
            }
            console.log('cur categoryList: ', result);
            return result;
        }
        if (this.type == 'map-locations') {
            //获取map下所有location
            console.log('map-locations', this.mapLocations);
            //mock
            // this.mapLocations = this.mapLocations.filter(item => item._id !== '58fe1a5f7a67142b2fad1a42')
            let mapId = this.mapLocations[0].mapId;
            this.loading.present();

            if (this.count >= 10) {
                // 说明该地图位置数据需要从接口里取
                this.apiService.getMapAllLocations({ mapId: mapId }).subscribe(res => {
                    if (res.status == 0) {
                        this.mapLocations = res.result.locations;
                        this.categoryList = __getCategoryList(this.mapLocations);

                        if (res.result.locations.length > 100) {
                            this.renderMarkerList(res.result.locations);
                        } else {
                            this.renderMarkerList(res.result.locations);
                        }
                        this.loading.dismiss();
                        // this.initSlideWidth();
                    }
                });
            } else {
                this.categoryList = __getCategoryList(this.mapLocations);
                this.renderMarkerList(this.mapLocations);
                this.loading.dismiss();
            }
        } else {
            // location detail页不显示slide
            this.showSlides = false;
            this.renderMarkerList([this.mapLocations]);

        }
        if (this.type == 'map-locations') {
            this.slides.width = window.screen.width * 0.9;
        }
    }

    renderMarkerList(markerObjList) {
        console.log('当前 mapLocations', markerObjList);

        if (markerObjList.length > 100) {
            let clusterMarkerList = markerObjList.map(item => {
                return {
                    lnglat: item.lnglat,
                    info: item
                }
            })
            // 使用点聚合地图
            this.markerList = this.gdService.renderCluserMarker(clusterMarkerList, {
                markerClick: curMarker => {
                    this.curMarker = curMarker;
                    //聚合地图显示slider，但由于量比较大，所以只显示当前点击的那一个
                    this.slidesData = [curMarker.getExtData().info];
                }
            });
        } else {
            this.slidesData = markerObjList;
            this.markerList = this.gdService.addIconMarkers(markerObjList, {
                markerClick: (target, index) => {
                    this.highlightMarker(target);
                    this.slides.slideTo(index);
                }
            });;
            this.curMarker = this.markerList[0];
            //默认高亮第一个marker
            this.highlightMarker(this.curMarker);
        }
    }

    highlightMarker(iconMarker) {
        this.gdService.highlightIconMarker(iconMarker);
    }

    unhighlightMarker(iconMarker) {
        this.gdService.unhighlightIconMarker(iconMarker);
    }

    selectCategory(type: string, data?) {
        if (this.curCateType == type) {
            //如果当前type和上一次一样，则返回
            return;
        }
        this.curCateType = type;
        this.curCateItem = data;
        this.gdService.clearMap();
        if (this.curCateType == 'all') {
            this.renderMarkerList(this.mapLocations);
        } else {
            this.renderMarkerList(this.mapLocations.filter(item => {
                return item.locationCategory && item.locationCategory._id == this.curCateItem._id;
            }))
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    presentToast(message) {
        const toast = this.toastCtrl.create({
            message,
            duration: 1500
        });
        toast.present();
    }
    goLocationDetail(locationData) {
        this.navCtrl.push('LocationDetailPage', {
            id: locationData._id,
            from: 'map-view'
        });
    }

    // slideWillChange(): void {
    //     // this.slides.width = window.screen.width * 0.95;
    // }

    slideDidChange(): void {
        let curMarkerInfo = this.mapLocations[this.slides.getActiveIndex()];
        this.curMarker = this.markerList[this.slides.getActiveIndex()];
        if (curMarkerInfo) {
            // this.gdService.setZoomAndCenter(curMarkerInfo.lnglat)
            // 高亮显示改坐标
            this.highlightMarker(this.curMarker);
        }
        this.preMarker = this.markerList[this.slides.getPreviousIndex()];

        if (this.preMarker) {
            console.log('preMarker', this.preMarker);
            //恢复成默认光标
            this.unhighlightMarker(this.preMarker);
        }
        //slider滑动时更新导航信息
        this.pathSearch();
    }

    pathSearch() {
        if (this.curPosition && this.curMarker && this.gdService && this.curPathPlanType) {
            let curPosition = [this.curPosition.position.lng, this.curPosition.position.lat];
            let curMarker = [this.curMarker.getPosition().lng, this.curMarker.getPosition().lat];
            if (this.pathPannel) {
                //清空之前的pathPannel记录
                this.pathPannel.nativeElement.innerHTML = '';
            }
            this.gdService.clearLastPathSearch();
            this.gdService.pathSearch(this.curPathPlanType, curPosition, curMarker);
        }
    }

    openPathSelect(ev: UIEvent) {
        let popover = this.popoverCtrl.create('PathPlanPopOverPage', {
            curPosition: this.curPosition,
            curMarker: this.curMarker,
            gdService: this.gdService,
            pathPannel: this.pathPannel,
            pathSearchTrigger: this.pathSearchTrigger
        });
        popover.present({
            ev: ev
        });
        popover.onDidDismiss(data => {
            if (data) {
                if (data.status == 'error') {
                    this.presentToast('查询不到导航信息');
                }
                this.curPathPlanType = data.curPathPlanType;
                this.pathSearchTrigger = data.pathSearchTrigger;
            }
        });
    }

    openPathPannel() {
        this.showPathPanel = !this.showPathPanel;
    }
}
