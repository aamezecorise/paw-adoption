import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MainService } from '../main.service';
import { ApiService } from '../service/api.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import analytics from '../../analytics';

@Component({
  selector: 'app-adopt-landing',
  templateUrl: './adopt-landing.page.html',
  styleUrls: ['./adopt-landing.page.scss'],
})
export class AdoptLandingPage implements OnInit {
  todo = [
    '',
    'Go home',
    '',
  ];
  backButtonSubscription:any;
  value: any = "";
  userData: any = {};
  petCountUnderUser: number = 0;
  lastTimeBackPress = 0;
  timePeriodToExit = 500;
  defaultProfileImage:any;
  constructor(public modalCtrl: ModalController,
    public mainService: MainService,
    private nativePageTransitions: NativePageTransitions,
    public apiService: ApiService,
    private menuCtrl: MenuController,
    private platform: Platform,
    private vibration: Vibration,
    private toastController: ToastController,
    public router: Router) {
    this.value = "neutral";
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.apiService.isNavigateDashboard = false;
      let view = this.router.url;
      if (view == "/adopt-landing") {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          navigator['app'].exitApp(); //Exit from app
          localStorage.removeItem('device_id')
          localStorage.removeItem('platForm')
        } else {
          await this.presentToast();
          this.lastTimeBackPress = new Date().getTime();
        }
      } 
    });
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Press back again to exit App",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  ngOnInit() {
    // this.menuCtrl.swipeEnable(false);
    this.value = "neutral";
    this.defaultProfileImage = "assets/img/profile_icon.png";
    this.userData = JSON.parse(localStorage.getItem("userData"));

    // this.ga.trackView('adopt-landing')
    // .then(() => {})
    // .catch(e => console.log(e));
    analytics.page()
  }

  // add back when alpha.4 is out
  // trackEvent(item) {
  //   this.ga.trackEvent('Category', 'Tapped Action', 'Item Tapped is '+item, 0);
  // }

  swipeEvent(event: any) {
    // console.log(event);
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
    this.todo = [
      '',
      'Go home',
      '',
    ];
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.value = "neutral"
    this.apiService.getPetsCount(this.userData.id).subscribe(res => {
      this.petCountUnderUser = res.json().count;
    })
  }
  onClick(position) {
    this.vibration.vibrate(100);
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }
    let id: any;
    var element = this.todo[position];
    var mainItem = this.todo.indexOf('Go home');
    if (position == 0) {
      if (mainItem == 1) {
        this.todo.splice(0, 1);
        this.todo.splice(1, 0, element);
        id = 1
        setTimeout(() => {
          localStorage.setItem("paramId", id)
          this.apiService.isNavigateDashboard = true;
          this.nativePageTransitions.slide(options).then().catch();
          this.router.navigate(['/adoption-list', id]);
        }, 300);
      } else {
        this.todo.splice(0, 2);
        this.todo.splice(1, 0, element);
        this.todo.splice(2, 0, element);
      }
    } else if (position == 2) {
      if (mainItem == 1) {
        this.todo.splice(2, 1);
        this.todo.splice(1, 0, element);
        id = 2
        setTimeout(() => {
          localStorage.setItem("paramId", id)
          if (this.petCountUnderUser != 0) {
            this.apiService.isNavigateDashboard = true;
            this.nativePageTransitions.slide(options).then().catch();
            this.router.navigate(['/adoption-list', id]);
          } else {
            this.apiService.isNavigateToAddPet = true;
            this.router.navigate(['/add-pet']);
          }
        }, 300);
      } else {
        this.todo.splice(1, 2);
        this.todo.splice(0, 0, element);
        this.todo.splice(1, 0, element);
      }
    } else if (position == 1) {
      if (mainItem == 2) {
        this.todo.splice(1, 1);
        this.todo.splice(2, 0, element);
      } else if (mainItem == 0) {
        this.todo.splice(1, 1);
        this.todo.splice(0, 0, element);
      }
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    // this.vibration.vibrate(100);
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    let id: any;
    if (event.currentIndex == 0) {
      id = 1
      localStorage.setItem("paramId", '1')
      // setTimeout(() => {
      // this.nativePageTransitions.slide(options).then().catch();
      this.apiService.isNavigateDashboard = true;
      this.router.navigate(['/adoption-list', '1']);
      // }, 250);

    }
    if (event.currentIndex == 2) {
      id = 2
      localStorage.setItem("paramId", '2')
      // setTimeout(() => {
      if (this.petCountUnderUser != 0) {
        this.apiService.isNavigateDashboard = true;
        // this.nativePageTransitions.slide(options).then().catch();
        this.router.navigate(['/adoption-list', '2']);
      } else {
        this.apiService.isNavigateToAddPet = true;
        // this.nativePageTransitions.slide(options).then().catch();
        this.router.navigate(['/add-pet']);
      }
      // }, 250);
    }
  }
  touchStart() {
    this.vibration.vibrate(100);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }
  navigate(){
    this.router.navigate(['/profile']);
  }
}
