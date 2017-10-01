import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientDetails } from './client-details';

@NgModule({
  declarations: [
    ClientDetails,
  ],
  imports: [
    IonicPageModule.forChild(ClientDetails),
  ],
  exports: [
    ClientDetails
  ]
})
export class ClientDetailsModule {}
