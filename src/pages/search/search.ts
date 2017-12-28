import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';

@IonicPage({
  defaultHistory: ['home']
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [ApiService],
})
export class SearchPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
  ) {
  }
  searchType = 'map';
  curType: string = 'map';
  searchWords: string;
  searchResult: any[] = [];

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  search() {
    this.curType = this.searchType;
    this.apiService.search({
      searchType: this.searchType,
      searchWords: this.searchWords
    }).subscribe(res => {
      if (res.status == 0) {
        this.searchResult = res.result;
      }
    })
  }

  goMapDetail(mapData) {
    this.navCtrl.push('MapDetailPage', {
      id: mapData._id
    })
  }
}
