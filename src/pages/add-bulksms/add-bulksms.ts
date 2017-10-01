import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';
import {BulkSms} from '../../providers/bulk-sms';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the BulksmsDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-bulksms',
  templateUrl: 'add-bulksms.html',
})
export class AddBulkSms {
  sms={text:'',to:[],client:'AJE Service',user_id:'Ayo',sender:'',_id:'',selected:''};
  clientList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private clientService: ClientService, private zone:NgZone,public alertCtrl: AlertController,
  private bulkSms: BulkSms,private msgAlert: AlertServiceProvider) {
    this.getClientList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BulksmsDetails');
  }
  getClientList() {
    this.clientService.getAllClients()
      .then(client => {
          this.zone.run(() => {
            this.clientList=client;
             //this.clientService.deleteClient(this.clientList[0]);
            //  console.log(this.clientList.length);
            //console.log(this.clientList[0],'client list');
            //  console.log(this.clientList,'1234');
            console.log(this.clientList);
          });
      })
      .catch(console.error.bind(console));
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue);
    if(selectedValue == 'find') {
      let alert = this.alertCtrl.create();
      alert.setTitle('Select your client');

      for (var a in this.clientList)  {
        alert.addInput({
        type: 'checkbox',
        label: this.clientList[a].company,
        value: this.clientList[a].phone
      });

      }
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: data => {
          this.sms.to = data;
          console.log(this.sms.to);
        
        }
      });
    alert.present();

    }
    else {
       for (var a in this.clientList)  {
        this.sms.to.push(this.clientList[a].phone);
      }
      console.log(this.sms.to);
    }
   
  }
  generateID(){
    let random=Math.floor(Math.random() * 100000);
    return random
  }
  validate(data)  {
    console.log(data.selected,'llll');
    if(data.text.length==0) {
      this.msgAlert.alertMessage('Info','Please fill the message');
      return false;
    }
    if(data.sender.length==0) {
      this.msgAlert.alertMessage('Info','Please fill the title');
      return false;
    }
    if(this.clientList.length==0) {
       this.msgAlert.alertMessage('Info','Client List is empty');
       return false;
    }
    if(data.selected.length==0) {
      this.msgAlert.alertMessage('Info','Please select a client');
      return false;
    }
    
    return true;
  }

  sendMessage() {

    if(!this.validate(this.sms)) {
      return;
    }
    this.bulkSms.sendSms(this.sms).subscribe(res=>
      {
        console.log(res);
      })
       
       this.sms._id=this.sms.sender+this.generateID();
       this.bulkSms.addSms(this.sms);
       this.navCtrl.pop();
  }

}
