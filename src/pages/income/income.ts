import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';
import {IncomeService} from '../../providers/income-service';
import { ExitAppHandler } from '../../providers/exit-app-handler';

/**
 * Generated class for the Income page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-income',
  templateUrl: 'income.html',
})
export class Income {
  //set the tab to show income by default
  payment='income';
  IncomeList=[];
  userInfo

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController,public incomeService: IncomeService,
  private zone:NgZone,private exitService: ExitAppHandler) {
    this.exitService.setExitApp(false);
    this.userInfo=navParams.get('userInfo');
    this.getIncomeList();
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  onSegmentChange() {
      console.log(this.payment);
      if(this.payment=='expenses') {
        this.navCtrl.push('Expenses',{},{animate: false});
      }
      if(this.payment=='invoices') {
        this.navCtrl.push('Invoices',{},{animate: false});
      }
      if(this.payment=='reports') {
        this.navCtrl.push('Report',{},{animate: false});
      }
    }
    
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad Income');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  addPayment() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Payment Source');

    alert.addInput({
      type: 'radio',
      label: 'Issued Invoices',
      value: 'INVOICE PAYMENT',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Loan',
      value: 'RECORD LOAN'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
      this.navCtrl.push('AddIncome',{info:data,userInfo:this.userInfo},{animation:'wp-transition'});
      }
    });
    alert.present();
  }
  getIncomeList() {
    this.incomeService.getIncome()
      .then(incomes => {
          this.zone.run(() => {
            this.IncomeList=incomes;
            //this.incomeService.deleteIncome(this.IncomeList[0]);
            
            console.log(this.IncomeList,'income list');
            
          });
      })
      .catch(console.error.bind(console));
  }
  incomeDetials(income)  {
    console.log(income);
    this.navCtrl.push('IncomeDetails',{incomeInfo:income},{animation:'wp-transition'});
  }

}
