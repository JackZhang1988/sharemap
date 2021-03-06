import { Component, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from "@ionic/storage";
import { AuthServiceProvider } from '../../providers/auth';

/**
 * Generated class for the CommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'comment',
  templateUrl: 'comment.html',
  providers: [ApiService, AuthServiceProvider],
})
export class CommentComponent {

  @ViewChild('commentInput') commentInput: ElementRef;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private authService: AuthServiceProvider,
    public toastCtrl: ToastController,
    private apiService: ApiService,
  ) {
  }
  public commentInputValue: string = '';
  public commentList: any[];
  public commentToUser: any;
  private replyInputValue: string = '';
  private hasLiked: boolean = false;
  public likeList: any[];

  @Input() pageId: string;
  @Input() toUser: any;
  @Input() from: string;  //引用来源，map|location
  @Input() inputPosition: string = 'top';

  ngOnInit() {
    this.getComments();
    this.getLikeInfo();
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
        this.commentToUser = this.toUser._id;
      }
    }
    // this.commentInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }
  getLikeInfo() {
    this.storage.get('userId').then(userID => {
      this.apiService.getLikeInfo(this.pageId, userID).subscribe(res => {
        if (res.status == 0) {
          this.hasLiked = res.result.hasLiked;
          this.likeList = res.result.likeList;
        }
      })
    })
  }

  getComments() {
    this.apiService.getComments(this.pageId).subscribe(res => {
      if (res.status == 0) {
        this.commentList = res.result;
      }
    })
  }
  sendComment() {
    this.authService.checkLogin().then(token => {
      this.storage.get('userId').then(userID => {
        if (userID == this.commentToUser) {
          let toast = this.toastCtrl.create({
            message: '不能给自己留言',
            duration: 2000,
            position: 'bottom'
          })
          toast.present();
          return;
        }
        let postCommentContent = this.commentInputValue.replace(this.replyInputValue, '');
        if (!postCommentContent) {
          let toast = this.toastCtrl.create({
            message: '评论不能为空',
            duration: 2000,
            position: 'bottom'
          })
          toast.present();
          return;
        }
        this.apiService.sendComment({
          userId: userID,
          toUser: this.commentToUser,
          content: postCommentContent,
          pageId: this.pageId,
          pageType: 'map',
        }).subscribe(res => {
          if (res.status == 0) {
            this.commentInputValue = '';
            this.commentList.push(res.result);
            let toast = this.toastCtrl.create({
              message: '添加成功',
              duration: 2000,
              position: 'bottom'
            })
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: '添加失败',
              duration: 2000,
              position: 'bottom'
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
  sendLike(): void {
    this.storage.get('userId').then(userID => {
      if (userID) {
        this.apiService.sendLike({
          targetId: this.pageId,
          targetType: this.from,
          userId: userID,
          hasLiked: this.hasLiked
        }).subscribe(res => {
          if (res.status == 0) {
            this.hasLiked = res.result.hasLiked;
            if (this.hasLiked) {
              this.likeList.push(res.result.like);
            } else {
              this.likeList = this.likeList.filter(item => item.creater._id != userID);
            }
          }
        })
      } else {
        this.navCtrl.push('LoginPage', {
          callback: () => {
            this.navCtrl.push('ProfilePage')
          }
        });
      }

    })
  }
}
