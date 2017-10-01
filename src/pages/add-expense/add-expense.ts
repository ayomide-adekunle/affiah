import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AccountSetupService} from '../../providers/account-setup-service';
import {AuthService} from '../../providers/auth-service';
import {ExpenseService} from '../../providers/expense-service';
import {ProjectService} from '../../providers/project-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AddExpense page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpense {
  expense={};
  userInfo;
  accountInfo;
  projectList;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public authservice: AuthService,private zone: NgZone,public accountSetup: AccountSetupService,
   public expenseService: ExpenseService, public projectService: ProjectService,
   private msgAlert: AlertServiceProvider) {
    this.getUserInfo();
    this.getAccountDetails();
    this.getProjectList();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpense');
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue);
  }
  onSelectType(selectedValue:any) {
    console.log(selectedValue);
  }
  getAccountDetails() {
    this.accountSetup.getAccountDetails()
    .then(account=>{
      this.accountInfo=account[0];
      console.log(this.accountInfo);
      //this.accountSetup.deleteAccount(this.accountInfo);
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
  generateID(expense){
    let random=Math.floor(Math.random() * 100000);
    return expense+this.userInfo[0].unique_id+'expense'+random;
  }
  validate(data)  {
    if(!data.account_type) {
      this.msgAlert.alertMessage('Info','Please select a payment mode');
      return false;
    }
    if(!data.type) {
      this.msgAlert.alertMessage('Info','Please select expense type ');
      return false;
    }
    if(data.type=='Project-Expenses' && !data.project) {
      this.msgAlert.alertMessage('Info','Please select a project');
      return false;
    }
    if(!data.item) {
      this.msgAlert.alertMessage('Info','Please fill the item name');
      return false;
    }
    if(!data.amount) {
      this.msgAlert.alertMessage('Info','Please fill the amount');
      return false;
    }
    if(!data.desc) {
      this.msgAlert.alertMessage('Info','Please fill description');
      return false;
    }
    if(!data.date) {
      this.msgAlert.alertMessage('Info','Please fill date');
      return false;
    }
    return true;
  }
  submitExpense(expense) {
   if(!this.validate(expense)) {
      return;
   }
   expense.id=this.generateID(expense.item);
    // _id is used by PouchDB to sort data, so our data is sorted by date
    expense._id=expense.date+expense.id;
    if(expense.project){  
        console.log('it has project');
        //get the project to add expense to using the id
        this.projectService.findWhere(expense.project).
        then(data=>{
          //add the expense to the project
          data.expenses.push(expense);
          //update the project in d DB
          this.projectService.editProject(data);
        })
    }
   
    if(expense.account_type=='cash') {
      //first update the your account
      this.accountInfo.hand=parseInt(this.accountInfo.hand)-parseInt(expense.amount);
      this.accountSetup.editAccount(this.accountInfo);
      console.log(this.accountInfo);
    }
    if(expense.account_type=='bank') {
       //first update the your account
      this.accountInfo.bank=parseInt(this.accountInfo.bank)-parseInt(expense.amount);
      this.accountSetup.editAccount(this.accountInfo);
      console.log(this.accountInfo);
    }
    
    //add to expense DB
    this.expenseService.addExpense(expense);

     this.navCtrl.pop();
     this.navCtrl.push('Expenses',{},{animation:'wp-transition'});
  }

}
