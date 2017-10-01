import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NotesServiceProvider} from '../../providers/notes-service/notes-service';

/**
 * Generated class for the NotesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  tabs_content = 'notes';
  noteList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public noteService:NotesServiceProvider,private zone:NgZone) {
    this.getNoteList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }
  onSegmentChange() {
    if(this.tabs_content=='clients') {
      this.navCtrl.push('ClientList',{},{animate: false});
    }
    if(this.tabs_content=='bulk_sms') {
      this.navCtrl.push('BulksmsList',{},{animate: false});
      //remove the previous view from the stack when back button is pressed on Android
      this.navCtrl.remove(this.navCtrl.length()-1);
    }
    if(this.tabs_content=='finances') {
        this.navCtrl.push('Income',{},{animate: false});
      }
   if(this.tabs_content=='projects')  {
    this.navCtrl.push('ProjectList',{},{animate:false});
   }
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  getNoteList() {
    this.noteService.getNotes()
      .then(notes=>{
        this.zone.run(() => {
              this.noteList = notes;
              console.log(this.noteList,'note list');
          });
        
      })
  }
  addNote() {
    this.navCtrl.push('AddNotePage');
  }
  noteDetails(note) {
    this.navCtrl.push('NoteDetailsPage',{noteInfo:note});
  }

}
