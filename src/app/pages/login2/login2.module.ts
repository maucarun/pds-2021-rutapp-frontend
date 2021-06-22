import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Login2PageRoutingModule } from './login2-routing.module';
import { Login2Component } from './login2.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Login2PageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [Login2Component]
})
export class Login2PageModule {}
