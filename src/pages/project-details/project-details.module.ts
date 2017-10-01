import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectDetails } from './project-details';

@NgModule({
  declarations: [
    ProjectDetails,
  ],
  imports: [
    IonicPageModule.forChild(ProjectDetails),
  ],
  exports: [
    ProjectDetails
  ]
})
export class ProjectDetailsModule {}
