import { Component, ViewChild, ElementRef, trigger, state, style, transition, animate } from '@angular/core';
import { IonicPage, ViewController, NavController, PopoverController, NavParams, Slides } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';
// import { PathPlanPopOverComponent } from '../../components/path-plan-pop-over/path-plan-pop-over';

@IonicPage()
@Component({
    templateUrl: 'map-view.html',
    providers: [GDMap],
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
        private gdService: GDMap
    ) {
    }
    @ViewChild(Slides) slides: Slides;
    @ViewChild('pathPannel', { read: ElementRef }) pathPannel: ElementRef;

    public type: string = this.navParams.get('type');
    public title: string = this.navParams.get('title');
    public mapInfo: any = this.navParams.get('mapInfo');
    public mapLocations: any[] = this.navParams.get('mapLocations');
    public markerList: any[] = [];
    private preMarker: any;
    private curMarker: any;
    private curPathPlanType: string;
    private curPosition: any;
    private pathSearchTrigger: boolean = false;
    private showPathPanel: boolean = false;

    //使用动态id，方式生成多个modal时id重复
    private randomMapId: string = 'mapContainer-' + (new Date()).getTime().toString(32);

    ionViewDidLoad() {
        this.gdService.initMap(this.randomMapId);
        this.gdService.initGeolocation({
            panToLocation: false,
            zoomToAccuracy: false,
            buttonOffset: new AMap.Pixel(10, 100)
        }, (result) => {
            this.curPosition = result;
        });
        this.gdService.initPathPlan('pathPannel');

        let markList = [];
        for (let item of this.mapLocations) {
            markList.push(item.lnglat);
        }
        this.gdService.addSimpleMarkers(markList, (markerList) => {
            this.markerList = markerList;
            this.curMarker = markerList[0];
            //默认高亮第一个marker
            this.gdService.highlightMarker(markerList[0]);
        });
    }

    ngAfterViewInit() {
        if (this.type == 'map-locations') {
            this.slides.width = window.screen.width * 0.8;
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    goLocationDetail(locationData) {
        this.navCtrl.push('LocationDetailPage', {
            id: locationData._id
        })
    }

    slideWillChange(): void {
    }

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
            this.gdService.pathSearch(this.curPathPlanType, curPosition, curMarker)
        }
    }

    openPathSelect(ev: UIEvent) {
        let popover = this.popoverCtrl.create('PathPlanPopOverPage', {
            curPosition: this.curPosition,
            curMarker: this.curMarker,
            gdService: this.gdService,
            pathPannel: this.pathPannel,
            pathSearchTrigger: this.pathSearchTrigger,
        });
        popover.present({
            ev: ev
        });
        popover.onDidDismiss(data => {
            if (data) {
                this.curPathPlanType = data.curPathPlanType;
                this.pathSearchTrigger = data.pathSearchTrigger;
            }
        })
    }

    openPathPannel() {
        this.showPathPanel = !this.showPathPanel;
    }
}
