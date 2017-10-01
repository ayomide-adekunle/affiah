import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite'

/*
  Generated class for the ExpenseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ExpenseService {
  _db;
  _userExpense;

  constructor(public http: Http) {
    console.log('Hello ExpenseService Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userExpense.db', { adapter: 'cordova-sqlite' });
  }
  getAllExpenses() {
    this.initiateDb();
    if (!this._userExpense) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userExpense = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userExpense;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userExpense);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userExpense, change.id);
    var expense = this._userExpense[index];

    if (change.deleted) {
        if (expense) {
            this._userExpense.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (expense && expense._id === change.id) {
            this._userExpense[index] = change.doc; // update
        } else {
            this._userExpense.splice(index, 0, change.doc) // insert
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
  deleteExpense(expense)  {
    return this._db.remove(expense)
  }
  
  addExpense(expense) {
    //set date for data
    expense.Date=new Date();
    return this._db.put(expense);
  }
  editExpense(expense)  {
    return this._db.put(expense);
  }

}
