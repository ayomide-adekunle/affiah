import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InvoiceService} from '../../providers/invoice-service';
import { ExitAppHandler } from '../../providers/exit-app-handler';

/**
 * Generated class for the Invoices page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-invoices',
  templateUrl: 'invoices.html',
})
export class Invoices {
  payment='invoices';
  invoiceList=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public invoiceService: InvoiceService,private zone:NgZone,private exitService: ExitAppHandler) {
    this.exitService.setExitApp(false);
    this.getInvoiceList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Invoices');
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  formatNumber(x) {
    if(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  onSegmentChange() {
    console.log(this.payment);
    if(this.payment=='expenses') {
      this.navCtrl.push('Expenses',{},{animate: false});
    }
    if(this.payment=='income') {
      this.navCtrl.push('Income',{},{animate: false});
    }
    if(this.payment=='reports') {
      this.navCtrl.push('Report',{},{animate: false});
    }
    
  }
  getInvoiceList() {
    this.invoiceService.getInvoice()
      .then(invoices => {
          this.zone.run(() => {
            this.invoiceList=invoices;
           // this.invoiceService.deleteInvoice(this.invoiceList[0]);
            console.log(this.invoiceList,'invoice list');
            
          });
      })
      .catch(console.error.bind(console));
  }
  newInvoice()  {
    this.navCtrl.push('AddInvoice',{},{animation:'wp-transition'});
  }
  invoiceDetials(invoice)  {
    this.navCtrl.push('InvoiceDetails',{invoiceInfo:invoice},{animation:'wp-transition'});
  }

}
