import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface IBoxOptions {
  header: string;
  subHeader?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  async confirmBox(args: IBoxOptions) {
    const { header, subHeader, message } = args;

    const box = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => ({ values: false })
        },
        {
          text: 'Ok',
          handler: () => ({ values: true })
        }
      ]
    });
    await box.present();
    const res = await box.onDidDismiss();
    console.log(res);
  }

  constructor(private alertCtrl: AlertController) {}
}
