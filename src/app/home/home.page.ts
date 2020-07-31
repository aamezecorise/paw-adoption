import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('slides') slides: any;
  slidesArray: any = [];
  sliderOpts = {
    autoplay: true,
    loop: true,
    speed: 500,
    duration: 15000
  };
  image1: any;
  image2: any;
  image3: any;
  activeIndex = 1;
  constructor(public router: Router, public statusBar: StatusBar,
    private nativePageTransitions: NativePageTransitions) {
    this.statusBar.backgroundColorByHexString('#4c2a76');
    this.statusBar.overlaysWebView(false);
    this.slidesArray = [
      { "image": "assets/slides/slide0.png", "title": "Adopt" },
      { "image": "assets/slides/slide1.png", "title": "Search" },
      { "image": "assets/slides/slide2.png", "title": "Communicate" },
    ]
  }
  async getIndex(event: any) {
    this.activeIndex = await this.slides.getActiveIndex((number) => {
      return number;
    })
  }
  ngOnInit() {
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }
    this.nativePageTransitions.slide(options).then().catch();
  }
}
