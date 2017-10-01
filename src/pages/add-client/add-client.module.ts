import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClient } from './add-client';

@NgModule({
  declarations: [
    AddClient,
  ],
  imports: [
    IonicPageModule.forChild(AddClient),
  ],
  exports: [
    AddClient
  ]
})
export class AddClientModule {}
