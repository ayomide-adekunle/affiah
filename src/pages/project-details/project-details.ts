import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {ProjectService} from '../../providers/project-service';
import {ClientService} from '../../providers/client-service';

/**
 * Generated class for the ProjectDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-project-details',
  templateUrl: 'project-details.html',
})
export class ProjectDetails {
  project;
  //to handel the ion-segment
  projects='expenses';
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController,public projectService: ProjectService,
  public clientService: ClientService) {
     this.project=navParams.get('project');
     console.log(this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectDetails');
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  deleteProject(project)  {
      let confirm = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete '+ project.name,
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
            this.clientService.findWhere(project.clientId).then ( data =>
            {
              console.log(data);
              for (var a in data.projects) {
                console.log(data.projects[a]._id,project._id);
                if (data.projects[a]._id==project._id) {
                  //delete the selected project from the client information
                  var index = data.projects.indexOf(data.projects[a]);
                  data.projects.splice(index, 1);
                  console.log(data);
                  this.clientService.editClient(data);
                  console.log(data.projects[a],'selected project');
                }
              }
            })
            this.projectService.deleteProject(project)
             .then(res=>{
               this.navCtrl.setRoot('ProjectList',{recountProject:true});
             })
          }
        }
      ]
    });
    confirm.present();
  }
  editProject(project)  {
    let confirm = this.alertCtrl.create({
      title: 'Confirm Edit',
      message: 'Do you want to edit '+ project.name,
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
            this.navCtrl.push('AddProject',{ProjectInfo:project});
            // this.navCtrl.pop().then(value =>{
            //   this.navCtrl.push('AddProject',{ProjectInfo:project});
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
  checkedStatus(status1,status2) {
    if (status1==status2) {
      return true;
    }
    else{
      return false;
    }
  }
  changeStatus(project) {
    console.log(project.status);
    
    let alert = this.alertCtrl.create();
    alert.setTitle('Change '+project.name+' status');

    alert.addInput({
      type: 'radio',
      label: 'Not Started',
      value: 'Not Started',
      checked: this.checkedStatus('Not Started',project.status)
    });
    alert.addInput({
      type: 'radio',
      label: 'On Going',
      value: 'On Going',
      checked: this.checkedStatus('On Going',project.status)
    });

    alert.addInput({
      type: 'radio',
      label: 'Completed',
      value: 'Completed',
      checked: this.checkedStatus('Completed',project.status)
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if(data!=project.status)  {
          project.status=data;
          this.setProjectColor(project);
          console.log(this.project);
          this.navCtrl.remove(this.navCtrl.length()-2);
          this.navCtrl.insert(this.navCtrl.length()-2,'ProjectList');
          this.clientService.findWhere(project.clientId).then ( data =>
            {
              console.log(data);
              for (var a in data.projects) {
                console.log(data.projects[a]._id,project._id);
                if (data.projects[a]._id==project._id) {
                  //edit the selected project from the client information
                  data.projects[a]=project;
                  console.log(data,'ready result');
                  this.clientService.editClient(data);
                }
              }
            })
          
          //update project in the database
          this.projectService.editProject(project);
        }
        if(data==project.status)  {
          console.log('we have nothing to change');
        }
      }
    });
    alert.present();
  
    console.log(project);
  }
  getDetails(expense) {
    this.navCtrl.push('ExpenseDetails',{expenseInfo:expense},{animation:'wp-transition'});
  }
  invoiceDetails(invoice)  {
    this.navCtrl.push('InvoiceDetails',{invoiceInfo:invoice},{animation:'wp-transition'});
  }
  newInvoice()  {
    this.navCtrl.push('AddInvoice',{},{animation:'wp-transition'});
  }
  addExpense()  {
    this.navCtrl.push('AddExpense',{},{animation:'wp-transition'});
  }
  addTask(project) {
    console.log(project);
    let promptTask = this.alertCtrl.create({
      title: 'Add Task',
      message: "Please fill the task details",
      inputs: [
        {
          name: 'assign_to',
          placeholder: 'Assign to',
          type:'text'
        },
        {
          name: 'desc',
          placeholder: 'Description',
          type:'text'
        },
        {
          name:'date',
          placeholder:'Deadline',
          type:'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            project.tasks.push(data);
            console.log(project);
            this.projectService.editProject(project)
              .then(res=>{
                //this.navCtrl.pop();
              })
          }
        }
      ]
    });
    promptTask.present();
  }
  setProjectColor(data) {
      if(data.status=='Not Started')  {
         data.color='#f53d3d'
      }
      if(data.status=='On Going')  {
         data.color='#ffff00'
      }
      if(data.status=='Completed')  {
         data.color='#00ff00'
      }
   
  }

}
