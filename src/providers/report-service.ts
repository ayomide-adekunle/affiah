import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
declare var cordova:any;



/*
  Generated class for the ReportService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ReportService {

  constructor(public http: Http) {
    console.log('Hello ReportService Provider');
  }
  generateReport(user,date,data,income,expense)  {
    var a =0;
    var table_content='';
    while ( a < data.labels.length)  {
      table_content+=`<tr><td>${data.labels[a]}</td><td>${this.formatNumber(data.income[a])}</td>
      <td>${this.formatNumber(data.expenses[a])}</td></tr>`;
      a++;
     }
    const before = Date.now();
    document.addEventListener('deviceready', () => {
        console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');
        //  message = `Payment Alert!: 
        // Dear ${this.data.firstName} ${this.data.lastName} IGR Payment Successful.
        // PaymentCode ${data["paymentID"]}.
        // Time: ${trandate}`;
        var header=`<html> <head>
                      <style>
                      table, th, td {
                          border: 1px solid black;
                          border-collapse: collapse;
                      }
                      th, td {
                          padding: 5px;
                          text-align:center;
                      }
                      </style>
                  </head>
                  <h2 style="text-align:center">${user.biz_name}<br/> Profit and Loss Account <br/>
                  From &nbsp;${date.from}&nbsp; to &nbsp; ${date.to} </h2> </html>`;
        var content=`<table style="width:100%"><tr><th>Date</th><th>Income (&#8358;)</th><th>Expenses (&#8358;)</th></tr>'${table_content}
                  <tr><td>Total</td><td>${income}</td><td>${expense}</td></tr></table>`;
        //generate the pdf. 
        cordova.plugins.pdf.htmlToPDF({
                data:header +content,
                documentSize: "A4",
                landscape: "portrait",
                type: "share" //use share to open the open-with-menu. 
                //url: "www.cloud.org/template.html" 
            },
            (sucess) => console.log('sucess: ', sucess),
            (error) => console.log('error:', error));
    });
  }
  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}
