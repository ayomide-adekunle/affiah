import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeDetails } from './income-details';

@NgModule({
  declarations: [
    IncomeDetails,
  ],
  imports: [
    IonicPageModule.forChild(IncomeDetails),
  ],
  exports: [
    IncomeDetails
  ]
})
export class IncomeDetailsModule {}
