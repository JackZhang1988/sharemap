import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
import cityListData from './cityList';

@IonicPage()
@Component({
    selector: 'page-city-list',
    templateUrl: 'city-list.html'
})
export class CityListPage {
    constructor(
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        public alertCtrl: AlertController
    ) {}
    private curCityListData: any = cityListData.cityList;
    private hotCityListData = cityListData.hotCityList;
    private keyword: string;
    private isShowQuickSection: boolean = true;
    private historyCityList: any = [];

    ionViewDidLoad() {
        // console.log('cityListData', cityListData);
        this.storage.get('cityHistory').then(value => {
            console.log('cityHistory', value);
            if (value) {
                this.historyCityList = value;
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    clearCityHistory() {
        let confirm = this.alertCtrl.create({
            title: '清空历史记录?',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '清空',
                    handler: () => {
                        this.storage.remove('cityHistory');
                        this.historyCityList = [];
                    }
                }
            ]
        });
        confirm.present();
    }

    selectCity(cityData) {
        console.log(cityData);
        if (!this.historyCityList.includes(cityData)) {
            this.historyCityList.push(cityData);
            this.storage.set('cityHistory', this.historyCityList);
        }
    }

    searchCity() {
        if (this.keyword) {
            let searchResult = [];
            for (let i = 0; i < cityListData.cityList.length; i++) {
                let result = [],
                    item = cityListData.cityList[i];
                for (let j = 0; j < item.cityList.length; j++) {
                    let cityItem = item.cityList[j];
                    if (cityItem.cityName.startsWith(this.keyword)) {
                        result.push(cityItem);
                    } else if (cityItem.pinyin.startsWith(this.keyword)) {
                        result.push(cityItem);
                    } else if (cityItem.firstLetter.startsWith(this.keyword)) {
                        result.push(cityItem);
                    }
                }
                if (result.length) {
                    searchResult.push({
                        section: item.section,
                        cityList: result
                    });
                }
            }
            this.curCityListData = searchResult;
            this.isShowQuickSection = false;
        } else {
            this.isShowQuickSection = true;
            this.curCityListData = cityListData.cityList;
        }
    }
}
