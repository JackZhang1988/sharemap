import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';

@IonicPage({
    defaultHistory: ['home']
})
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
    providers: [ApiService]
})
export class SearchPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: ApiService) {}
    searchType = 'map';
    curType: string = 'map';
    searchWords: string;
    searchResult: any[] = [];
    loading: boolean = false;
    showEmpty: boolean = false;

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    ionViewWillEnter() {
        StatusBar && StatusBar.backgroundColorByHexString('#387ef5');
    }

    search() {
        this.curType = this.searchType;
        this.loading = true;
        this.apiService
            .search({
                searchType: this.searchType,
                searchWords: this.searchWords
            })
            .subscribe(res => {
                if (res.status == 0) {
                    this.loading = false;
                    this.searchResult = res.result;
                    if (this.searchResult.length) {
                        this.showEmpty = false;
                    } else {
                        this.showEmpty = true;
                    }
                }
            });
    }

    goMapDetail(mapData) {
        this.navCtrl.push('MapDetailPage', {
            id: mapData._id
        });
    }
}
