import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, Slides } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
    templateUrl: 'map-view.html',
    providers: [GDMap]
})
export class MapViewModal {

    constructor(
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private gdService: GDMap
    ) {
    }
    @ViewChild(Slides) slides: Slides;

    public type: string = this.navParams.get('type');
    public title: string = this.navParams.get('title');
    public mapInfo: any = this.navParams.get('mapInfo');
    public mapLocations: any[] = this.navParams.get('mapLocations');
    public markerList: any[] = [];
    private preMarker: any;
    private curMarker: any;

    ionViewDidLoad() {
        let markList = [];
        for (let item of this.mapLocations) {
            markList.push(item.lnglat);
        }
        this.gdService.addSimpleMarkers(markList, (markerList) => {
            this.markerList = markerList;
            //默认高亮第一个marker
            this.gdService.highlightMarker(markerList[0]);
        });
    }
    ngOnInit(): void {
        this.gdService.initMap();
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
    }
}
