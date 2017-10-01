import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the LiabilityService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LiabilityService {
  _db;
  _userLiabilty;

  constructor(public http: Http) {
    console.log('Hello LiabilityService Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userLiabilty.db', { adapter: 'cordova-sqlite' });
  }
  getLiability() {
    this.initiateDb();
    if (!this._userLiabilty) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userLiabilty = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userLiabilty;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userLiabilty);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userLiabilty, change.id);
    var liability = this._userLiabilty[index];

    if (change.deleted) {
        if (liability) {
            this._userLiabilty.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (liability && liability._id === change.id) {
            this._userLiabilty[index] = change.doc; // update
        } else {
            this._userLiabilty.splice(index, 0, change.doc) // insert
        }
    }
  }
  private findIndex(array, id) {  
      var low = 0, high = array.length, mid;
      while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
  }

  deleteLiability(liability)  {
    return this._db.remove(liability)
  }
  
  addLiability(liability) {
    //set date for data
    liability.Date=new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    liability._id=new Date();
    return this._db.put(liability);
  }
  editLiability(liability)  {
    return this._db.put(liability);
  }
  findWhere(liabilityId) {
    this.initiateDb();
    return this._db.get(liabilityId);
  }

}
