import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientList } from './client-list';

@NgModule({
  declarations: [
    ClientList,
  ],
  imports: [
    IonicPageModule.forChild(ClientList),
  ],
  exports: [
    ClientList
  ]
})
export class ClientListModule {}
