import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteNewPageRoutingModule } from './cliente-new-routing.module';

import { ClienteNewPage } from './cliente-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClienteNewPageRoutingModule
  ],
  declarations: [ClienteNewPage]
})
export class ClienteNewPageModule {}
