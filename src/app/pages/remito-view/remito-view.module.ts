import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RemitoViewPageRoutingModule } from './remito-view-routing.module';
import { RemitoViewPage } from './remito-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemitoViewPageRoutingModule
  ],
  declarations: [RemitoViewPage]
})
export class RemitoViewPageModule { }
