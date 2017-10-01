import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Income } from './income';

@NgModule({
  declarations: [
    Income,
  ],
  imports: [
    IonicPageModule.forChild(Income),
  ],
  exports: [
    Income
  ]
})
export class IncomeModule {}
