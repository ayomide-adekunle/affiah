import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {BulkSms} from '../../providers/bulk-sms';

/**
 * Generated class for the BulksmsList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bulksms-list',
  templateUrl: 'bulksms-list.html',
})
export class BulksmsList {
  smsList=[];
  //make the footer to default to bulk sms
  tabs_content='bulk_sms';
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private bulkSms: BulkSms, private zone:NgZone,public alertCtrl: AlertController) {
    this.getSmsList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BulksmsList');
  }
  onSegmentChange() {
    console.log(this.tabs_content);
    if(this.tabs_content == 'share_files') {
      this.navCtrl.push('ShareFilesPage',{},{animate: false});
    }  
   
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  getSmsList() {
    this.bulkSms.getAllSms()
      .then(sms => {
          this.zone.run(() => {
            this.smsList=sms;
            console.log(this.smsList);
            //this.bulkSms.deleteSms(this.smsList[0]);
          });
      })
      .catch(console.error.bind(console));
  }
  newMessage(){
    this.navCtrl.push('AddBulkSms');
  }
  formatDate(date)  {
    var formatedDate = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
    return formatedDate;
  }
  deleteSms(sms)  {
      let confirm = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this message',
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
            console.log('Agree clicked');
            this.bulkSms.deleteSms(sms);
            this.getSmsList();
            //this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}
