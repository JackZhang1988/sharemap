import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ApiService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';
import { ModalContent } from './modal-content';

@IonicPage()
@Component({
    templateUrl: 'add-map.html',
    providers: [ApiService, QiniuService, Camera]
})
export class AddMapModal extends ModalContent {
    constructor(
        public viewCtrl: ViewController,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController,
        private storage: Storage,
        public navParams: NavParams,
        public qiniuService: QiniuService,
        private apiService: ApiService,
        private camera: Camera
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

    public imgChange(event) {
        this.imgLoading = true;
        let target = event.target || event.srcElement;
        this.addImage(target.files[0], imgUrl => (this.coverImg = imgUrl));
    }

    getPicture(): void {
        console.log('start from carama');
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        // this.camera.getPicture(options).then(
        //     imageData => {
        //         // imageData is either a base64 encoded string or a file URI
        //         // If it's base64:
        //         let base64Image = 'data:image/jpeg;base64,' + imageData;
        //         this.coverImg = base64Image;
        //     },
        //     err => {
        //         // Handle error
        //         console.log(err);
        //     }
        // );
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'CAMERA',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.camera.getPicture(options).then(
                            imageData => {
                                // imageData is either a base64 encoded string or a file URI
                                // If it's base64:
                                let base64Image = 'data:image/jpeg;base64,' + imageData;
                                this.coverImg = base64Image;
                            },
                            err => {
                                // Handle error
                                console.log(err);
                            }
                        );
                    }
                },
                {
                    text: 'SAVEDPHOTOALBUM',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
                        this.camera.getPicture(options).then(
                            imageData => {
                                // imageData is either a base64 encoded string or a file URI
                                // If it's base64:
                                let base64Image = 'data:image/jpeg;base64,' + imageData;
                                this.coverImg = base64Image;
                            },
                            err => {
                                // Handle error
                                console.log(err);
                            }
                        );
                    }
                },
                {
                    text: 'PHOTOLIBRARY',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.camera.getPicture(options).then(
                            imageData => {
                                // imageData is either a base64 encoded string or a file URI
                                // If it's base64:
                                let base64Image = 'data:image/jpeg;base64,' + imageData;
                                this.coverImg = base64Image;
                            },
                            err => {
                                // Handle error
                                console.log(err);
                            }
                        );
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
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
                            this.viewCtrl.dismiss({
                                status: 'add-map-done',
                                data: res.result
                            })
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
