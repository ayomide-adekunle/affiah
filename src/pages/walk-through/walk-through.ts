import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';

/**
 * Generated class for the WalkThrough page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-walk-through',
  templateUrl: 'walk-through.html',
})
export class WalkThrough {
  slideIndex:number;
  text1_build:String=' Affiah is a business workflow management that helps owners to keep accurate record of business dealings and provide them business performance reports.';
  text1:String="";
  text2_build:String='Customize balance summaries on a weekly, monthly or yearly basis.';
  text2:String="";
  text3_build:String='Manage clients contact information plus project details in one place.'; 
  text3:String="";
  text4_build:String='Keep track of the income and expenses in your account.'; 
  text4:String="";
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    setInterval(() => { // <=== 
        if (this.text1.length != this.text1_build.length) {
        this.text1+=this.text1_build[this.text1.length];
      }
      else{
        return;
      }
      }, 50)
  }

  loadText2() {
    setInterval(() => { // <=== 
        if (this.text2.length != this.text2_build.length) {
        this.text2+=this.text2_build[this.text2.length];
      }
      else{
        return;
      }
      }, 50)
  }
  loadText3() {
    setInterval(() => { // <=== 
        if (this.text3.length != this.text3_build.length) {
        this.text3+=this.text3_build[this.text3.length];
      }
      else{
        return;
      }
      }, 50)
  }
  loadText4() {
    setInterval(() => { // <=== 
        if (this.text4.length != this.text4_build.length) {
        this.text4+=this.text4_build[this.text4.length];
      }
      else{
        return;
      }
      }, 50)
  }
 

  continue()  {
    this.navCtrl.setRoot('Register');
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.slideIndex=currentIndex;
    if(this.slideIndex==0)  {
      this.slides.lockSwipeToPrev(true);
    }
    else{
       this.slides.lockSwipeToPrev(false);
    }
    if(this.slideIndex==3)  {
      this.slides.lockSwipeToNext(true);
    }
    else{
       this.slides.lockSwipeToNext(false);
    }
    if(this.slideIndex==1){
      this.loadText2();
    }
    if(this.slideIndex==2){
      this.loadText3();
    }
    if(this.slideIndex==3){
      this.loadText4();
    }
   
    console.log("Current index is", currentIndex);
  }
  nextSlide() {
    this.slides.slideNext();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkThrough');
  }

}
