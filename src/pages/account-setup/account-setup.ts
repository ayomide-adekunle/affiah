import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { AccountSetupService } from '../../providers/account-setup-service';
import { AuthService } from '../../providers/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AccountSetup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-account-setup',
  templateUrl: 'account-setup.html',
})
export class AccountSetup {
  account={};
  userInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private authservice: AuthService,private accountSetup: AccountSetupService,
  private alertCtrl:AlertController,private alert:AlertServiceProvider) {
     this.userInfo=navParams.get('userInfo');
     console.log(this.userInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountSetup');
  }
  submitAccount(account) {
    console.log(this.userInfo,'for account');
    if(!account.bank || !account.hand)  {
      this.alert.alertMessage('Error', 'Please fill all the details');
      return;
    }
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Did you entered the correct figures',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //create id for account from the user's unique id
            let accountId=this.userInfo.unique_id+'Account';
            account._id=accountId;
            this.accountSetup.addAccount(account);
            this.navCtrl.setRoot('HomePage',{ userInfo:[[this.userInfo],[account]] });
          }
        }
      ]
    });
    confirm.present();
    
  }

}
