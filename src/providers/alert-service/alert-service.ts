import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertServiceProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello AlertServiceProvider Provider');
  }

  alertMessage(title,msg) {
    let alert = this.alertCtrl.create({
    title: title,
    subTitle: msg,
    buttons: ['Ok']
    });
    alert.present();
  }


}
