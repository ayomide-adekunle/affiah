import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpense } from './add-expense';

@NgModule({
  declarations: [
    AddExpense,
  ],
  imports: [
    IonicPageModule.forChild(AddExpense),
  ],
  exports: [
    AddExpense
  ]
})
export class AddExpenseModule {}
