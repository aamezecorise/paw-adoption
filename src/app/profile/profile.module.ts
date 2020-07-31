import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatDividerModule,
  MatToolbarModule,
  MatSelectModule,
} from '@angular/material';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
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
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
