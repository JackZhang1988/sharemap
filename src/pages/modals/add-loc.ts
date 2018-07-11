import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, AlertController, ViewController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ApiService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';

import { Map } from '../../common/models';
import { ModalContent } from './modal-content';
import { GDMap } from '../../services/gdmap';

@IonicPage()
@Component({
    templateUrl: 'add-loc.html',
    providers: [ApiService, QiniuService, GDMap]
})
export class AddLocModal extends ModalContent {
    constructor(
        private storage: Storage,
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public qiniuService: QiniuService,
        private apiService: ApiService,
        public zone: NgZone,
        private gdService: GDMap
    ) {
        super(viewCtrl);
    }
    curLocation: any = this.navParams.data ? this.navParams.data.curSelectPlace : {};
    pageType = 'status';
    maps: Map[] = [];
    curSelectedMapId: string;
    locationImgs: string[] = [];
    description: string;
    locationText: string = '正在获取位置信息...';
    orignalLocationResult: any;
    // isShowImgUploader = true;
    showHeader = true;
    locationCategory: any = {
        title: '默认',
        iconClass: 'fas fa-circle',
        iconColor: '#ff5d00'
    };

    private mapInfo: any = this.navParams.get('mapInfo');
    private locationInfo: any = this.navParams.get('locationInfo');

    ngOnInit(): void {
        this.getMaps();
        if (this.locationInfo) {
            //编辑地点
            this.locationImgs = this.locationInfo.imgs;
            this.description = this.locationInfo.description;
            this.curLocation = this.locationInfo.locationInfo;
            this.locationText = this.locationInfo.name;
        } else {
            this.initLocation();
        }
    }

    initLocation(): void {
        this.gdService.initMap();
        this.gdService.initLocate({
            success: result => {
                this.zone.run(() => {
                    if (result) {
                        this.orignalLocationResult = result;
                        this.curLocation = this.gdService.formateLocationInfo(result);
                        this.locationText = this.curLocation.name;
                    } else {
                        // this.loading = true;
                        this.locationText = '定位失败，请检查您的网络';
                    }
                });
            },
            error: () => {
                this.zone.run(() => {
                    // this.loading = true;
                    this.locationText = '定位失败，请检查您的网络';
                });
            }
        });
    }



    goSearchLoc(): void {
        let curModal = this.modalCtrl.create('SearchLocModal', {
            locationInfo: this.orignalLocationResult
        });
        curModal.onDidDismiss(data => {
            console.log(data);
            if (data) {
                this.locationText = data.curSelectPlace.name;
                this.curLocation = data.curSelectPlace;
            }
        });
        curModal.present();
    }

    goConfigCategory(): void {
        let self = this;
        let __createModal = function (data) {
            let curModal = self.modalCtrl.create('LocationCategoryPage', data);
            curModal.onDidDismiss(result => {
                if (result) {
                    if (result.type == 'category-select') {
                        self.locationCategory = result.data;
                    }
                }
            });
            curModal.present();
        }
        if (this.mapInfo && this.mapInfo.mapProperty == 'cooperate') {
            //协同地图使用创建者的category
            __createModal({
                userId: this.mapInfo.creater._id,
                mapId: this.mapInfo._id
            });
        } else {
            this.storage.get('userId').then(userID => {
                __createModal({
                    userId: userID
                });
            })
        }
    }

