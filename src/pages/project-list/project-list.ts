import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {ProjectService} from '../../providers/project-service';
import {ClientService} from '../../providers/client-service';
import { ExitAppHandler } from '../../providers/exit-app-handler';

/**
 * Generated class for the ProjectList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html',
})
export class ProjectList {
  projectList=[];
  projectStatus={'notStarted':0,'onGoing':0,'completed':0}
  //make the footer to default to projects
  tabs_content='projects';
  recountProject;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public projectService: ProjectService,private zone:NgZone,private clientService: ClientService,
  private exitService: ExitAppHandler) {
    this.exitService.setExitApp(false);
    this.getProjectList();
    this.recountProject=this.navParams.get('recountProject');
    console.log(this.recountProject,'this');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectList');
  }
  ionViewDidEnter() {
    if(this.recountProject)  {
       this.projectStatus.notStarted=0;
       this.projectStatus.onGoing=0;
       this.projectStatus.completed=0;
       this.getProjectList();
    }
     
  }
  onSegmentChange() {
    if(this.tabs_content=='clients') {
      this.navCtrl.push('ClientList',{},{animate: false});
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
  getProjectList() {
    this.projectService.getclientProject()
      .then(projects => {
          this.zone.run(() => {
            this.projectList=projects;
            //this.projectService.deleteProject(this.projectList[0]);
            this.countProject();
            this.setProjectColor();
           
          });
      })
      .catch(console.error.bind(console));
  }
  addProject()  {
    this.navCtrl.push('AddProject',{},{animation:'wp-transition'});
  }
  setProjectColor() {
    for (var a in this.projectList) {
      console.log(this.projectList[a].status);
      if(this.projectList[a].status=='Not Started')  {
         this.projectList[a].color='#f53d3d'
      }
      if(this.projectList[a].status=='On Going')  {
         this.projectList[a].color='#ffff00'
      }
      if(this.projectList[a].status=='Completed')  {
         this.projectList[a].color='#00ff00'
      }
     
    }
    console.log(this.projectList);
  }
  countProject()  {
    for ( var a in this.projectList)  {
      if(this.projectList[a].status=='Not Started') {
        this.projectStatus.notStarted++;   
      }
      if(this.projectList[a].status=='On Going') {
        this.projectStatus.onGoing++;
      }
      if(this.projectList[a].status=='Completed') {
        this.projectStatus.completed++;
      }
      
    }
   
  }
  findClient(clientId){
    console.log(clientId);
  }
  ProDetails(project){
    this.navCtrl.push('ProjectDetails',{project:project},{animation:'wp-transition'});
  }

}
