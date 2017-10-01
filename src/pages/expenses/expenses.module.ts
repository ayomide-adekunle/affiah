import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Expenses } from './expenses';

@NgModule({
  declarations: [
    Expenses,
  ],
  imports: [
    IonicPageModule.forChild(Expenses),
  ],
  exports: [
    Expenses
  ]
})
export class ExpensesModule {}
