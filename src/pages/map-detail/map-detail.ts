import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapService } from '../../services/api';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
  providers: [MapService]
})
export class MapDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private mapService: MapService) {
  }
  public title:string = this.navParams.get("title");
  public mapData:any = this.navParams.data;
  public markList:any[] = [];
  public gdService: any;

  ionViewDidLoad() {
    this.getMapData()
  }
  ngOnInit(): void {
    this.gdService = new GDMap();
  }
  getMapData():void{
    console.log(this.mapData)
    this.mapService.getMapById(this.mapData._id).subscribe(res =>{
      console.log(res.result);
      for(let item of res.result){
        this.markList.push(item.lnglat);
      }
      this.gdService.addMarkers(this.markList);
    })
  }

}
