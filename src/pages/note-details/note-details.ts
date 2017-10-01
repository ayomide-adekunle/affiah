import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';
import {NotesServiceProvider} from '../../providers/notes-service/notes-service';

/**
 * Generated class for the NoteDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-note-details',
  templateUrl: 'note-details.html',
})
export class NoteDetailsPage {
  noteInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,public noteService:NotesServiceProvider) 
  {
   this.noteInfo= this.navParams.get('noteInfo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
  }
  deleteNote(note)  {
    let deleteAlert = this.alertCtrl.create({
    title: 'Delete ?',
    message: 'Do you want delete '+'\''+note.title +'\''+' ?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Accept',
        handler: () => {
          console.log(note);
          this.noteService.findWhere(note._id)
          .then(note=>{
            this.noteService.deleteNote(note)
            .then(res=>{
              this.navCtrl.pop();
            })
          })
        }
      }
    ]
    });
    deleteAlert.present();
  }

  editNote(note)  {
    let editAlert = this.alertCtrl.create({
    title: 'Edit ',
    message: 'Do you want edit '+'\''+note.title +'\''+' ?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Accept',
        handler: () => {
          this.navCtrl.push('AddNotePage',{editNote:note});
        }
      }
    ]
    });
    editAlert.present();
  }

}
