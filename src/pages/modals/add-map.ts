import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ApiService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';
import { ModalContent } from './modal-content';

@IonicPage()
@Component({
    templateUrl: 'add-map.html',
    providers: [ApiService, QiniuService]
})
export class AddMapModal extends ModalContent {
    constructor(
        public viewCtrl: ViewController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private storage: Storage,
        public navParams: NavParams,
        public qiniuService: QiniuService,
        private apiService: ApiService
    ) {
        super(viewCtrl);
    }

    public coverImg: string;
    public title: string;
    public description: string;
    public mapInfo: any = this.navParams.get('mapInfo');
    private isEdit: boolean = false;
    public mapProperty: string = 'public';

    ionViewDidLoad() {
        if (this.mapInfo) {
            this.isEdit = true;
            this.coverImg = this.mapInfo.coverImg;
            this.title = this.mapInfo.title;
            this.coverImg = this.mapInfo.coverImg;
            this.description = this.mapInfo.description;
            this.mapProperty = this.mapInfo.mapProperty;
        }
    }

    // ionViewWillEnter() {
    //     typeof StatusBar !== 'undefined' && StatusBar.backgroundColorByHexString('#f8f8f8');
    // }
    // ionViewWillLeave() {
    //     typeof StatusBar !== 'undefined' && StatusBar.backgroundColorByHexString('#387ef5');
    // }

    public imgChange(event) {
        this.imgLoading = true;
        let target = event.target || event.srcElement;
        this.addImage(target.files[0], imgUrl => (this.coverImg = imgUrl));
    }
    public submit() {
        console.log(this.coverImg, this.title, this.description);
        let requireField = [
            {
                key: this.coverImg,
                errorMsg: '请添加封面'
            },
            {
                key: this.title,
                errorMsg: '请填写地图集名称'
            },
            {
                key: this.description,
                errorMsg: '请填写地图集描述'
            }
        ];
        let errorMsg = '';
        requireField.every((item, index) => {
            if (!item.key) {
                errorMsg = item.errorMsg;
                return false;
            }
        });
        if (errorMsg) {
            let alert = this.alertCtrl.create({
                title: errorMsg,
                buttons: ['关闭']
            });
            alert.present();
            return;
        }
        this.storage.get('userId').then(userID => {
            this.apiService
                .addNewMap({
                    userId: userID,
                    coverImg: this.coverImg,
                    title: this.title,
                    description: this.description,
                    mapProperty: this.mapProperty,
                    id: this.mapInfo ? this.mapInfo._id : null
                })
                .subscribe(res => {
                    console.log(res);
                    if (res.status == 0) {
                        let toast = this.toastCtrl.create({
                            message: '保存成功',
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.onDidDismiss(() =>
                            this.viewCtrl.dismiss(
                                {
                                    status: 'add-map-done',
                                    data: res.result
                                },
                                'add-map-done',
                                {
                                    animate: false
                                }
                            )
                        );
                        toast.present();
                    } else {
                        let toast = this.toastCtrl.create({
                            message: '保存失败',
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();
                    }
                });
        });
    }

    public showPropertyNotice() {
        let alert = this.alertCtrl.create({
            title: '您可以设置地图的不同属性',
            cssClass: 'notice-alert',
            subTitle:
                '<strong>公开地图</strong>是所有人可见的，可以分享的，也可以被搜索到的地图。<br/>\
                <strong>私密地图</strong>只有自己可见，并且不可以被搜索到，但分享出去的地图集仍然可以被看到。<br/>\
                <strong>协同地图</strong>是所有人可见、可以搜索到的地图，同时允许别人申请一同编辑、添加地点的地图集，当你需要和其他人一同维护一个地图集时，可以使用协同地图',
            buttons: ['知道了']
        });

        alert.present();
    }
}
