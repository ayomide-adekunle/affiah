import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountSetup } from './account-setup';

@NgModule({
  declarations: [
    AccountSetup,
  ],
  imports: [
    IonicPageModule.forChild(AccountSetup),
  ],
  exports: [
    AccountSetup
  ]
})
export class AccountSetupModule {}
