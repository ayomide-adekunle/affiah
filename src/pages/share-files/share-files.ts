import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ShareFileProvider} from '../../providers/share-file/share-file';

/**
 * Generated class for the ShareFilesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-share-files',
  templateUrl: 'share-files.html',
})
export class ShareFilesPage {
   //make the footer to default to bulk sms
  tabs_content = 'share_files';
  allfile = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public sharefile : ShareFileProvider) 
  {
    this.getFileList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareFilesPage');
  }
  onSegmentChange() {
    console.log(this.tabs_content);
    if(this.tabs_content =='bulk_sms') {
      this.navCtrl.push('BulksmsList',{},{animate: false});
    }  
  }
  goHome() {
    this.navCtrl.setRoot('HomePage');
  }
  getFileList() {
    this.sharefile.getFiles()
      .then(files=>{
        this.allfile = files;
        console.log(this.allfile,'all file');
      })
  }
  shareFile() {
    this.navCtrl.push('AddFilePage');
  }

}
