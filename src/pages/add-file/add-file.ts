import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {ClientService} from '../../providers/client-service';
import { EmailComposer } from '@ionic-native/email-composer';


/**
 * Generated class for the AddFilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-file',
  templateUrl: 'add-file.html',
})
export class AddFilePage {
  tabs_content = 'picture';
  icon='picture_black.svg';
  imgUrl;
  selectUrl;
  clientList;
  msg={}; 
  sendTo=[]; 

  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera,
  public imagePicker: ImagePicker,public clientService:ClientService,private alertCtrl: AlertController,
  private emailComposer: EmailComposer) {
    this.getClientList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFilePage');
  }
  onSegmentChange() {
    console.log(this.tabs_content);
    if(this.tabs_content =='bulk_sms') {
      this.navCtrl.push('BulksmsList',{},{animate: false});
    }
    switch(this.tabs_content) {
      case 'picture':
        this.icon = 'picture_black.svg'
        break;
      case 'video':
        this.icon = 'video_black.svg'
        break;
      case 'audio':
        this.icon = 'audio_black.svg'
        break;
      case 'select':
        this.icon = 'select_black.svg';
        break
      default:
        return;
    }
  }
  randomString(length) {
      return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  }
  shareFile(type)  {
    console.log(type);
    if(type=='picture_black.svg') {
      console.log('I\'m  taking new picture');
      var options: CameraOptions = {
        quality: 100
      }
      this.camera.getPicture(options).then((imageData) => {
        this.imgUrl=imageData;
        console.log(this.imgUrl);
      }, (err) => {
      console.log(err,'hello');
      });
    }
    if(type=='select_black.svg')  {
      console.log('I\'m selecting a picture');
      let options={maximumImagesCount:1}
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.selectUrl = results[i];
        }
      }, (err) => { 
        console.log(err);
      });
    }
  }
  getClientList() {
    this.clientService.getAllClients()
      .then(res=>{
          this.clientList=res;
      })
  }
  sendEmail(msg,type)  {
    console.log(msg,type);
    var attachment; var title; var desc;
    if(type=='camera')  {
      attachment = this.imgUrl;
      console.log(attachment)
      title = msg.title_camera;
      desc = msg.desc_camera;
    }
    if(type=='select')  {
      attachment = this.selectUrl;
      console.log(attachment);
      title = msg.title_select;
      desc = msg.desc_select;
    }
    let email = {
      to: 'admin@affiah.com',
      bcc: this.sendTo,
      attachments: attachment,
      subject: title,
      body: desc,
      isHtml: true
    };
    // Send a text message using default options
    this.emailComposer.open(email)
      .then(res=>{
        //alert(res);
      },err=>{
        //alert(err);
      })
  }
  onSelectChange(selectedValue: any) {
    if(selectedValue=='selectAll')  {
      selectedValue = this.clientList;
    }
    for ( var a in selectedValue) {
      this.sendTo.push(selectedValue[a].email);
    }
  }

}
