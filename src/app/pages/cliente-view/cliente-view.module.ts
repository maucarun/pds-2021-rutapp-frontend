import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteViewPageRoutingModule } from './cliente-view-routing.module';

import { ClienteViewPage } from './cliente-view.page';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule,
    ClienteViewPageRoutingModule,
      AgmCoreModule
  ],
  declarations: [ClienteViewPage]
})
export class ClienteViewPageModule {}
