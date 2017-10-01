import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the BulkSms provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BulkSms {
  _db;
  _bulkSms;
  queryString:string = 'http://bulksms.themarketplace.ng/sendsms';

  constructor(public http: Http) {
    console.log('Hello BulkSms Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('bulkSms.db', { adapter: 'cordova-sqlite' });
  }
  getAllSms() {
    this.initiateDb();
    if (!this._bulkSms) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._bulkSms = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._bulkSms;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._bulkSms);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._bulkSms, change.id);
    var sms = this._bulkSms[index];

    if (change.deleted) {
        if (sms) {
            this._bulkSms.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (sms && sms._id === change.id) {
            this._bulkSms[index] = change.doc; // update
        } else {
            this._bulkSms.splice(index, 0, change.doc) // insert
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
  findWhere(smsId) {
    this.initiateDb();
    return this._db.get(smsId);
  }

  deleteSms(sms)  {
    return this._db.remove(sms)
  }
  
  addSms(sms) {
    //set date for data
    sms.Date=sms.sender+new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    sms._id=new Date();
    return this._db.put(sms);
  }
  editSms(sms)  {
    return this._db.put(sms);
  }
  sendSms(data) {
    // const body = JSON.stringify(data);
    // return this.http.post(url, body, {headers: headers}).map((data:Response) => data.json());
    return this.http.post(this.queryString,data).map((data:Response)=> data.json());
  }
  

}
