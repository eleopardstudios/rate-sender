import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyRatePage } from './daily-rate';

@NgModule({
  declarations: [
    DailyRatePage,
  ],
  imports: [
    IonicPageModule.forChild(DailyRatePage),
  ],
})
export class DailyRatePageModule {}
