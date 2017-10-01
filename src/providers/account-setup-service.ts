import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';



/*
  Generated class for the AccountSetup provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AccountSetupService {
  _db;
  _userAccount;

  constructor(public http: Http) {
    console.log('Hello AccountSetup Provider');
  }
 
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    };
   
    this._db = new PouchDB('userAccount.db', { adapter: 'cordova-sqlite' });
  }
  
  getAccountDetails() {
      this.initiateDb();
    if (!this._userAccount) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userAccount = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userAccount;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userAccount);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userAccount, change.id);
    var account = this._userAccount[index];

    if (change.deleted) {
        if (account) {
            this._userAccount.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (account && account._id === change.id) {
            this._userAccount[index] = change.doc; // update
        } else {
            this._userAccount.splice(index, 0, change.doc) // insert
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

  // deleteAccount(account)  {
  //   this.pouchService.deleteData(account,this.initiateDb());
  // }
  deleteAccount(account)  {
    return this._db.remove(account)
  }
  // addAccount(account) {
  //   this.pouchService.addData(account,this.initiateDb());
  // }
  addAccount(account) {
    //set date for data
    account.Date=new Date();
    return this._db.put(account);
  }
  editAccount(account)  {
    return this._db.put(account);
  }

}
