import { Component, ViewChild, ElementRef, trigger, state, style, transition, animate } from '@angular/core';
import { IonicPage, ViewController, NavController, PopoverController, NavParams, Slides } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';
import { ApiService } from '../../services/api';
// import { PathPlanPopOverComponent } from '../../components/path-plan-pop-over/path-plan-pop-over';

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
        public popoverCtrl: PopoverController,
        public navParams: NavParams,
        public apiService: ApiService,
        private gdService: GDMap
    ) {}
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
    private isMass: boolean = false;
    private showSlides: boolean = false;
    private slidesData: any[] = [];

    //使用动态id，方式生成多个modal时id重复
    private randomMapId: string = 'mapContainer-' + new Date().getTime().toString(32);

    ionViewDidLoad() {
        this.gdService.initMap(this.randomMapId);
        let geoTime = 0;
        let buttonOffset;
        if (this.type == 'map-locations') {
            buttonOffset = new AMap.Pixel(10, 100);
        } else {
            buttonOffset = new AMap.Pixel(10, 10);
        }
        this.gdService.initGeolocation(
            {
                panToLocation: false,
                zoomToAccuracy: false,
                buttonPosition: 'LT',
                buttonOffset: new AMap.Pixel(10, 10)
            },
            result => {
                this.curPosition = result;

                // 首次加载时不根据定位调整定位视图，用户点击定位按钮后调整
                if (geoTime) {
                    this.gdService.gdMap.setZoomAndCenter(13, result.position);
                }
                geoTime++;
            }
        );
        this.gdService.initPathPlan('pathPannel');

        let markList = [];
        if (this.type == 'map-locations' && this.count >= 10) {
            //获取map下所有location
            let mapId = this.mapLocations[0].mapId;
            this.apiService.getMapAllLocations({ mapId: mapId }).subscribe(res => {
                if (res.status == 0) {
                    this.mapLocations = res.result.locations;
                    if (res.result.locations.length > 100) {
                        this.isMass = true;
                        markList = res.result.locations.map(item => {
                            return {
                                lnglat: item.lnglat,
                                info: item
                            };
                        });
                        //数量庞大的marker使用massMarks
                        this.gdService.addMassMarks(markList, {
                            markerClick: locData => {
                                this.slidesData = [locData.info];
                            }
                        });

                        // this.gdService.addMarkerClusterer(markList)
                        // let mock =  [{"lnglat":[116.258446,37.686622],"name":"景县","style":2},{"lnglat":[113.559954,22.124049],"name":"圣方济各堂区","style":2},{"lnglat":[116.366794,39.915309],"name":"西城区","style":2},{"lnglat":[116.486409,39.921489],"name":"朝阳区","style":2},{"lnglat":[116.286968,39.863642],"name":"丰台区","style":2},{"lnglat":[116.195445,39.914601],"name":"石景山区","style":2},{"lnglat":[116.310316,39.956074],"name":"海淀区","style":2},{"lnglat":[116.105381,39.937183],"name":"门头沟区","style":2}];
                        // this.gdService.addMassMarks(mock);
                    } else {
                        this.slidesData = this.mapLocations;
                        markList = res.result.locations.map(item => {
                            return item.lnglat;
                        });
                        this.gdService.addSimpleMarkers(markList, markerList => {
                            this.markerList = markerList;
                            this.curMarker = markerList[0];
                            //默认高亮第一个marker
                            this.gdService.highlightMarker(markerList[0]);
                            this.gdService.setFitView();
                        });
                    }
                    // this.initSlideWidth();
                }
            });
        } else {
            this.slidesData = this.mapLocations;
            // this.initSlideWidth();
            for (let item of this.mapLocations) {
                markList.push(item.lnglat);
            }
            this.gdService.addSimpleMarkers(markList, markerList => {
                this.markerList = markerList;
                this.curMarker = markerList[0];
                //默认高亮第一个marker
                this.gdService.highlightMarker(markerList[0]);
                this.gdService.setFitView();
            });
        }
        if (this.type == 'map-locations') {
            this.slides.width = window.screen.width * 0.95;
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goLocationDetail(locationData) {
        this.navCtrl.push('LocationDetailPage', {
            id: locationData._id,
            from: 'map-view'
        });
    }

    slideWillChange(): void {}

    slideDidChange(): void {
        let curMarkerInfo = this.mapLocations[this.slides.getActiveIndex()];
        this.curMarker = this.markerList[this.slides.getActiveIndex()];
        if (curMarkerInfo) {
            // this.gdService.setZoomAndCenter(curMarkerInfo.lnglat)
            // 高亮显示改坐标
            this.gdService.highlightMarker(this.curMarker);
            // this.curMarker.setIcon('http://webapi.amap.com/theme/v1.3/markers/b/mark_r.png');
            // this.curMarker.setIconStyle('red')
        }
        this.preMarker = this.markerList[this.slides.getPreviousIndex()];

        if (this.preMarker) {
            //恢复成默认光标
            this.gdService.unHighlightMarker(this.preMarker);
            //  this.preMarker.setIconStyle('blue')
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
                this.curPathPlanType = data.curPathPlanType;
                this.pathSearchTrigger = data.pathSearchTrigger;
            }
        });
    }

    openPathPannel() {
        this.showPathPanel = !this.showPathPanel;
    }
}
