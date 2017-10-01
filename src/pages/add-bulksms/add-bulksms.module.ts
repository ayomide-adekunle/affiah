import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBulkSms } from './add-bulksms';

@NgModule({
  declarations: [
    AddBulkSms,
  ],
  imports: [
    IonicPageModule.forChild(AddBulkSms),
  ],
  exports: [
    AddBulkSms
  ]
})
export class AddBulkSmsModule {}
