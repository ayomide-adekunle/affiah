import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the PouchService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PouchService {
  private _db;
  private _data;
  constructor(public http: Http) {
    console.log('Hello PouchService Provider');
  }

  //Initialize database to hold user's info when logged in
  initDB(db_name) {
    PouchDB.plugin(cordovaSqlitePlugin);
    return this._db = new PouchDB(db_name+'.db', { adapter: 'cordova-sqlite' });
  }
  //Save  Data
  addData(data,db) {
    data.Date=new Date(); 
    return db.put(data);
  }
  //Delete data
  deleteData(data,db) {  
    return db.remove(data);
  }


  getAll(db) {  
    if (!this._data) {
        return db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects

                this._data = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    
                    return row.doc;
                });

                // Listen for changes on the database.
                db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._data;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._data);
    }
  }

  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._data, change.id);
    var user = this._data[index];

    if (change.deleted) {
        if (user) {
            this._data.splice(index, 1); // delete
        }
    } else {
        // var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);

        console.log(change.doc);
        // change.doc.trackDate=new Date().toString();
        // change.doc.Date = new Date().toString();
        console.log(change.doc.Date);
        if (user && user._id === change.id) {
            this._data[index] = change.doc; // update
        } else {
            this._data.splice(index, 0, change.doc) // insert
        }
    }
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

}
