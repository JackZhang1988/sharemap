import { Injectable } from "@angular/core";
import { ActionSheetController } from "ionic-angular";

@Injectable()
export class ShareProvider {
  constructor(public actionSheetCtrl: ActionSheetController) {
    console.log("Hello ShareProvider Provider");
  }

  initShareContent(shareParam) {}

  showSharePanel() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "微信分享",
          role: "destructive",
          handler: () => {
            console.log("Destructive clicked");
          }
        },
        {
          text: "QQ分享",
          handler: () => {
            console.log("Archive clicked");
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
