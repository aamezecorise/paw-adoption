import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdateSocialUserPage } from './update-social-user.page';
import { MaterialModule } from '../material.module';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  {
    path: '',
    component: UpdateSocialUserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HttpModule,
    MaterialModule
  ],
  declarations: [UpdateSocialUserPage]
})
export class UpdateSocialUserPageModule {}
