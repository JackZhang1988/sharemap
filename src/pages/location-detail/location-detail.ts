import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from "@ionic/storage";
import { AuthServiceProvider } from '../../providers/auth/auth';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage({
  segment: '/location-detail/:id',
})
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
  providers: [ApiService, AuthServiceProvider],
})
export class LocationDetailPage {
  @ViewChild('commentInput') commentInput: ElementRef;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private storage: Storage,
    private authService: AuthServiceProvider,
    private apiService: ApiService,
    private keyboard: Keyboard
  ) {
  }

  public locationInfo?: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];
  public commentInputValue: string;
  public commentList: any[];

  ionViewDidLoad() {
    console.log(this.navParams);
    this.getLocationData();
    this.getComments();
  }
  getLocationData() {
    this.apiService.getLocationById(this.locationParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.locationInfo = res.result;
        this.lnglat = res.result.lnglat;
      }
    })
  }

  getComments() {
    this.apiService.getComments(this.locationParams.id).subscribe(res => {
      if (res.status == 0) {
        console.log(res);
        this.commentList = res.result;
      }
    })
  }

  resize() {
    var element = this.commentInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.commentInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  sendComment() {
    this.authService.checkLogin().then(token => {
      this.storage.get('userId').then(userID => {
        if (userID == this.locationInfo.creater) {
          let toast = this.toastCtrl.create({
            message: '不能给自己留言',
            duration: 2000,
            position: 'middle'
          })
          toast.present();
          return;
        }
        this.apiService.sendComment({
          fromUser: userID,
          toUser: this.locationInfo.creater,
          content: this.commentInputValue,
          pageId: this.locationParams.id,
          pageType: 'location',
        }).subscribe(res => {
          if (res.status == 0) {
            this.commentInputValue = '';
            this.commentList.push(res.result);
            let toast = this.toastCtrl.create({
              message: '添加成功',
              duration: 2000,
              position: 'middle'
            })
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: '添加失败',
              duration: 2000,
              position: 'middle'
            })
            toast.present();
          }
        })

      })
    }, () => {
      this.navCtrl.push('LoginPage', {
        callback: () => {
          this.navCtrl.push('ProfilePage')
        }
      });
    })

  }
  replyComment(toUser){
    console.log(toUser);
  }
}
