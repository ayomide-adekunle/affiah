import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInvoice } from './add-invoice';

@NgModule({
  declarations: [
    AddInvoice,
  ],
  imports: [
    IonicPageModule.forChild(AddInvoice),
  ],
  exports: [
    AddInvoice
  ]
})
export class AddInvoiceModule {}
