import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalkThrough } from './walk-through';

@NgModule({
  declarations: [
    WalkThrough,
  ],
  imports: [
    IonicPageModule.forChild(WalkThrough),
  ],
  exports: [
    WalkThrough
  ]
})
export class WalkThroughModule {}
