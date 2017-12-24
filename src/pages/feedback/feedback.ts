import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { QiniuService } from '../../services/qiniu';
import { ApiService } from '../../services/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
  providers: [ApiService, QiniuService]
})
export class FeedbackPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public qiniuService: QiniuService,
    public apiService: ApiService,
    public storage: Storage,
    public toastCtrl: ToastController
  ) {
  }

  feedbackImgs: string[] = [];
  isShowImgUploader = true;
  imgLoading: boolean = false;
  feedbackContent: string;
  feedbackList: any[] = [];
  email: string;

  ngOnInit() {
    this.getFeedbacks();
  }
  imgChange(event) {
    this.imgLoading = true;
    let target = event.target || event.srcElement;
    this.qiniuService.addImage(target.files[0]).subscribe(imgUrl => {
      if (imgUrl) {
        this.imgLoading = false;
        this.feedbackImgs.push(imgUrl);
        if (this.feedbackImgs.length >= 4) {
          this.isShowImgUploader = false;
        }
      }
    })
  }
  getFeedbacks(): void {
    this.storage.get('userId').then(userID => {
      this.apiService.getUserFeedbacks(userID).subscribe(res => {
        if (res.status == 0) {
          this.feedbackList = res.result;
        }
      })
    })
  }
  submit() {
    this.storage.get('userId').then(userID => {
      this.apiService.addFeedback({
        userId: userID,
        imgs: this.feedbackImgs,
        content: this.feedbackContent,
        email: this.email
      }).subscribe(res => {
        if (res.status == 0) {
          let toast = this.toastCtrl.create({
            message: '提交成功，感谢您的反馈',
            duration: 1500,
            position: 'bottom'
          })
          toast.onDidDismiss(() => {
            this.navCtrl.pop();
          });
          toast.present();
        } else {
          let toast = this.toastCtrl.create({
            message: '提交失败',
            duration: 1500,
            position: 'bottom'
          })
          toast.present();
        }
      })
    })
  }
}
