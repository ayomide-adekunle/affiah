import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PresentReport page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-present-report',
  templateUrl: 'present-report.html',
})
export class PresentReport {
  reportData
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let data=this.navParams.get('report');
    this.reportData=this.ConvertToCSV(data)
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresentReport');
  }
  ConvertToCSV(objArray) {
    var a =0
    console.log(objArray);
    var str = 'Date'+' '.repeat(9)+'Income (#) '+' '.repeat(3)+'Expenses (#)'+'\n\n' ;
    while ( a < objArray.labels.length)  {
      // for(var index in objArray[a]) {
      //   str += objArray[a][index] + '\r\n\n';
      // }
      var len=objArray.income[a].toString().length;
  
      str+=objArray.labels[a] + "   "+ objArray.income[a]+ ' '.repeat(14-parseInt(len)) + objArray.expenses[a]+'\n\n';
      a++;
    }

    console.log(str);
    return str;
   
  }

}
