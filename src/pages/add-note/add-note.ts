import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProjectService} from '../../providers/project-service';
import {NotesServiceProvider} from '../../providers/notes-service/notes-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service'; 

/**
 * Generated class for the AddNotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-note',
  templateUrl: 'add-note.html',
})
export class AddNotePage {
  projectList=[];
  note={desc:'',projects:''};
  editNote;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private projectService: ProjectService,private zone:NgZone,
  private noteSerivce:NotesServiceProvider,private msgAlert: AlertServiceProvider) {
    this.getProjectList();
    this.editNote = this.navParams.get('editNote');
    if(this.editNote) {
      this.note=this.editNote;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNotePage');
  }
  ionViewDidEnter() {
    this.note.projects='';
  }
  onSelectChange(selectedValue: any) {
    console.log(selectedValue);
    if(selectedValue == 'addProject')  {
      this.navCtrl.push('AddProject');
    }
  }
  getProjectList() {
    this.projectService.getclientProject()
      .then(project => {
          this.zone.run(() => {
            this.projectList=project;
            console.log(this.projectList);
          });
      })
      .catch(console.error.bind(console));
  }
  validate(data)  {
    console.log(data);
    if(!data.title) {
      this.msgAlert.alertMessage('Info','Please fill the title');
      return false;
    }
    if(!data.desc) {
      this.msgAlert.alertMessage('Info','Please fill the description');
      return false;
    }
    return true;
  }
  saveNote()  {
    if(!this.validate(this.note)) {
      return;
    }
    this.noteSerivce.addNote(this.note)
      .then(res=>{
        this.navCtrl.pop();
      })
      .catch(console.error.bind(console));
  }
  editNotes(note)  {
    console.log(note);
    this.noteSerivce.editNote(note)
      .then(res=>{
        this.navCtrl.pop();
      })
      .catch(err=>{
        console.log(err);
      });
  }

}
