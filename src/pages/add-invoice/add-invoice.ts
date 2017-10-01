import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {ProjectService} from '../../providers/project-service';
import {InvoiceService} from '../../providers/invoice-service';
import {ClientService} from '../../providers/client-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AddInvoice page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-invoice',
  templateUrl: 'add-invoice.html',
})
export class AddInvoice {
  projectList;
  userInfo;
  invoice={amount:'',start_date:'',end_date:'',desc:''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public projectService: ProjectService,public authservice: AuthService,
  private zone: NgZone,private clientservice:ClientService,public invoiceService:InvoiceService,
  private msgAlert: AlertServiceProvider) {
    this.getProjectList();
    this.getUserInfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInvoice');
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue);
    this.invoice.amount=selectedValue.amount
    this.invoice.start_date=selectedValue.start_date;
    this.invoice.end_date=selectedValue.end_date;
    this.invoice.desc=selectedValue.desc;
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
  getProjectList() {
    this.projectService.getclientProject()
      .then(projects => {
          this.zone.run(() => {
            this.projectList=projects;
           // this.projectService.deleteProject(this.projectList[0]);
            console.log(this.projectList,'project list');
          });
      })
      .catch(console.error.bind(console));
  }
  generateID(income){
    let random=Math.floor(Math.random() * 100000);
    return income+this.userInfo[0].unique_id+'invoice'+random;
  }
  validate(data)  {
    console.log(data);
    if(!data.project) {
      this.msgAlert.alertMessage('Info','Please select a project');
      return false;
    }
    if(!data.date) {
      this.msgAlert.alertMessage('Info','Please select a date');
      return false;
    }
    return true;
  }
  submitInvoice(invoice)  {
   if(!this.validate(invoice)) {
      return;
   }
   invoice.id=this.generateID(invoice.project.name);
    //Invoice is added to project,client and invoice DB
   invoice.amount_paid='0';

    //get the project to add invoice to using the id
    this.projectService.findWhere(invoice.project._id).
    then(project=>{

      //get the client to add invoice to using the id
      this.clientservice.findWhere(invoice.project.clientId).
      then(client=>{
        //add to invoice db
        this.invoiceService.addInvoice(invoice)
        .then(res=>{
          console.log(res);
          invoice._rev=res.rev;
          //add the invoice to the client
          client.invoices.push(invoice);
          console.log(client,'client');
          //update the invoice in d DB
          this.clientservice.editClient(client);
          })
          
          //add the invoice to the project
          project.invoices.push(invoice);
          console.log(project,'project');
          //update the invoice in d DB
          this.projectService.editProject(project);
        })
        })
        
        

    
    this.navCtrl.pop();
    this.navCtrl.push('Invoices',{},{animation:'wp-transition'});
  }

}
