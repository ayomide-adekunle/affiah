import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFilePage } from './add-file';

@NgModule({
  declarations: [
    AddFilePage,
  ],
  imports: [
    IonicPageModule.forChild(AddFilePage),
  ],
  exports: [
    AddFilePage
  ]
})
export class AddFilePageModule {}
