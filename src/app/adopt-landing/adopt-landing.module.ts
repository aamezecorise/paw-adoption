import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { IonicModule } from '@ionic/angular';

import { AdoptLandingPage } from './adopt-landing.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptLandingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragDropModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdoptLandingPage],
})
export class AdoptLandingPageModule {}
