import { Component, ViewChild } from '@angular/core';
import {
    IonicPage,
    NavController,
    ModalController,
    NavParams,
    Slides,
    AlertController,
    ToastController
} from 'ionic-angular';
import { ApiService } from '../../services/api';
import { ShareProvider } from '../../providers/share';
import { Storage } from '@ionic/storage';
import { AuthServiceProvider } from '../../providers/auth';

@IonicPage({
    segment: '/map-detail/:id',
    defaultHistory: ['home']
})
@Component({
    selector: 'page-map-detail',
    templateUrl: 'map-detail.html',
    providers: [ApiService, ShareProvider, AuthServiceProvider]
})
export class MapDetailPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private storage: Storage,
        private apiService: ApiService,
        private shareProvider: ShareProvider,
        private alertCtrl: AlertController,
        private authService: AuthServiceProvider,
        private toastCtrl: ToastController
    ) {}
    @ViewChild(Slides) slides: Slides;

    public mapInfo: any = {};
    public mapParams: any = this.navParams.data;
    public mapLocations: any[] = [];
    public viewTitle: string;
    private mapCommentCount: Number;
    private locationCount: Number;
    private likeCount = 0;
    public hasLiked = false;
    private isOwner = false;
    private loading = true;
    private loadingLocations = false;
    private hasMoreLocations = true;
    private locationPageSize = 20;

    public isLogin = false;

    // 控制地图操作权限
    public actionProperty: any;

    ionViewDidLoad() {
        this.getMapData();
        this.getMapCommentCount();
        this.getMapLikeInfo();
        this.authService.checkLogin().then(()=>{
            this.isLogin = false;
        }, ()=>{
            this.isLogin = true;
        })
    }

    initShare() {
        this.shareProvider.showSharePanel();
    }

    getMapData(): void {
        // console.log(this.mapParams);
        this.apiService.getMapById(this.mapParams.id).subscribe(res => {

            this.loading = false;
            if (res.status == 0) {
                this.mapInfo = res.result.map;
                this.mapLocations = res.result.locations;
                this.locationCount = res.result.count;
                if (res.result.locations.length < this.locationPageSize) {
                    this.hasMoreLocations = false;
                }
                this.viewTitle = this.mapInfo.title;
                this.storage.get('userId').then(userID => {
                    this.isOwner = userID == res.result.map.creater._id;
                    if (res.result.map.mapProperty == 'cooperate' && !this.isOwner) {
                        // 协作地图并且非作者，可以添加地点，无法删除、编辑地图集
                        this.actionProperty = {
                            showAddBtn: true,
                            showDelBtn: false,
                            showEditBtn: false
                        };
                    } else if (this.isOwner) {
                        // 地图集作者拥有所有权限
                        this.actionProperty = {
                            showAddBtn: true,
                            showDelBtn: true,
                            showEditBtn: true
                        };
                    } else {
                        this.actionProperty = {
                            showAddBtn: false,
                            showEditBtn: false,
                            showDelBtn: false
                        };
                    }
                });
                this.shareProvider.initShareContent({
                    title: '来看看我分享的地图集【' + this.mapInfo.title + '】',
                    shareDesc: this.mapInfo.description,
                    shareImg: this.mapInfo.coverImg + '?imageView2/0/w/200/h/200/q/75',
                    shareUrl: 'map.html?mapId=' + this.mapInfo._id
                });
            } else if (res.status == 2) {
                // 私密地图集
                let toast = this.toastCtrl.create({
                    message: '您无权查看此地图集',
                    duration: 1000,
                    position: 'center'
                });
                toast.onDidDismiss(() => {
                    this.navCtrl.pop();
                });
                toast.present();
            }
        });
    }

    getMapCommentCount() {
        this.apiService.getMapCommentCount(this.mapParams.id).subscribe(res => {
            if (res.status == 0) {
                this.mapCommentCount = res.result;
            }
        });
    }

    getMapLikeInfo() {
        this.storage.get('userId').then(userID => {
            this.apiService.getLikeInfo(this.mapParams.id, userID).subscribe(res => {
                if (res.status == 0) {
                    this.likeCount = res.result.count;
                    this.hasLiked = res.result.hasLiked;
                }
            });
        });
    }

    goLocationDetail(locationData) {
        this.navCtrl.push('LocationDetailPage', {
            id: locationData._id
        });
    }

    goMapComments(): void {
        this.navCtrl.push('MapCommentsPage', {
            mapId: this.mapParams.id,
            creater: this.mapInfo.creater
        });
    }

    loadMoreLocations(): void {
        let lastItemId = this.mapLocations[this.mapLocations.length - 1]._id;
        let mapId = this.mapInfo._id;
        this.loadingLocations = true;
        this.apiService
            .getMapLocations({
                lastItemId: lastItemId,
                mapId: mapId,
                pageSize: this.locationPageSize
            })
            .subscribe(res => {
                if (res.status == 0) {
                    this.loadingLocations = false;
                    this.mapLocations = this.mapLocations.concat(res.result.locations);

                    if (res.result.locations.length < this.locationPageSize) {
                        this.hasMoreLocations = false;
                    }
                }
            });
    }

    editMap(): void {
        let addMapModal = this.modalCtrl.create('AddMapModal', {
            mapInfo: this.mapInfo
        });
        addMapModal.present();
    }

    delMap(): void {
        let confirm = this.alertCtrl.create({
            title: '确定要删除此地图集吗?',
            message: '删除后不可恢复',
            buttons: [
                {
                    text: '取消',
                    handler: () => {}
                },
                {
                    text: '确定',
                    handler: () => {
                        this.storage.get('userId').then(userID => {
                            this.apiService
                                .delMap({
                                    id: this.mapParams.id,
                                    userId: userID
                                })
                                .subscribe(res => {
                                    if (res.status == 0) {
                                        let toast = this.toastCtrl.create({
                                            message: '删除成功',
                                            duration: 1500,
                                            position: 'bottom'
                                        });
                                        toast.onDidDismiss(() => {
                                            this.navCtrl.pop();
                                        });
                                        toast.present();
                                    }
                                });
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    addLocation(): void {
        let addLocationModal = this.modalCtrl.create('SearchLocModal', {
            mapInfo: this.mapInfo
        });
        addLocationModal.present();
    }

    sendLike(): void {
        this.storage.get('userId').then(userID => {
            if (userID) {
                this.apiService
                    .sendLike({
                        targetId: this.mapParams.id,
                        targetType: 'map',
                        userId: userID,
                        hasLiked: this.hasLiked
                    })
                    .subscribe(res => {
                        if (res.status == 0) {
                            this.hasLiked = res.result.hasLiked;
                            if (res.result.hasLiked) {
                                this.likeCount++;
                            } else {
                                this.likeCount--;
                            }
                        }
                    });
            } else {
                this.navCtrl.push('LoginPage', {
                    callback: () => {
                        this.navCtrl.push('ProfilePage');
                    }
                });
            }
        });
    }
}
