import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController, NavParams } from 'ionic-angular';
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

    ionViewDidLoad() {
        if (this.mapInfo) {
            this.isEdit = true;
            this.coverImg = this.mapInfo.coverImg;
            this.title = this.mapInfo.title;
            this.coverImg = this.mapInfo.coverImg;
            this.description = this.mapInfo.description;
        }
    }

    ionViewWillEnter() {
        typeof StatusBar !== 'undefined' && StatusBar.backgroundColorByHexString('#f8f8f8');
    }
    ionViewWillLeave() {
        typeof StatusBar !== 'undefined' && StatusBar.backgroundColorByHexString('#387ef5');
    }

    public imgChange(event) {
        this.imgLoading = true;
        let target = event.target || event.srcElement;
        this.addImage(target.files[0], imgUrl => (this.coverImg = imgUrl));
    }
    public submit() {
        console.log(this.coverImg, this.title, this.description);
        this.storage.get('userId').then(userID => {
            this.apiService
                .addNewMap({
                    userId: userID,
                    coverImg: this.coverImg,
                    title: this.title,
                    description: this.description,
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
}
