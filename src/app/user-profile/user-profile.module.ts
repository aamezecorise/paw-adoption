import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { AdoptLandingPage } from '../adopt-landing/adopt-landing.page';
import { UserProfilePage } from './user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserProfilePage],
})
export class UserProfilePageModule { }
