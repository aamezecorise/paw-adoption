import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage implements OnInit {

  constructor(private location: Location,private menuCtrl: MenuController) { }

  ngOnInit() {
  }
  navigateBack() {
    this.location.back();
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true)
  }
}
