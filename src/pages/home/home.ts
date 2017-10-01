import { Component,NgZone } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController,NavParams,MenuController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AccountSetupService } from '../../providers/account-setup-service';
import { ExitAppHandler } from '../../providers/exit-app-handler';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 userInfo;
 user_data=[];
 accountDetails=[];

  constructor(public navCtrl: NavController,public navParams: NavParams,private authservice: AuthService,
  private zone: NgZone,private accountSetup: AccountSetupService,private exitService: ExitAppHandler,
  private menu: MenuController) {
    this.menu.swipeEnable(true);
    //get user's data when logging in else get it from database if already logged in
    this.userInfo=navParams.get('userInfo');
    this.exitService.setExitApp(false);
    if(this.userInfo)  {
       console.log(this.userInfo);
       this.user_data=this.userInfo[0];
       this.accountDetails=this.userInfo[1];
       console.log(this.user_data,this.accountDetails);
    }
    else{
        //this.user_data =this.authservice.getUser();
        this.authservice.getUser()
          .then(user => {
              this.zone.run(() => {
                this.user_data=user;
                this.userInfo=user;
                console.log(this.user_data,'user info');
              });
          })
          .catch(console.error.bind(console));

        this.accountSetup.getAccountDetails()
          .then(account => {
              
              this.zone.run(() => {
                if(account.length==0)   {
                    this.navCtrl.setRoot('AccountSetup');
                    return;
                }
                this.accountDetails=account;
                // this.accountSetup.deleteAccount(account[0]);
                console.log(this.accountDetails,'account info');
              });
          })
          .catch(console.error.bind(console));

    }
   
  }
 formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }

  ionViewDidLoad() {
  console.log('ionViewDidLoad Register');
  // this.authservice.initiateDb();
  
 }
 navigateTo(id) {
    if(id==1){
        this.navCtrl.push('ClientList',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
    if(id==2)   {
        this.navCtrl.push('ProjectList',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
    if(id==3)   {
        this.navCtrl.push('BulksmsList',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
    if(id==4)   {
        this.navCtrl.push('HelpTopics',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
    if(id==5)   {
        this.navCtrl.push('Income',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
    if(id==6)   {
        this.navCtrl.push('NotesPage',{userInfo:this.userInfo},{animation:'wp-transition'});
    }
     
 }
 openNotification() {
     this.menu.toggle('right');
 }

}
