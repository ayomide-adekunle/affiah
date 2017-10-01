import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the ProjectService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotesServiceProvider {
  _db;
  _userNotes;

  constructor(public http: Http) {
    console.log('Hello ProjectService Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userNotes.db', { adapter: 'cordova-sqlite' });
  }
   getNotes() {
    this.initiateDb();
    if (!this._userNotes) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {
                this._userNotes = docs.rows.map(row => {
                    return row.doc;
                });
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);
                return this._userNotes;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userNotes);
    }
   }
   private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userNotes, change.id);
    var notes = this._userNotes[index];

    if (change.deleted) {
        if (notes) {
            this._userNotes.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (notes && notes._id === change.id) {
            this._userNotes[index] = change.doc; // update
        } else {
            this._userNotes.splice(index, 0, change.doc) // insert
        }
    }
  }

  findWhere(noteId) {
    this.initiateDb();
    return this._db.get(noteId);
  }

   // Binary search, the array is by default sorted by _id.
  private findIndex(array, id) {  
      var low = 0, high = array.length, mid;
      while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
  }

  deleteNote(note)  {
    this.initiateDb();
    return this._db.remove(note);
  }

  addNote(note) {
    this.initiateDb();
    //set date for data
    note.Date=note.title+new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    note._id=new Date();
    return this._db.put(note);
  }

  editNote(note)  {
    this.initiateDb();
    return this._db.put(note);
  }

}

