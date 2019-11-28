import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface IBoxOptions {
  header: string;
  subHeader?: string;
  message: string;
  confirm?: string;
  decline?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  async confirmBox(args: IBoxOptions) {
    const {
      header,
      subHeader,
      message,
      confirm = 'Ok',
      decline = 'Cancel'
    } = args;

    const box = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: decline,
          handler: () => ({ values: false })
        },
        {
          text: confirm,
          handler: () => ({ values: true })
        }
      ]
    });
    await box.present();
    const res = await box.onDidDismiss();
    return res.data.values;
  }

  async error(args: {header: string, message: string}) {
    const {
      header,
      message,
    } = args;

    const box = await this.alertCtrl.create({
      header,
      message,
      buttons: [{
          text: 'OK',
          handler: () => ({ values: true })
        }]
    });
    return await box.present();
  }

  constructor(private alertCtrl: AlertController) {}
}
