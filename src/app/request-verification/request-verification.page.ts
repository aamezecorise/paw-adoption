import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-request-verification',
  templateUrl: './request-verification.page.html',
  styleUrls: ['./request-verification.page.scss'],
})
export class RequestVerificationPage implements OnInit {

  constructor(private location: Location, private menuCtrl: MenuController) { }

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
