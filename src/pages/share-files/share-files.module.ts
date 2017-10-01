import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareFilesPage } from './share-files';

@NgModule({
  declarations: [
    ShareFilesPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareFilesPage),
  ],
  exports: [
    ShareFilesPage
  ]
})
export class ShareFilesPageModule {}
