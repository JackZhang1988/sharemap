import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService]
})
export class LoginPage {

  public phone: Number;
  public password: string;
  public msgCode: string;
  public loginCallback: Function;
  public loginType: string = 'password';
  private sendMsgCodeBtnText: string = '发送验证码';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public apiService: ApiService,
    public storage: Storage,
  ) {
    this.loginCallback = navParams.get("callback");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    if (/1[0-9]{10}$/.test(this.phone.toString())) {
      this.apiService.login({
        phone: this.phone,
        password: this.password,
        msgCode: this.msgCode,
        loginType: this.loginType
      }).subscribe(res => {
        if (res.status == 0) {
          this.storage.set('userId', res.result.userId);
          this.storage.set('token', res.result.token);
          if (res.result.signStatus == 1) {
            this.navCtrl.push('SignupPage', { signStep: 1 });
          } else {
            this.showMsg('登录成功', () => {
              if (this.loginCallback) {
                this.loginCallback();
              } else {
                this.navCtrl.setRoot('home');
              }
            });
          }
        } else {
          this.showMsg(res.err);
        }
      })
    } else {
      this.showMsg('请输入正确的手机号');
    }
  }

  showMsg(msg, onDidDismiss?) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    })
    toast.present();
    toast.onDidDismiss(() => {
      onDidDismiss && onDidDismiss();
    });
  }

  sendMsgCode() {
    if (/1[0-9]{10}$/.test(this.phone.toString())) {
      if (this.sendMsgCodeBtnText == '发送验证码') {
        this.apiService.sendMsgCode(this.phone.toString()).subscribe(res => {
          if (res.status == 0) {
            let start = 60;
            let timer = Observable.interval(1000).take(start);
            timer.subscribe(x => {
              this.sendMsgCodeBtnText = (--start) + '秒后重新发送';
            })
            timer.takeLast(1).subscribe(x => {
              this.sendMsgCodeBtnText = '发送验证码';
            });
          }
        });
      }
    } else {
      this.showMsg('请输入正确的手机号');
    }
  }
}
