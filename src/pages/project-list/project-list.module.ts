import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectList } from './project-list';

@NgModule({
  declarations: [
    ProjectList,
  ],
  imports: [
    IonicPageModule.forChild(ProjectList),
  ],
  exports: [
    ProjectList
  ]
})
export class ProjectListModule {}
