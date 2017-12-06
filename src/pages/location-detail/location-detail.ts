import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from "@ionic/storage";
import { AuthServiceProvider } from '../../providers/auth/auth';
// import { Keyboard } from '@ionic-native/keyboard';

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
    // private keyboard: Keyboard
  ) {
  }

  public locationInfo?: any = {};
  public locationParams: any = this.navParams.data;
  public mapStaticImg: string;
  public lnglat: Number[];
  public commentInputValue: string = '';
  public commentList: any[];
  public commentToUser: any;
  private replyInputValue: string = '';

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
        this.commentToUser = this.locationInfo.creater;
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

  resize($event) {
    var element = this.commentInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    element.style.height = '1px';
    element.style.height = element.scrollHeight + 'px';
    if ($event.key == 'Backspace' || $event.key == 'Delete') {
      //如果回复输入框只剩回复字符串，则点击删除时回复置为默认状态
      if (this.commentInputValue == this.replyInputValue) {
        this.commentInputValue = '';
        this.replyInputValue = '';
        this.commentToUser = this.locationInfo.creater;
      }
    }
    // this.commentInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  sendComment() {
    this.authService.checkLogin().then(token => {
      this.storage.get('userId').then(userID => {
        if (userID == this.commentToUser) {
          let toast = this.toastCtrl.create({
            message: '不能给自己留言',
            duration: 2000,
            position: 'middle'
          })
          toast.present();
          return;
        }
        let postCommentContent = this.commentInputValue.replace(this.replyInputValue, '');
        if (!postCommentContent) {
          let toast = this.toastCtrl.create({
            message: '评论不能为空',
            duration: 2000,
            position: 'middle'
          })
          toast.present();
          return;
        }
        this.apiService.sendComment({
          fromUser: userID,
          toUser: this.commentToUser,
          content: postCommentContent,
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
  replyComment(input, toUser) {
    console.log(toUser);
    this.commentToUser = toUser._id;
    input.setFocus();
    this.commentInputValue = '回复 ' + toUser.name + '：'
    this.replyInputValue = this.commentInputValue;
    // this.keyboard.show();
  }
  // commentInputBlur() {
  //   if (this.commentToUser != this.locationInfo.creater) {
  //     this.commentInputValue = '';
  //     this.replyInputValue = '';
  //     this.commentToUser = this.locationInfo.creater;
  //   }
  // }
}
