import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';


/**
 * Generated class for the ClientDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-client-details',
  templateUrl: 'client-details.html',
})
export class ClientDetails {
  clientInfo;
  //to handel the ion-segment
  clients='projects'

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,
   private clientservice:ClientService) {
    this.clientInfo=navParams.get('clientData');
    console.log(this.clientInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientDetails');
  }
  formatNumber(x) {
    if(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  deleteClient(client)  {
      let confirm = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete '+ client.company,
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
            this.clientservice.deleteClient(client)
              .then(res=>{
                 this.navCtrl.pop();
              })
           
          }
        }
      ]
    });
    confirm.present();
  }
  editClient(client)  {
    let confirm = this.alertCtrl.create({
      title: 'Confirm Edit',
      message: 'Do you want to edit '+ client.company,
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
            this.navCtrl.push('AddClient',{clientInfo:client});
            //  this.navCtrl.pop().then(value =>{
            //   this.navCtrl.push('AddClient',{clientInfo:client});
            //  });
            
          }
        }
      ]
    });
    confirm.present();

  }
  selectColor(status) {
    if (status=='Not Started')  {
      return '#f53d3d';
    }
    if(status=='On Going')  {
      return '#ffff00';
    }
    if(status=='Completed')  {
      return '#00ff00';
    }
    
  }
  ProDetails(project){
    this.navCtrl.push('ProjectDetails',{project:project},{animation:'wp-transition'});
  }
  invoiceDetails(invoice)  {
    this.navCtrl.push('InvoiceDetails',{invoiceInfo:invoice},{animation:'wp-transition'});
  }
  addProject()  {
    this.navCtrl.push('AddProject',{},{animation:'wp-transition'});
  }
  newInvoice()  {
    this.navCtrl.push('AddInvoice',{},{animation:'wp-transition'});
  }
 

}
