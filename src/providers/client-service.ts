import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the ClientService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ClientService {
  _db;
  _userClient;

  constructor(public http: Http) {
    console.log('Hello ClientService Provider');
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userClients.db', { adapter: 'cordova-sqlite' });
  }
  getAllClients() {
    this.initiateDb();
    if (!this._userClient) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userClient = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userClient;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userClient);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userClient, change.id);
    var client = this._userClient[index];

    if (change.deleted) {
        if (client) {
            this._userClient.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (client && client._id === change.id) {
            this._userClient[index] = change.doc; // update
        } else {
            this._userClient.splice(index, 0, change.doc) // insert
        }
    }
  }
  findWhere(clientId) {
    this.initiateDb();
    return this._db.get(clientId);
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
  deleteClient(client)  {
    return this._db.remove(client)
  }
  
  addClient(client) {
    //set date for data
    client.Date=client.company+new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    client._id=new Date();
    return this._db.put(client);
  }
  editClient(client)  {
    return this._db.put(client);
  }

}
