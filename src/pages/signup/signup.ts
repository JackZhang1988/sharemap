import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyValidator } from '../../common/validators';
import { ApiService } from '../../services/api';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [ApiService]
})
export class SignupPage {

  public signStep = 0;
  public submitAttempt: boolean = false;
  public stepOneForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    public toastCtrl: ToastController,
    public storage: Storage,
  ) {
    this.stepOneForm = formBuilder.group({
      phoneNum: ['', Validators.compose([Validators.required, MyValidator.isPhone])],
      msgCode: [''],
      passwords: formBuilder.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        passwordConfirm: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
      }, { validator: MyValidator.passwordMatchValidator })
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  sendMsgCode() {
  }

  signup() {
    this.submitAttempt = true;
    if (this.stepOneForm.valid) {
      console.log(this.stepOneForm.controls);
      let param = {
        phone: this.stepOneForm.controls.phoneNum.value,
        msgCode: this.stepOneForm.controls.msgCode.value,
        password: this.stepOneForm.controls.passwords.value.password
      }
      this.apiService.signup(param).subscribe(res => {
        if (res.status == 0) {
          this.storage.set('userId', res.result.userId);
          this.storage.set('token', res.result.token);
        }
      })
    }
  }
}
