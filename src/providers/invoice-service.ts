import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';  
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import {ClientService} from './client-service';
import {AuthService} from './auth-service';
declare var cordova:any;

/*
  Generated class for the SmsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class InvoiceService {
   _db;
  _userInvoice;
  invoiceHeader;
  constructor(public http: Http, public clientService: ClientService,
              public authService:AuthService )
  {
    this.invoiceHeader=`<!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>A simple, clean, and responsive HTML invoice template</title>
                
                <style>
                .invoice-box{
                    max-width:800px;
                    margin:auto;
                    padding:30px;
                    border:1px solid #eee;
                    box-shadow:0 0 10px rgba(0, 0, 0, .15);
                    font-size:16px;
                    line-height:24px;
                    font-family:'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    color:#555;
                }
                
                .invoice-box table{
                    width:100%;
                    line-height:inherit;
                    text-align:left;
                }
                
                .invoice-box table td{
                    padding:5px;
                    vertical-align:top;
                }
                
                .invoice-box table tr td:nth-child(2){
                    text-align:right;
                }
                
                .invoice-box table tr.top table td{
                    padding-bottom:20px;
                }
                
                .invoice-box table tr.top table td.title{
                    font-size:45px;
                    line-height:45px;
                    color:#333;
                }
                
                .invoice-box table tr.information table td{
                    padding-bottom:40px;
                }
                
                .invoice-box table tr.heading td{
                    background:#eee;
                    border-bottom:1px solid #ddd;
                    font-weight:bold;
                }
                
                .invoice-box table tr.details td{
                    padding-bottom:20px;
                }
                
                .invoice-box table tr.item td{
                    border-bottom:1px solid #eee;
                }
                
                .invoice-box table tr.item.last td{
                    border-bottom:none;
                }
                
                .invoice-box table tr.total td:nth-child(2){
                    border-top:2px solid #eee;
                    font-weight:bold;
                }
                
                @media only screen and (max-width: 600px) {
                    .invoice-box table tr.top table td{
                        width:100%;
                        display:block;
                        text-align:center;
                    }
                    
                    .invoice-box table tr.information table td{
                        width:100%;
                        display:block;
                        text-align:center;
                    }
                }
                </style>
            </head>`
  }
  initiateDb(){
    try { PouchDB.plugin(cordovaSqlitePlugin);}
    catch(e){
        console.log('SQLite works only on device')
    }; 
    this._db = new PouchDB('userInvoice.db', { adapter: 'cordova-sqlite' });
  }
  getInvoice() {
    this.initiateDb();
    if (!this._userInvoice) {
        return this._db.allDocs({ include_docs: true})
            .then(docs => {

                // Each row has a .doc object and we just want to send an 
                // array of birthday objects back to the calling controller,
                // so let's map the array to contain just the .doc objects.

                this._userInvoice = docs.rows.map(row => {
                    // Dates are not automatically converted from a string.
                    //row.doc.Date = new Date(row.doc.Date);
                    return row.doc;
                });

                // Listen for changes on the database.
                this._db.changes({ live: true, since: 'now', include_docs: true})
                    .on('change', this.onDatabaseChange);

                return this._userInvoice;
            });
    } else {
        // Return cached data as a promise
        return Promise.resolve(this._userInvoice);
    }
  }
  private onDatabaseChange = (change) => {  
    var index = this.findIndex(this._userInvoice, change.id);
    var invoice = this._userInvoice[index];

    if (change.deleted) {
        if (invoice) {
            this._userInvoice.splice(index, 1); // delete
        }
    } else {
        change.doc.Date = new Date(change.doc.Date);
        if (invoice && invoice._id === change.id) {
            this._userInvoice[index] = change.doc; // update
        } else {
            this._userInvoice.splice(index, 0, change.doc) // insert
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
  deleteInvoice(invoice)  {
    return this._db.remove(invoice)
  }
  
  addInvoice(invoice) {
    this.initiateDb();
    //set date for data
    invoice.Date=new Date();
    // _id is used by PouchDB to sort data, so our data is sorted by date
    invoice._id=new Date();
    return this._db.put(invoice);
  }
  editInvoice(invoice)  {
    this.initiateDb();
    return this._db.put(invoice);
  }
  printInvoice(invoice)  {
    this.clientService.findWhere(invoice.project.clientId)
        .then(client=>{
            this.authService.getUser()
                .then(user=>{
                      console.log(user);
                      let tableHead = `<body>
                            <div class="invoice-box">
                                <table cellpadding="0" cellspacing="0">
                                    <tr class="top">
                                        <td colspan="2">
                                            <table>
                                                <tr>
                                                    <td class="title">
                                                        <img src="http://imaginebusiness.com.ng/img/imagine-logo.png" style="width:100%; max-width:300px;">
                                                    </td>
                                                    
                                                    <td>
                                                        Invoice #: ${invoice.id}<br>
                                                        Created: ${invoice.start_date}<br>
                                                        Due Date: ${invoice.end_date}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                        </tr>`;
                      let infoHeader = `<tr class="information">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                           ${user[0].fullname}<br/>
                                           ${user[0].biz_name}
                                        </td>
                                        
                                        <td>
                                            ${client.company}<br> 
                                            ${client.address}<br>
                                            ${client.contact}<br>
                                            ${client.email}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>`
                      let rowHeader = `<tr class="heading">

                                        <td>
                                            Product/Service
                                        </td>
                                        <td>
                                            Price(&#8358;)
                                        </td>
                                    </tr>`;

                      let item = `<tr class="item">
                                <td>
                                ${invoice.project.name}
                                </td>
                                
                                <td>
                                    ${this.formatNumber(invoice.project.amount)}
                                </td>
                            </tr>`

                      let footer = `<tr class="total">
                            <td></td>
                            <td>
                            Total: ${this.formatNumber(invoice.project.amount)}
                            </td>
                        </tr>
                        </table>
                        </div>
                        </body>
                        </html>`;

                      //generate the pdf. 
                      document.addEventListener('deviceready', () => {
                        cordova.plugins.pdf.htmlToPDF({
                                data: this.invoiceHeader+tableHead +infoHeader+rowHeader+item+footer,
                                documentSize: "A4",
                                landscape: "portrait",
                                type: "share" //use share to open the open-with-menu. 
                                //url: "www.cloud.org/template.html" 
                            },
                            (sucess) => console.log('sucess: ', sucess),
                            (error) => console.log('error:', error));
                        });   
            
                })
          
        })

  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
