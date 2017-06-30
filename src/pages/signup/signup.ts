import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import 'web-animations-js/web-animations.min';
import { MyValidator } from '../../common/validators';
import { ApiService } from '../../services/api';
import { QiniuService } from '../../services/qiniu';
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
  providers: [ApiService, QiniuService],
  animations: [
    trigger('enterTrigger', [
      state('swipRight', style({
        opacity: '1',
        transform: 'none'
      })),
      transition('void => *', [style({
        opacity: '0',
        transform: 'translate3d(100%, 0, 0)'
      }), animate('300ms')])
    ])
  ]
})
export class SignupPage {

  private signStep = 0;
  private submitAttempt: boolean = false;
  private stepTwoAttempt: boolean = false;
  public stepOneForm: FormGroup;
  public stepTwoForm: FormGroup;
  private imgLoading: boolean = false;
  private avatar: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private apiService: ApiService,
    private qiniuService: QiniuService,
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
    this.stepTwoForm = formBuilder.group({
      userName: ['', Validators.required],
      sex: ['', Validators.required],
      signature: ['']
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  sendMsgCode() {
  }

  signup() {
    this.submitAttempt = true;
    this.signStep = 1; //进入下一步
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

  imgChange(event) {
    if (!event.srcElement.files[0]) return;
    this.imgLoading = true;
    this.qiniuService.addImage(event.srcElement.files[0]).subscribe(imgUrl => {
      if (imgUrl) {
        this.imgLoading = false;
        this.avatar = imgUrl;
      }
    })
  }

  updateUser() {
    this.stepTwoAttempt = true;
    if(this.stepTwoForm.valid){

    }
  }
}
