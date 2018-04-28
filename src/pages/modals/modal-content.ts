import { ViewController } from 'ionic-angular';
import { QiniuService } from '../../services/qiniu';

export class ModalContent {
    constructor(public viewCtrl: ViewController, public qiniuService?: QiniuService) {}
    imgLoading = false;

    dismiss() {
        this.viewCtrl.dismiss();
    }

    public addImage(file, callback) {
        this.qiniuService.addImage(file).subscribe(imgUrl => {
            if (imgUrl) {
                this.imgLoading = false;
                callback(imgUrl);
            }
        });
    }
}
