import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExpenseDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-expense-details',
  templateUrl: 'expense-details.html',
})
export class ExpenseDetails {
expenseInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expenseInfo=navParams.get('expenseInfo');
    console.log(this.expenseInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetails');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
