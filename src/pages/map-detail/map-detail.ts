import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Slides } from 'ionic-angular';
import { ApiService } from '../../services/api';

@IonicPage({
  segment: '/map-detail/:id',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-map-detail',
  templateUrl: 'map-detail.html',
  providers: [ApiService]
})
export class MapDetailPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private apiService: ApiService,
  ) {
  }
  @ViewChild(Slides) slides: Slides;

  public mapInfo: any = {};
  public mapData: any = this.navParams.data;
  public mapLocations: any[] = [];
  public curView: string = 'list';

  ionViewDidLoad() {
    this.getMapData()
  }

  getMapData(): void {
    console.log(this.mapData)
    this.apiService.getMapById(this.mapData.id).subscribe(res => {
      console.log(res.result);
      if (res.status == 0) {
        this.mapInfo = res.result.map;
        this.mapLocations = res.result.locations;
      }
    })
  }
  changeView(): void {
    // if(this.curView == 'list'){
    //   this.curView = 'map';
    // }else{
    //   this.curView = 'list';
    // }
    let mapViewModal = this.modalCtrl.create('MapViewModal', {
      mapData: this.mapData,
      mapInfo: this.mapInfo,
      mapLocations: this.mapLocations
    });
    mapViewModal.present();
  }
}
