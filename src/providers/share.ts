import { Injectable } from "@angular/core";
import { ActionSheetController, ToastController } from "ionic-angular";
import { ENV } from "@app/env";
@Injectable()
export class ShareProvider {
  public shareImg: string;
  public title: string;
  public shareDesc: string;
  public shareUrl: string;
  public thumb: string;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {}

  initShareContent(shareContent: any = {}) {
    this.shareImg = shareContent.shareImg;
    this.title = shareContent.title;
    this.shareDesc = shareContent.shareDesc;
    this.shareUrl = ENV.SHARE_BASE_URL + shareContent.shareUrl;
    this.thumb = shareContent.thumb;
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: "msg",
      duration: 1500,
      position: "bottom"
    });
    toast.present();
  }

  showSharePanel() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "分享到微信好友",
          handler: () => {
            Wechat.isInstalled(
              function(installed) {
                if (!installed) {
                  this.showToast("你没有安装微信");
                  return;
                }
              },
              function(reason) {
                this.showToast("Failed: " + reason);
                return;
              }
            );
            Wechat.share(
              {
                message: {
                  title: this.title,
                  description: this.shareDesc,
                  thumb: this.shareImg,
                  media: {
                    type: Wechat.Type.LINK,
                    webpageUrl: this.shareUrl
                  }
                },
                scene: Wechat.Scene.SESSION // share to SESSION
              },
              function() {
                this.showToast("分享成功");
              },
              function(reason) {
                console.log("Failed: " + reason);
              }
            );
          }
        },
        {
          text: "分享到朋友圈",
          handler: () => {
            Wechat.isInstalled(
              function(installed) {
                if (!installed) {
                  this.showToast("你没有安装微信");
                  return;
                }
              },
              function(reason) {
                this.showToast("Failed: " + reason);
                return;
              }
            );
            Wechat.share(
              {
                message: {
                  title: this.title,
                  description: this.shareDesc,
                  thumb: this.shareImg,
                  media: {
                    type: Wechat.Type.LINK,
                    webpageUrl: this.shareUrl
                  }
                },
                scene: Wechat.Scene.TIMELINE
              },
              function() {
                this.showToast("分享成功");
              },
              function(reason) {
                console.log("Failed: " + reason);
              }
            );
          }
        },
        {
          text: "取消",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }
}