    getMaps(): void {
        this.storage.get('userId').then(userID => {
            this.apiService.getUserMaps(userID).subscribe(res => {
                if (res.status == 0) {
                    this.maps = res.result;
                    if (this.maps.length == 1) {
                        this.curSelectedMapId = this.maps[0]._id;
                    }
                    if (this.mapInfo) {
                        this.maps = [this.mapInfo];
                        // if (this.mapInfo.creater !== userID) {
                        //     // 协同地图
                        //     this.maps.push(this.mapInfo);
                        // }
                        //在地图集中添加地点
                        this.curSelectedMapId = this.mapInfo._id;
                    }
                }
            });
        });
    }
    imgChange(event) {
        let target = event.target || event.srcElement;
        if (event.srcElement.files.length <= 9 && this.locationImgs.length + event.srcElement.files.length <= 9) {
            this.imgLoading = true;
            for (let i = 0; i < event.srcElement.files.length; i++) {
                let file = event.srcElement.files[i];
                this.addImage(file, imgUrl => {
                    this.locationImgs.push(imgUrl);
                    // if (this.locationImgs.length >= 9) {
                    //     this.isShowImgUploader = false;
                    // }
                });
            }
        } else {
            let toast = this.toastCtrl.create({
                message: '最多上传9张图片',
                duration: 1000,
                position: 'bottom'
            });
            toast.present();
        }
        target.value = '';
    }
    removeImg(index: number) {
        console.log(index);
        this.locationImgs.splice(index, 1);
    }

    submit() {
        let requireField = [
            {
                key: this.curLocation.name,
                errorMsg: '缺少地理位置信息，请返回重新添加'
            },
            {
                key: this.curSelectedMapId,
                errorMsg: '请选择要添加的地图集'
            }
            // {
            //     key: this.description,
            //     errorMsg: '请填写位置描述'
            // }
        ];
        let errorMsg = '';
        requireField.every((item, index) => {
            if (!item.key) {
                errorMsg = item.errorMsg;
                return false;
            } else {
                return true;
            }
        });
        if (errorMsg) {
            let alert = this.alertCtrl.create({
                title: errorMsg,
                buttons: ['关闭']
            });
            alert.present();
        } else {
            this.storage.get('userId').then(userID => {
                if (this.locationInfo) {
                    // 编辑地点
                    // userId需要传编辑的地图对应的创建者id，以便判断是否有权限
                    this.apiService
                        .updateLocation({
                            userId: userID,
                            id: this.locationInfo._id,
                            imgs: this.locationImgs,
                            locationCategoryId: this.locationCategory._id,
                            description: this.description
                        })
                        .subscribe(res => {
                            console.log(res);
                            if (res.status == 0) {
                                let toast = this.toastCtrl.create({
                                    message: '更新成功',
                                    duration: 1500,
                                    position: 'bottom'
                                });
                                toast.onDidDismiss(() => {
                                    this.navCtrl.pop();
                                });
                                toast.present();
                            } else {
                                let toast = this.toastCtrl.create({
                                    message: '更新失败',
                                    duration: 1500,
                                    position: 'bottom'
                                });
                                toast.present();
                            }
                        });
                    return;
                }
                let lnglat = this.curLocation.location
                    ? [this.curLocation.location.lng, this.curLocation.location.lat]
                    : null;
                // delete this.curLocation.location;
                this.apiService
                    .addNewLocation({
                        userId: userID,
                        locationInfo: this.curLocation,
                        lnglat: lnglat,
                        mapId: this.curSelectedMapId,
                        locationCategoryId: this.locationCategory._id,
                        imgs: this.locationImgs,
                        description: this.description
                    })
                    .subscribe(res => {
                        console.log(res);
                        if (res.status == 0) {
                            let toast = this.toastCtrl.create({
                                message: '添加成功',
                                duration: 2000,
                                position: 'bottom'
                            });
                            toast.onDidDismiss(() => {
                                // this.navCtrl.push('LocationDetailPage', {
                                //     id: res.result._id
                                // });
                                this.viewCtrl.dismiss(
                                    {
                                        status: 'add-location-done',
                                        data: res.result
                                    },
                                    'add-location-done',
                                    {
                                        animate: false
                                    }
                                );
                            });
                            toast.present();
                        } else {
                            let toast = this.toastCtrl.create({
                                message: '添加失败',
                                duration: 2000,
                                position: 'bottom'
                            });
                            toast.present();
                        }
                    });
            });
        }
    }
}
