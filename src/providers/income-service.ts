import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the IncomeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class IncomeService {
   _db;
  _userIncome;

  constructor(public http: Http) {
    console.log('Hello IncomeService Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userIncome.db', { adapter: 'cordova-sqlite' });
  }

  getIncome() {
    this.initiateDb();
    if (!this._userIncome) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userIncome = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userIncome;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userIncome);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userIncome, change.id);
    var income = this._userIncome[index];

    if (change.deleted) {
        if (income) {
            this._userIncome.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (income && income._id === change.id) {
            this._userIncome[index] = change.doc; // update
        } else {
            this._userIncome.splice(index, 0, change.doc) // insert
        }
    }
  }
  findWhere(incomeId) {
    this.initiateDb();
    return this._db.get(incomeId);
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
  deleteIncome(income)  {
    this.initiateDb();
    return this._db.remove(income)
  }
  
  addIncome(income) {
    this.initiateDb();
    //set date for data
    income.Date=new Date();
    return this._db.put(income);
  }
  editIncome(income)  {
    this.initiateDb();
    return this._db.put(income);
  }

}
