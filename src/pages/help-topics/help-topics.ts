import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

/**
 * Generated class for the HelpTopics page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-help-topics',
  templateUrl: 'help-topics.html',
})
export class HelpTopics {
  helpMessage='';
  helpTitle='';
  helpList=true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public popoverCtrl: PopoverController) {
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpTopics');
  }
  helpInfo(type) {
    this.helpList=false;
    if(type==1) {
      this.helpMessage='Affiah is a business workflow management that helps owners to keep accurate record of business dealings and provide them business performance reports';
      this.helpTitle='About Affiah';
   }
    if(type==2) {
      this.helpMessage='This is where you tell Affiah how much your business have';
       this.helpTitle='Account Setup';
    }
    if(type==3) {
      this.helpMessage='Now you can add your client’s details and let Affiah take care of the rest.';
       this.helpTitle='Manage Client';
    }
    if(type==4) {
      this.helpMessage='This function help to track your  projects and status';
       this.helpTitle='Manage Projects';
    }
    if(type==5) {
      this.helpMessage='Appreciate your loyal/unloyal customers by sending a text from here..';
       this.helpTitle='Bulk Sms';
    }
    if(type==6) {
      this.helpMessage='This is where Affiah gives you a break down of your business financial performance';
       this.helpTitle='Generating Reports';
    }
  }
  helpPage()  {
    this.helpList=true;
    this.helpMessage='';
  }
  

}
