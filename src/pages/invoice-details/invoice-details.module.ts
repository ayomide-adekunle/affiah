import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoiceDetails } from './invoice-details';

@NgModule({
  declarations: [
    InvoiceDetails,
  ],
  imports: [
    IonicPageModule.forChild(InvoiceDetails),
  ],
  exports: [
    InvoiceDetails
  ]
})
export class InvoiceDetailsModule {}
