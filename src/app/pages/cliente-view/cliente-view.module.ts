import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteViewPageRoutingModule } from './cliente-view-routing.module';

import { ClienteViewPage } from './cliente-view.page';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule,
    ClienteViewPageRoutingModule
  ],
  declarations: [ClienteViewPage]
})
export class ClienteViewPageModule {}
