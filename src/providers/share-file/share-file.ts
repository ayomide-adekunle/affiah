import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the ShareFileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ShareFileProvider {
  _db;
  _userFiles;

  constructor(public http: Http) {
    console.log('Hello ShareFileProvider Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userFiles.db', { adapter: 'cordova-sqlite' });
  }
   getFiles() {
    this.initiateDb();
    if (!this._userFiles) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {
                this._userFiles = docs.rows.map(row => {
                    return row.doc;
                });
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);
                return this._userFiles;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userFiles);
    }
   }
   private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userFiles, change.id);
    var files = this._userFiles[index];

    if (change.deleted) {
        if (files) {
            this._userFiles.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (files && files._id === change.id) {
            this._userFiles[index] = change.doc; // update
        } else {
            this._userFiles.splice(index, 0, change.doc) // insert
        }
    }
  }

  findWhere(fileId) {
    this.initiateDb();
    return this._db.get(fileId);
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

  deleteFile(file)  {
    this.initiateDb();
    return this._db.remove(file);
  }

  addFile(file) {
    this.initiateDb();
    //set date for data
    file.Date=new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    file._id=new Date();
    return this._db.put(file);
  }

  editFile(file)  {
    this.initiateDb();
    return this._db.put(file);
  }

}
