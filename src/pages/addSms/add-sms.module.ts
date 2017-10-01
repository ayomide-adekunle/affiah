import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSMS } from './add-sms';

@NgModule({
  declarations: [
    AddSMS,
  ],
  imports: [
    IonicPageModule.forChild(AddSMS),
  ],
  exports: [
    AddSMS
  ]
})
export class AddSmsModule {}
