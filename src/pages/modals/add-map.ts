import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController } from 'ionic-angular';

import { MapService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';
import { ModalContent } from './modal-content';

@IonicPage()
@Component({
    templateUrl: 'add-map.html',
    providers: [MapService, QiniuService]
})
export class AddMapModal extends ModalContent {
    constructor(
        public viewCtrl: ViewController,
        public toastCtrl: ToastController,
        public qiniuService: QiniuService,
        private mapService: MapService
    ) {
        super(viewCtrl);
    }
    // private imgLoading = false;
    public coverImg: string;
    public title: string;
    public description: string;

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
        this.mapService.addNewMap({
            coverImg: this.coverImg,
            title: this.title,
            description: this.description
        }).subscribe(res => {
            console.log(res);
            if (res.status == 0) {
                let toast = this.toastCtrl.create({
                    message: '添加成功',
                    duration: 2000,
                    position: 'middle'
                })
                toast.onDidDismiss(() => this.viewCtrl.dismiss());
                toast.present();
            } else {
                let toast = this.toastCtrl.create({
                    message: '添加失败',
                    duration: 2000,
                    position: 'middle'
                })
                toast.present();
            }
            //   this.viewCtrl.dismiss();
        })

    }
}
