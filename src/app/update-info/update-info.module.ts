import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdateInfoPage } from './update-info.page';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  {
    path: '',
    component: UpdateInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [UpdateInfoPage]
})
export class UpdateInfoPageModule {}
