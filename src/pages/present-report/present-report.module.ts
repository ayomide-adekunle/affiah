import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PresentReport } from './present-report';

@NgModule({
  declarations: [
    PresentReport,
  ],
  imports: [
    IonicPageModule.forChild(PresentReport),
  ],
  exports: [
    PresentReport
  ]
})
export class PresentReportModule {}
