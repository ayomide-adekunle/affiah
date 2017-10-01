import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//Components
import { MyApp } from './app.component';

//Services 
import { AuthService} from '../providers/auth-service';
import { AccountSetupService} from '../providers/account-setup-service';
import { ClientService} from '../providers/client-service';
import { ProjectService} from '../providers/project-service';
import { BulkSms} from '../providers/bulk-sms';
import { IncomeService} from '../providers/income-service';
import {LiabilityService} from '../providers/liability-service';
import {AssetService} from '../providers/asset-service';
import {ExpenseService} from '../providers/expense-service';
import {InvoiceService} from '../providers/invoice-service';
import {ReportService}   from '../providers/report-service';
import {ExitAppHandler} from '../providers/exit-app-handler';
import { File } from '@ionic-native/file';
import { Camera} from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { EmailComposer } from '@ionic-native/email-composer';




import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShareFileProvider } from '../providers/share-file/share-file';
import { NotesServiceProvider } from '../providers/notes-service/notes-service';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,SplashScreen,AuthService,
    AccountSetupService,ClientService,
    ProjectService,BulkSms,IncomeService,
    LiabilityService,AssetService,ExpenseService,
    InvoiceService,ReportService,ExitAppHandler,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareFileProvider,NotesServiceProvider,
    File,Camera,ImagePicker,EmailComposer,
    AlertServiceProvider
  ]
})
export class AppModule {}
