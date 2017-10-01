import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProject } from './add-project';

@NgModule({
  declarations: [
    AddProject,
  ],
  imports: [
    IonicPageModule.forChild(AddProject),
  ],
  exports: [
    AddProject
  ]
})
export class AddProjectModule {}
