import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseDetails } from './expense-details';

@NgModule({
  declarations: [
    ExpenseDetails,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseDetails),
  ],
  exports: [
    ExpenseDetails
  ]
})
export class ExpenseDetailsModule {}
