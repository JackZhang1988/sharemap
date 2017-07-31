import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ApiService } from '../../services/api';
import { AuthServiceProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ApiService, AuthServiceProvider]
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiService,
    private authService: AuthServiceProvider,
    private storage: Storage
  ) {
  }
  private avatar: string;
  private userInfo: any;

  ngOnInit(): void {
    this.storage.get('userId').then(userId => {
      this.apiService.getUserInfo(userId).subscribe(res => {
        if (res.status == 0) {
          this.userInfo = res.result.userInfo;
          this.avatar = res.result.userInfo.avatar;
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  about() {
    console.log('about');
  }
  logout() {
    this.storage.clear().then(() => {
      this.navCtrl.setRoot('home');
    })
  }
}
