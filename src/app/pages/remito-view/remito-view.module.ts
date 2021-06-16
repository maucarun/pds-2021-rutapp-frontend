import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RemitoViewPageRoutingModule } from './remito-view-routing.module';
import { RemitoViewPage } from './remito-view.page';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule,
    RemitoViewPageRoutingModule
  ],
  declarations: [RemitoViewPage]
})
export class RemitoViewPageModule { }
