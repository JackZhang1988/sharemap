import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService]
})
export class LoginPage {

  public phone: Number;
  public password: string;
  public loginCallback: Function;
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
    if (this.phone && this.password) {
      this.apiService.login({
        phone: this.phone,
        password: this.password
      }).subscribe(res => {
        if (res.status == 0) {
          this.storage.set('userId', res.result.userId);
          this.storage.set('token', res.result.token);
          if (res.result.signStatus == 1) {
            this.navCtrl.push('SignupPage', { signStep: 1 });
          } else {
            let toast = this.toastCtrl.create({
              message: '登录成功',
              duration: 2000,
              position: 'bottom'
            })
            toast.onDidDismiss(() => {
              this.navCtrl.setRoot('home');
              if (this.loginCallback) {
                this.loginCallback();
              } else {
                this.navCtrl.setRoot('home');
              }
            });
            toast.present();
          }
        } else {
          let toast = this.toastCtrl.create({
            message: res.err,
            duration: 2000,
            position: 'bottom'
          })
          toast.present();
        }
      })
    }
  }
}
