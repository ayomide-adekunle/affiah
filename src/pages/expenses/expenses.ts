import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ExpenseService} from '../../providers/expense-service';

/**
 * Generated class for the Expenses page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class Expenses {
  payment='expenses';
  expenseList=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public expenseService: ExpenseService,private zone:NgZone) {
    this.getExpenseList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Expenses');
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  onSegmentChange() {
    console.log(this.payment);
    if(this.payment=='income') {
      this.navCtrl.push('Income',{},{animate: false});
     }
    if(this.payment=='invoices') {
        this.navCtrl.push('Invoices',{},{animate: false});
      }
    if(this.payment=='reports') {
        this.navCtrl.push('Report',{},{animate: false});
     }
    
  }
  getExpenseList() {
    this.expenseService.getAllExpenses()
      .then(expenses => {
          this.zone.run(() => {
            this.expenseList=expenses;
            //this.expenseService.deleteExpense(this.expenseList[0]);
            
            console.log(this.expenseList,'expense list');
            
          });
      })
      .catch(console.error.bind(console));
  }
  addExpense()  {
    this.navCtrl.push('AddExpense',{},{animation:'wp-transition'});
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getDetails(expense) {
    this.navCtrl.push('ExpenseDetails',{expenseInfo:expense},{animation:'wp-transition'});
  }

}
