import { Component,ViewChild ,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides,LoadingController,MenuController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {AccountSetupService} from '../../providers/account-setup-service';
import {AlertServiceProvider} from '../../providers/alert-service/alert-service'; 


/**
 * Generated class for the Register page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class Register {
  login_data={email:'',password:''};
  reg_data={email:'',password:'',phone:'',fullname:'',biz_name:'',role_id:'2'};
  public user_data=[];
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authservice: AuthService,
  private alert: AlertServiceProvider,public loadingCtrl: LoadingController,private zone: NgZone,
  private accountSetup: AccountSetupService,private menu: MenuController) {
     this.menu.swipeEnable(false);
  }
  ionViewDidLoad()  {
    this.slides.lockSwipes(true); 
  }
  
  Loading(close) {
    if(close){
      this.loading.dismiss();
      return;
    }
    this.loading = this.loadingCtrl.create({
      spinner:'bubbles',
      content: 'Please wait...'
    });

    this.loading.present();
  }

   @ViewChild(Slides) slides: Slides;
   goToSlide1() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0,1000);
    this.slides.lockSwipes(true);
  }
  goToSlide2() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1,1000);
    this.slides.lockSwipes(true);
  }
  goToSlide3() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(2,1000);
    this.slides.lockSwipes(true);
  }
  doLogin(login_data) {
    if(login_data.email.length==0)  {
      this.alert.alertMessage('Error','Please fill the email field');
      return;
    }
    if(login_data.password.length==0)  {
      this.alert.alertMessage('Error','Please fill the password field');
      return;
    }
    //Show loader
    this.Loading(null);
    this.authservice.login(login_data).subscribe(data=>{
      if(data.responseCode=='IB-401') {
        this.alert.alertMessage('Error','Email is already taken');
        //Hide Loader
        this.Loading(true);
        return;
      }
      if(data.responseCode=='IB-404') {
        this.alert.alertMessage('Error','Account not found please try another email and password');
        //Hide Loader
        this.Loading(true);
        return;
      }
      if(data.responseCode=='IB-200') {
        //Hide Loader
        this.Loading(true);
        //Set the user's ID to the ID from the API
        data.responseData._id=data.responseData.unique_id;
        this.authservice.addUser(data.responseData);
        //this.navCtrl.setRoot(HomePage,{ userInfo: data .responseData});
       

        this.accountSetup.initiateDb();
        this.accountSetup.getAccountDetails()
          .then(info => {
              this.zone.run(() => {
                 console.log(info,'check account database');
                 //check if the account is setup
                 if(info.length>0)  {
                    this.navCtrl.setRoot('HomePage',{ userInfo: [[data.responseData],info]});
                 }
                 else{
                   this.navCtrl.setRoot('AccountSetup',{ userInfo: data.responseData});
                 }
              });
          })
          .catch(console.error.bind(console));
         return;
      }
    },
    err=>{
      console.log(err);
      this.alert.alertMessage('Error','Please check your internet connetion and try again');
      //Hide Loader
        this.Loading(true);
      return;
    } );
  }

  doReg(reg_data) {
   //let regData={email:'ayoysf@gmail.com',password:'12345',phone:'08053513887',fullname:'Ayomide A',biz_name:'Imagine'};
    
    if(reg_data.email.length==0)  {
      this.alert.alertMessage('Error','Please fill the email field');
      return;
    }
    if(reg_data.password.length==0)  {
      this.alert.alertMessage('Error','Please fill the password field');
      return;
    }
    if(reg_data.phone.length==0)  {
      this.alert.alertMessage('Error','Please fill the Phone field');
      return;
    }
    if(reg_data.fullname.length==0)  {
      this.alert.alertMessage('Error','Please fill the FullName field');
      return;
    }
    if(reg_data.biz_name.length==0)  {
      this.alert.alertMessage('Error','Please fill the Business Name field');
      return;
    }
    //Show loader
    this.Loading(null);
    
    this.authservice.register(reg_data).subscribe(data=>{
      console.log(data);
      if(data.responseCode=='IB-401') {
        //Hide Loader
        this.Loading(true);
        this.alert.alertMessage('Error','Email is already taken');
        return;
      }
      if(data.responseCode=='IB-200') {
        //Hide Loader
        this.Loading(true);
        //Set the user's ID to the ID from the API
        data.responseData._id=data.responseData.unique_id;
        this.authservice.addUser(data.responseData);
        this.accountSetup.initiateDb();
        this.accountSetup.getAccountDetails()
          .then(info => {
              this.zone.run(() => {
                 console.log(info,'check account database');
                 //check if the account is setup
                 if(info.length>0)  {
                    this.navCtrl.setRoot('HomePage',{ userInfo: [[data.responseData],info]});
                 }
                 else{
                   this.navCtrl.setRoot('AccountSetup',{ userInfo: data.responseData});
                 }
              });
          })
          .catch(console.error.bind(console));
        return;
      }
    },
    err=>{
      console.log(err);
      this.alert.alertMessage('Error','Please check your internet connetion and try again');
      //Hide Loader
        this.Loading(true);
      return;
    } );
  }

}
