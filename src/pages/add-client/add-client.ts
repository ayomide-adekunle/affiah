import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';
import {AuthService} from '../../providers/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AddClient page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-client',
  templateUrl: 'add-client.html',
})
export class AddClient {
  client={country:'Nigeria'};
  userInfo;
  newClient=1;
  loadAddProject;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private clientservice:ClientService,private zone:NgZone,private authservice: AuthService,
  private msgAlert: AlertServiceProvider) {
    this.getUserInfo();
    
    //this loads the add project view
    this.loadAddProject=navParams.get('loadAddProject');
    console.log(this.loadAddProject);
    if(navParams.get('clientInfo')) {
      this.client=navParams.get('clientInfo');
    }
    
   // console.log(this.userInfo[0].unique_id,'from add client');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClient');
  }
  //use the client's phone number and user's ID to generate a unique id
  generateID(company){
    let random=Math.floor(Math.random() * 100000);
    return company+this.userInfo[0].unique_id+'client'+random;
  }
  validate(data)  {
    if(!data.company) {
      this.msgAlert.alertMessage('Info','Please fill Company');
      return false;
    }
    if(!data.email) {
      this.msgAlert.alertMessage('Info','Please fill Email');
      return false;
    }
    if(!data.phone) {
      this.msgAlert.alertMessage('Info','Please fill Phone');
      return false;
    }
    if(!data.address) {
      this.msgAlert.alertMessage('Info','Please fill Address');
      return false;
    }
    if(!data.website) {
      this.msgAlert.alertMessage('Info','Please fill Website');
      return false;
    }
    if(!data.state) {
      this.msgAlert.alertMessage('Info','Please fill State');
      return false;
    }
    if(!data.contact) {
      this.msgAlert.alertMessage('Info','Please fill Contact');
      return false;
    }
    if(!this.validateEmail(data.email)) {
        this.msgAlert.alertMessage('Info','Email is not valid');
        return false;
    }
    if(data.phone.length < 10 || data.phone.length > 11)  {
        this.msgAlert.alertMessage('Info','Phone number must be 10 or 11 digits');
        return false;
    }
    return true;
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
 
  addClient(client){
    if(!this.validate(client))  { return }
    client.id=this.generateID(client.company);
    client.projects=[];
    client.invoices=[];
    if(this.loadAddProject){
      this.clientservice.addClient(client)
        .then(clientId => {
            console.log(clientId.id);
            this.navCtrl.push('AddProject',{clientId:clientId.id});
        })
     
      return;
    }
    
    this.clientservice.addClient(client)
      .then(res=>{
        this.navCtrl.pop();
      })
  }
  editClient(client)  {
   
    this.clientservice.editClient(client);
    this.navCtrl.pop();
    //this.navCtrl.insert(this.navCtrl.length(),HomePage);
  }
  getUserInfo() {
    this.authservice.getUser()
      .then(user => {
          this.zone.run(() => {
            this.userInfo=user;
            this.userInfo=user;
            console.log(this.userInfo,'user info');
          });
      })
      .catch(console.error.bind(console));
  }

}
