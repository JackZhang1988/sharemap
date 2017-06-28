import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyValidator } from '../../common/validators';

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
})
export class SignupPage {

  public signStep = 0;
  public submitAttempt: boolean = false;
  public stepOneForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.stepOneForm = formBuilder.group({
      phoneNum: ['', Validators.compose([Validators.required, MyValidator.isPhone])],
      msgCode: [''],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      rePassword: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  sendMsgCode() {
  }

  signup() {
    console.log(this.stepOneForm.controls);
    this.submitAttempt = true;
  }
}
