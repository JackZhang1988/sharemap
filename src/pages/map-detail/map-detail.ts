import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MapService } from '../../services/api';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
  providers: [MapService, GDMap]
})
export class MapDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private mapService: MapService, private gdService: GDMap) {
  }
  @ViewChild(Slides) slides: Slides;

  public title: string = this.navParams.get("title");
  public mapData: any = this.navParams.data;
  public markerList: any[] = [];
  public mapLocations: any[] = [];
  private preMarker: any;
  private curMarker: any;

  ionViewDidLoad() {
    this.getMapData()
  }
  ngOnInit(): void {
    this.gdService.initMap();
  }
  ngAfterViewInit() {
    this.slides.width = window.screen.width * 0.8;
  }
  getMapData(): void {
    console.log(this.mapData)
    this.mapService.getMapById(this.mapData._id).subscribe(res => {
      console.log(res.result);
      this.mapLocations = res.result;
      let markList = [];
      for (let item of res.result) {
        markList.push(item.lnglat);
      }
      this.gdService.addSimpleMarkers(markList, (markerList) => {
        this.markerList = markerList;
        //默认高亮第一个marker
        this.gdService.highlightMarker(markerList[0]);
      });
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
