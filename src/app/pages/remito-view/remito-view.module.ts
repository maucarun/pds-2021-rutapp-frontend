import { ComponentsModule } from './../../component/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RemitoViewPageRoutingModule } from './remito-view-routing.module';
import { RemitoViewPage } from './remito-view.page';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    IonicModule,
    RemitoViewPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RemitoViewPage]
})
export class RemitoViewPageModule { }
