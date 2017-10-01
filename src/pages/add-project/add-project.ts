import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ClientService} from '../../providers/client-service';
import { ToastController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {ProjectService} from '../../providers/project-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AddProject page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-project',
  templateUrl: 'add-project.html',
})
export class AddProject {
  project={clientId:""};
  clientList=[];
  userInfo;
  loadAddExpense
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private clientService: ClientService,private zone:NgZone,public toastCtrl: ToastController,
  private authservice: AuthService,public projectService: ProjectService,
  private msgAlert: AlertServiceProvider) {
    this.getClientList();
    this.getUserInfo();
    //this returns to expense view when adding project from expense
    this.loadAddExpense=navParams.get('loadAddExpense');
    console.log(this.loadAddExpense,'here');
    if(navParams.get('clientId')) {
      this.project.clientId=navParams.get('clientId');
    }
    if(navParams.get('ProjectInfo')) {
      this.project=navParams.get('ProjectInfo');
      console.log(this.project);
      return;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProject');
  }
  addClient(){
    this.navCtrl.push('AddClient');
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue);
    if(selectedValue=='addClient')  {
      this.navCtrl.push('AddClient',{loadAddProject:true});
      //remove the add project view and add later to update the select view
      this.navCtrl.remove(this.navCtrl.length()-1);
      
    }
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
  getClientList() {
    this.clientService.getAllClients()
      .then(client => {
          this.zone.run(() => {
            this.clientList=client;
            console.log(this.clientList);
          });
      })
      .catch(console.error.bind(console));
  }
  generateID(project){
    let random=Math.floor(Math.random() * 100000);
    return project+this.userInfo[0].unique_id+'project'+random;
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  validate(data)  {
    if(!data.name) {
      this.msgAlert.alertMessage('Info','Please fill the Project name');
      return false;
    }
    if(!data.clientId) {
      this.msgAlert.alertMessage('Info','Please select a client');
      return false;
    }
    if(!data.amount) {
      this.msgAlert.alertMessage('Info','Please fill the amount');
      return false;
    }
    if(!data.desc) {
      this.msgAlert.alertMessage('Info','Please fill description');
      return false;
    }
    if(!data.start_date) {
      this.msgAlert.alertMessage('Info','Please fill start date');
      return false;
    }
    if(!data.end_date) {
      this.msgAlert.alertMessage('Info','Please fill end date');
      return false;
    }
    return true;
  }
  addProject(project) {
    if(!this.validate(project)) {
      return;
    }
    if(project.clientId=='')  {
      this.presentToast('You need to select a client');
      return;
    }
    project.id=this.generateID(project.name);
    project.status='Not Started';
    project.expenses=[];
    project.invoices=[];
    project.tasks=[];
    //get full details of the client that owns the project using the ClientId from the form
    this.clientService.findWhere(project.clientId)
    .then (client => {
        project.client_name=client.company;
        this.projectService.addProject(project)
          .then(res=>{
            project._rev=res.rev;
            client.projects.push(project);
            //update the client to reflect changes in the project
            this.clientService.editClient(client)
              .then(res=>{
                this.navCtrl.setRoot('ProjectList',{recountProject:true});
              })
          });
        
    });
   

   
  }
  editProject(project)  {
    console.log(project);
    this.projectService.editProject(project).then(res=>{
        this.clientService.findWhere(project.clientId).then ( data =>
      {
        console.log(data);
        for (var a in data.projects) {
          console.log(data.projects[a]._id,project._id);
          if (data.projects[a]._id==project._id) {
            //edit the selected project from the client information
            data.projects[a]=project;
            console.log(data,'ready result');
            this.clientService.editClient(data)
            //  .then(res=>{
            //     
            //  })
          }
        }
      })
    })
    
    
    this.navCtrl.pop();
  }

}
