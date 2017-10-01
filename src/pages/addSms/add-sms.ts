import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';
import {BulkSms} from '../../providers/bulk-sms';

/**
 * Generated class for the BulksmsDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-sms',
  templateUrl: 'add-sms.html',
})
export class AddSMS {
  sms={text:'',to:[],client:'AJE Service',user_id:'Ayo',sender:'',_id:''};
  //$scope.newMessage.user_id = AuthModel.getData()[0].unique_id;
  clientList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private clientService: ClientService, private zone:NgZone,public alertCtrl: AlertController,
  private bulkSms: BulkSms) {
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
    if(selectedValue=='find') {
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
        this.sms.to=data;
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
      // this.authservice.login(login_data).subscribe(data=>{
      
    }
   
  }
  generateID(){
    let random=Math.floor(Math.random() * 100000);
    return random
  }

  sendMessage() {
    console.log(this.sms);
    this.bulkSms.sendSms(this.sms).subscribe(res=>
      {
        console.log(res);
      })
       
       this.sms._id=this.sms.sender+this.generateID();;
       this.bulkSms.addSms(this.sms);
       this.navCtrl.pop();
  }

}
