import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpTopics } from './help-topics';

@NgModule({
  declarations: [
    HelpTopics,
  ],
  imports: [
    IonicPageModule.forChild(HelpTopics),
  ],
  exports: [
    HelpTopics
  ]
})
export class HelpTopicsModule {}
