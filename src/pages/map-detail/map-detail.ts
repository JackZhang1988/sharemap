import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { MapService } from '../../services/api';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
  providers: [MapService,GDMap]
})
export class MapDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private mapService: MapService, private gdService: GDMap) {
  }
  @ViewChild(Slides) slides: Slides;

  public title: string = this.navParams.get("title");
  public mapData: any = this.navParams.data;
  // public markList: any[] = [];
  public mapLocations: any[] = [];

  ionViewDidLoad() {
    this.getMapData()
  }
  ngOnInit(): void {
    this.gdService.initMap();
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
      this.gdService.addMarkers(markList);
    })
  }

}
