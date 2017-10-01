import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BulksmsList } from './bulksms-list';

@NgModule({
  declarations: [
    BulksmsList,
  ],
  imports: [
    IonicPageModule.forChild(BulksmsList),
  ],
  exports: [
    BulksmsList
  ]
})
export class BulksmsListModule {}
