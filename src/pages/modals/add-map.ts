import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

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
    // private imgLoading = false;
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

    public imgChange(event) {
        this.imgLoading = true;
        this.addImage(event.srcElement.files[0], (imgUrl) => this.coverImg = imgUrl);
        // this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl => {
        //   if (imgUrl) {
        //     this.imgLoading = false;
        //     this.coverImg = imgUrl;
        //   }
        // })
    }
    public submit() {
        console.log(this.coverImg, this.title, this.description);
        this.storage.get('userId').then(userID => {
            this.apiService.addNewMap({
                creater: userID,
                coverImg: this.coverImg,
                title: this.title,
                description: this.description,
                id: this.mapInfo._id
            }).subscribe(res => {
                console.log(res);
                if (res.status == 0) {
                    let toast = this.toastCtrl.create({
                        message: '保存成功',
                        duration: 2000,
                        position: 'bottom'
                    })
                    toast.onDidDismiss(() => this.viewCtrl.dismiss());
                    toast.present();
                } else {
                    let toast = this.toastCtrl.create({
                        message: '保存失败',
                        duration: 2000,
                        position: 'bottom'
                    })
                    toast.present();
                }
                //   this.viewCtrl.dismiss();
            })
        })

    }
}
