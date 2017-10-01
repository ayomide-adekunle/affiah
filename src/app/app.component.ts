import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,MenuController,ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';
import { ExitAppHandler } from '../providers/exit-app-handler';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
 public user_data=[];
  

  rootPage;
  //rootPage: any = Register;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private authservice: AuthService, private exitHandler: ExitAppHandler, public toastCtrl:ToastController,
  public menuCtrl: MenuController) {
  //set exitApp to false
  this.exitHandler.setExitApp(false);
  this.initializeApp();

  // used for an example of ngFor and navigation
  this.pages = [
    { title: 'Home', component: 'HomePage' }
  ];

}
   toastMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      dismissOnPageChange: true,
      position:'bottom',
      duration: 3000
    });
    toast.present();
   }
   myHandlerFunction(){
    if(this.menuCtrl.isOpen()){
       this.menuCtrl.close();
       return;
    }
    if(this.nav.canGoBack()){
      this.nav.pop();
    }
    else {
      if(! this.exitHandler.rExitApp()) {
       this.toastMessage('Press back again to confirm exit');
       this.exitHandler.setExitApp(true);
      }
      else  {
        this.platform.exitApp();
      }
    }
   }
   initializeApp() {
    //Go to home page if user is logged in
    this.platform.ready().then(() => {
       this.platform
       .registerBackButtonAction(()=> this.myHandlerFunction());
      
      this.authservice.getUser().then( data =>{
        this.user_data=data;
        if(this.user_data.length>0)  {
       // console.log(this.user_data,'here,here');
        this.rootPage='HomePage';
        //this.rootPage=AccountSetup;
      }
      else{
        this.rootPage='WalkThrough';
        //this.rootPage=AccountSetup;
      }
      });   

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#2f64ff");
      this.splashScreen.hide();
    });
   }

   openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
   }
   logout(){
    this.rootPage='Register';
    this.authservice.deleteUser(this.user_data[0]);
   }
}
