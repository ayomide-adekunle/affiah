import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AccountSetupService} from '../../providers/account-setup-service';
import {IncomeService} from '../../providers/income-service';
import {LiabilityService} from '../../providers/liability-service';
import {AssetService} from '../../providers/asset-service';
import {AuthService} from '../../providers/auth-service';
import {InvoiceService} from '../../providers/invoice-service';
import {ProjectService} from '../../providers/project-service';
import {ClientService} from '../../providers/client-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

/**
 * Generated class for the AddIncome page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-income',
  templateUrl: 'add-income.html',
})
export class AddIncome {
  type;income={amount:'',source:''};accountInfo;
  liabilityInfo;invoiceList=[];
  assetInfo;userInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public accountSetup: AccountSetupService, public incomeService:IncomeService,
  public liabilityService: LiabilityService,public assetService:AssetService,
  public authservice: AuthService ,private zone: NgZone, public invoiceService: InvoiceService,
  public projectService: ProjectService,public clientService: ClientService,
  private msgAlert: AlertServiceProvider) {
    this.type=navParams.get('info');
    //this.userInfo=navParams.get('userInfo');
    this.getUserInfo();
    
    console.log(this.userInfo);
    this.getAccountDetails();
    this.getAllLiability();
    this.getAllAsset();
    this.getInvoiceList();
    console.log(this.type);
  }
  getAccountDetails() {
    this.accountSetup.getAccountDetails()
    .then(account=>{
      this.accountInfo=account[0];
      console.log(this.accountInfo);
      //this.accountSetup.deleteAccount(this.accountInfo);
    })
  }
  getAllLiability() {
    this.liabilityService.getLiability()
    .then(liabilty=>{
      this.liabilityInfo=liabilty;
      console.log(this.liabilityInfo,'liability');
      //this.liabilityService.deleteLiability(this.liabilityInfo[0]);
    })
  }
  getAllAsset() {
    this.assetService.getAllAsset()
    .then(asset=>{
      this.assetInfo=asset;
      console.log(this.assetInfo,'assset');
      //this.liabilityService.deleteLiability(this.liabilityInfo[0]);
    })
  }
  getUserInfo ()  {
    this.authservice.getUser()
      .then(user => {
          this.zone.run(() => {
            this.userInfo=user;
          });
      })
      .catch(console.error.bind(console));
  }
  getInvoiceList() {
    this.invoiceService.getInvoice()
      .then(invoices => {
          this.zone.run(() => {
            this.invoiceList=invoices;
            //this.invoiceService.deleteInvoice(this.invoiceList[0]);
            console.log(this.invoiceList,'invoice list');
            
          });
      })
      .catch(console.error.bind(console));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIncome');
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue); 
    this.income.source=selectedValue.project.name;       
  }
  generateID(income){
    let random=Math.floor(Math.random() * 100000);
    return income+this.userInfo[0].unique_id+'income'+random;
  }
  validate(data)  {
    console.log(data);
    if(!data.account_type) {
      this.msgAlert.alertMessage('Info','Please select a payment mode');
      return false;
    }
    if(this.type=='INVOICE PAYMENT' && !data.invoice) {
      this.msgAlert.alertMessage('Info','Please select invoice');
      return false;
    }
    if(!data.source) {
      this.msgAlert.alertMessage('Info','Please fill source');
      return false;
    }
    
    if(!data.amount) {
      this.msgAlert.alertMessage('Info','Please fill the amount');
      return false;
    }
    if(!data.purpose) {
      this.msgAlert.alertMessage('Info','Please fill purpose');
      return false;
    }
    if(!data.date) {
      this.msgAlert.alertMessage('Info','Please fill date');
      return false;
    }
    return true;
  }
  submitIncome(income)  {
     if(!this.validate(income)) {
      return;
    }
    switch(this.type) {
      case 'RECORD LOAN':
        income.type='Loan';
        break;
      case 'EQUITY INJECTION':
          income.type='Equity';
          break;
      case 'INVOICE PAYMENT':
          income.type='Invoice';
          break;
      default:
          return;
    }
    if(income.account_type=='cash') {
      //first update the your account
      this.accountInfo.hand=parseInt(this.accountInfo.hand)+parseInt(income.amount);
      this.accountSetup.editAccount(this.accountInfo);
      console.log(this.accountInfo);
    }
    if(income.account_type=='bank') {
       //first update the your account
      this.accountInfo.bank=parseInt(this.accountInfo.bank)+parseInt(income.amount);
      this.accountSetup.editAccount(this.accountInfo);
      console.log(this.accountInfo);
    }
    //console.log(this.income);
    income.id=this.generateID(income.source);
    // _id is used by PouchDB to sort data, so our data is sorted by date
    income._id=income.date+income.id;

    //add to income DB
    this.incomeService.addIncome(income);

    //add to liabilty DB if it is of type loan
    if(this.type=='RECORD LOAN') {
      this.liabilityService.addLiability(income);
      console.log('added to liability');
    }
    //add to asset if it is of type equity
    if(this.type=='EQUITY INJECTION') {
      this.assetService.addAsset(income);
      console.log('added to asset');
    }
    //edit invoice from the InvoiceDB
    if(this.type=='INVOICE PAYMENT') {
      console.log('paying invoice');
    //update the invoice details
    income.invoice.amount_paid=parseInt(income.invoice.amount_paid)+parseInt(this.income.amount);
    console.log( income.invoice);
    this.invoiceService.editInvoice(income.invoice);

    //update the invoice in project DB
    this.projectService.findWhere(income.invoice.project._id).
    then(data=>{
      data.invoices[0]=income.invoice;
      this.projectService.editProject(data);
      console.log('Project was edited');
    });

    //update the invoice in Client DB
    this.clientService.findWhere(income.invoice.project.clientId).
    then(data=>{
      for(var a in data.invoices) {
        if(data.invoices[a]._id==income.invoice._id){
          data.invoices[a]=income.invoice;
          this.clientService.editClient(data);
          console.log(data.invoices[a],'this is the invoice to edit');
        }
      }
    });

    }

     this.navCtrl.pop();
     this.navCtrl.push('Income',{},{animation:'wp-transition'});
    
  }
   
}