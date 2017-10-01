import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';

/**
 * Generated class for the ClientList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-client-list',
  templateUrl: 'client-list.html',
})
export class ClientList {
  searchQuery: string = '';
  items: string[];
  clientList=[];
  userInfo;
  //make the footer to default to clients
  tabs_content='clients';

  constructor(public navCtrl: NavController, public navParams: NavParams,private clientService: ClientService,
  private zone:NgZone) {
    this.userInfo=navParams.get('userInfo');
    this.initializeItems();
    
  }
  onSegmentChange() {
    console.log(this.tabs_content);
    if(this.tabs_content=='projects') {
      this.navCtrl.push('ProjectList',{},{animate: false});
      //remove the previous view from the stack when back button is pressed on Android
      //this.navCtrl.remove(this.navCtrl.length()-1);
    }
    if(this.tabs_content=='bulk_sms') {
      this.navCtrl.push('BulksmsList',{},{animate: false});
    }
    if(this.tabs_content=='finances') {
       this.navCtrl.push('Income',{},{animate: false});
    }
    if(this.tabs_content=='notes')  {
      this.navCtrl.push('NotesPage',{},{animate:false});
    }
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  initializeItems() {
    this.items = [
      'Imagine Business',
      'Connect Marketing',
      'Quore Media',
      'Redwood',
      'Imagine & Time'
    ];
   
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clientList = this.clientList.filter((client) => {
        return (client.company.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      console.log(this.clientList,'fff');
      if(this.clientList.length==0) {
        this.clientList=[{company:'No result'}];
        console.log(this.clientList);
      }
    }
    else {
       this.getClientList();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientList');
    this.getClientList();
  }
  clientDetails(client){
    this.navCtrl.push('ClientDetails',{clientData:client},{animation:'wp-transition'})
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
          });
      })
      .catch(console.error.bind(console));
  }
  addClient(){
    this.navCtrl.push('AddClient',{userInfo:this.userInfo},{animation:'wp-transition'});
  }

}
