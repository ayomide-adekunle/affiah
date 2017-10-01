import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IncomeDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-income-details',
  templateUrl: 'income-details.html',
})
export class IncomeDetails {
  incomeInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.incomeInfo=navParams.get('incomeInfo');
    console.log(this.incomeInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IncomeDetails');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
