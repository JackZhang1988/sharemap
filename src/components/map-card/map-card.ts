import { Component, Input, SimpleChanges } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { GDMap } from '../../services/gdmap';

@Component({
    selector: 'map-card',
    templateUrl: 'map-card.html',
    providers: [GDMap]
})
export class MapCardComponent {
    @Input() mapStaticImg: string;
    @Input() viewTitle: string;
    @Input() count?: Number;
    @Input() dataSource?: any;
    @Input() viewType: string; //表示map-card展示类型

    private STATIC_MAP_KEY: string;

    constructor(public modalCtrl: ModalController, private gdService: GDMap) {
        this.STATIC_MAP_KEY = this.gdService.getStaticMapKey();
    }
    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }
    init() {
        if (this.dataSource) {
            let size = '400*200';
            let color = '0x387ef5';
            let markerGpsStr = '';
            if (this.viewType == 'location-view') {
                //地点位置视图下 this.location 为单个lnglat 数组
                this.viewTitle = this.viewTitle || '地图视图';
                markerGpsStr = `-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:${this.dataSource[0]},${
                    this.dataSource[1]
                }`;
                // http://restapi.amap.com/v3/staticmap?size=400*200&markers=-1,http://cache.amap.com/lbs/static/cuntom_marker1.png,0:116.326778,40.0033&key=c3b4477c4c2ad477141ee0358e4d1c82
                this.mapStaticImg =
                    'http://restapi.amap.com/v3/staticmap?size=' +
                    size +
                    '&markers=' +
                    markerGpsStr +
                    '&key=' +
                    this.STATIC_MAP_KEY;
            } else if (this.viewType == 'map-locations') {
                //地图坐标下，this.location 为多个lnglat数组
                if (this.dataSource && this.dataSource.length) {
                    let markerList = [];
                    let maxDataLength = 10;
                    let lLength = this.dataSource.length > maxDataLength ? maxDataLength : this.dataSource.length;
                    for (let i = 0; i < lLength && i < 50; i++) {
                        markerList.push(
                            'mid,' +
                                color +
                                ',' +
                                i +
                                ':' +
                                this.dataSource[i].lnglat[0] +
                                ',' +
                                this.dataSource[i].lnglat[1]
                        );
                    }
                    markerGpsStr = markerList.join('|');
                } else {
                    markerGpsStr = '';
                }
                this.mapStaticImg =
                    'http://restapi.amap.com/v3/staticmap?size=' +
                    size +
                    '&markers=' +
                    markerGpsStr +
                    '&key=' +
                    this.STATIC_MAP_KEY;
            }
        }
    }
    changeView() {
        let mapModalData;
        if (this.viewType == 'location-view') {
            mapModalData = [
                {
                    lnglat: this.dataSource
                }
            ];
        } else {
            mapModalData = this.dataSource;
        }
        let mapViewModal = this.modalCtrl.create('MapViewModal', {
            type: this.viewType,
            title: this.viewTitle,
            count: this.count,
            mapLocations: mapModalData
        });
        mapViewModal.present();
    }
}