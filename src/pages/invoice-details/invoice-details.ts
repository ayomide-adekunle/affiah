import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {InvoiceService} from '../../providers/invoice-service';
import {IncomeService} from '../../providers/income-service';
import {AuthService} from '../../providers/auth-service';
import {AccountSetupService} from '../../providers/account-setup-service';
import {ProjectService} from '../../providers/project-service';
import {ClientService} from '../../providers/client-service';

/**
 * Generated class for the InvoiceDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-invoice-details',
  templateUrl: 'invoice-details.html',
})
export class InvoiceDetails {
  invoiceInfo;
  payment={amount:'',account:''}
  userInfo;
  accountInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController,public invoiceService: InvoiceService,
  public incomeService: IncomeService,public authservice: AuthService,
  private zone: NgZone,public accountSetup: AccountSetupService,
  public projectService: ProjectService,public clientService:ClientService) {
    this.invoiceInfo=navParams.get('invoiceInfo');
    this.getUserInfo();
    this.getAccountDetails();
    console.log(this.invoiceInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoiceDetails');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  getAccountDetails() {
    this.accountSetup.getAccountDetails()
    .then(account=>{
      this.accountInfo=account[0];
      console.log(this.accountInfo);
      //this.accountSetup.deleteAccount(this.accountInfo);
    })
  }
  payInvoice(invoice) {
    console.log(invoice,'invoice to pay');
    let prompt = this.alertCtrl.create({
      title: 'Payment Information',
      message: "",
      inputs: [
        {
          name: 'amount',
          placeholder: 'Amount',
          type:'number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.payment.amount=data.amount;
            let alert = this.alertCtrl.create();
            alert.setTitle('Select Account ');

            alert.addInput({
              type: 'radio',
              label: 'Bank',
              value: 'Bank',
              checked: true
            });
            alert.addInput({
              type: 'radio',
              label: 'Cash',
              value: 'Cash'
            });

            alert.addButton('Cancel');
            alert.addButton({
              text: 'OK',
              handler: data => {
              this.payment.account=data;
              console.log(invoice.project._id);

              

              if(this.payment.account=='Cash') {

                //first update the your account
                this.accountInfo.hand = parseInt(this.accountInfo.hand)+parseInt(this.payment.amount);
                this.accountSetup.editAccount(this.accountInfo);
                console.log(this.accountInfo);
              }
              if(this.payment.account=='Bank') {
                //first update the your Bank
                  this.accountInfo.bank=parseInt(this.accountInfo.bank)+parseInt(this.payment.amount);
                  this.accountSetup.editAccount(this.accountInfo);
                  console.log(this.accountInfo);
              }

              //update the invoice details
              invoice.amount_paid = parseInt(invoice.amount_paid)+parseInt(this.payment.amount);
              console.log(invoice);
              //this is needed to update the details view
              this.invoiceInfo = invoice;
              this.invoiceService.editInvoice(invoice);

              //update the invoice in project DB
              this.projectService.findWhere(invoice.project._id).
              then(data=>{
                data.invoices[0] = invoice;
                this.projectService.editProject(data);
              });

              //update the invoice in Client DB
              this.clientService.findWhere(invoice.project.clientId).
              then(data=>{
                for(var a in data.invoices) {
                  if(data.invoices[a]._id == invoice._id){
                    data.invoices[a] = invoice;
                    this.clientService.editClient(data);
                    console.log(data.invoices[a],'this is the invoice to edit');
                  }
                }
              });

              //add to Income DB
              var income_data = {date:null,amount:'',type:'',source:'',_id:'',income_type:''};
              let date = new Date();
              income_data.date = date.getFullYear()+'/'+date.getDay()+'/'+date.getMonth();
              income_data.amount = this.payment.amount;
              income_data.type = 'Invoice Payment';
              income_data.source = this.invoiceInfo.project.name;
              income_data._id = this.generateID(income_data.source);
              income_data.income_type = this.payment.account
              console.log(income_data);
              this.incomeService.addIncome(income_data);


              }
            });
            alert.present();
          }
        }
      ]
    });
    prompt.present();
  }
  generateID(income){
    let random = Math.floor(Math.random() * 100000);
    return income+this.userInfo[0].unique_id+'income'+random;
  }
  sendInvoice(invoiceInfo) {
    this.invoiceService.printInvoice(invoiceInfo);
  }

}
