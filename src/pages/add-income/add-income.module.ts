import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddIncome } from './add-income';

@NgModule({
  declarations: [
    AddIncome,
  ],
  imports: [
    IonicPageModule.forChild(AddIncome),
  ],
  exports: [
    AddIncome
  ]
})
export class AddIncomeModule {}
