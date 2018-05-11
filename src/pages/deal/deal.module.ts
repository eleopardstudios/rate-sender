import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { DealPage } from './deal';

@NgModule({
  declarations: [
    DealPage,
  ],
  providers: [
    DatePipe
  ],
  imports: [
    IonicPageModule.forChild(DealPage),
  ],
})
export class DealPageModule {}
