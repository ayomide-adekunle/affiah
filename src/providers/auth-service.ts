import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';


/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  url:string = 'http://mtn-sme-api.imaginebusiness.ng/users';
  _db;
  authDb;
  _userInfo;

  constructor(public http: Http) {
    console.log('Hello AuthService Provider');
    
  }
 initiateDb() {
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
     };
    this._db = new PouchDB('userInfo.db', { adapter: 'cordova-sqlite' });
  }
  
  getUser() {
    this.initiateDb();
    if (!this._userInfo) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {
                this._userInfo = docs.rows.map(row => {
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userInfo;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userInfo);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userInfo, change.id);
    var user = this._userInfo[index];

    if (change.deleted) {
        if (user) {
            this._userInfo.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (user && user._id === change.id) {
            this._userInfo[index] = change.doc; // update
        } else {
            this._userInfo.splice(index, 0, change.doc) // insert
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
  
  deleteUser(user)  {
    this.initiateDb();
    return this._db.remove(user)
  }

  addUser(user) {
    this.initiateDb();
    //set date for data
    user.Date=new Date();
    return this._db.put(user);
  }
  
  login(data){
    let queryString=this.url+'/login';
    const body = JSON.stringify(data);
    // return this.http.post(url, body, {headers: headers}).map((data:Response) => data.json());
    return this.http.post(queryString,body).map((data:Response)=> data.json());
  }
  register(data){
    let queryString=this.url;
    const body = JSON.stringify(data);
    // return this.http.post(url, body, {headers: headers}).map((data:Response) => data.json());
    return this.http.post(queryString,body).map((data:Response)=> data.json());
  }

}
