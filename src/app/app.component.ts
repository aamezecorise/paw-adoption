import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MainService } from './main.service';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthenticationService } from './service/authentication.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';
import { ApiService } from './service/api.service';
import { async } from '@angular/core/testing';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  backButtonSubscription;
  defaultProfileImage: any;
  varsionNumber: any;
  profile: any;
  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    public mainService: MainService,
    public router: Router,
    public google: GooglePlus,
    public facebook: Facebook,
    public storage: Storage,
    private appRate: AppRate,
    public apiService: ApiService,
    private iab: InAppBrowser,
    private appVersion: AppVersion,
    public toastController: ToastController,
    public alertController: AlertController,
    private nativePageTransitions: NativePageTransitions,
    private authenticationService: AuthenticationService,
    public fcm: FCM
  ) {
    this.platform.ready().then(() => {
      //navigate on notification click
      this.fcm.onNotification().subscribe( data => {
      if (data.wasTapped) {
        //Notification was received on device tray and tapped by the user.
        console.log(JSON.stringify(data));
        this.navCtrl.navigateRoot('notification');
      } else {
        //Notification was received in foreground. Maybe the user needs to be notified.
        console.log(JSON.stringify(data));
        this.navCtrl.navigateForward('notification');
      }
    });


      this.apiService.isNavigateToAddPet = true;
      this.menuCtrl.swipeEnable(false)
      this.statusBar.backgroundColorByHexString('#4c2a76');
      this.statusBar.overlaysWebView(false);
      if (localStorage.getItem("userData")) {
        this.apiService.isLoggedIn = true;
      }
      this.varsionNumber = null;
      this.apiService.getAppVersion().subscribe(res => {
        let result = res.json().result;
        this.varsionNumber = result[0].versionNumber;
        this.initializeApp();
     
      })
      this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
        let view = this.router.url;
        if (view == "/adopt-landing") {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            localStorage.removeItem('device_id')
            //localStorage.removeItem('platForm')
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else if (view == "/login") {
          //Double check to exit app                  
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            sessionStorage.clear();
            localStorage.removeItem('device_id')
            localStorage.removeItem('platForm')
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else if (view == "/home") {
          //Double check to exit app                  
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            sessionStorage.clear();
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else if (view == "/update-social-user") {
          this.storage.clear();
          this.router.navigate(['/login'])
        }
        else if (view == "/add-pet") {
          this.router.navigate(['/adopt-landing'])
        }
        else {
          // go to previous page
          // this.navCtrl.pop();
          this.router.navigate(['/adopt-landing'])
        }
      });
    });
  }

  redirectPrivacyPolicy() {
    this.iab.create('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/privacy.html')
  }
  redirectTerms() {
    this.iab.create('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/terms.html')
  }
  redirectEULA() {
    this.iab.create('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/licenseagreement.html')
  }
  redirectFAQ() {
    this.iab.create('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/faq.html')
  }
  version: any;
  initializeApp() {
    localStorage.setItem("platForm", "android")
    this.defaultProfileImage = "assets/img/profile_icon.png";
    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then(res => {
        this.version = res;
        if (this.varsionNumber === this.version) {
          this.fcm.getToken().then(token => {
            console.log(token)
            localStorage.setItem('device_id', token)
          });
          // if (this.platform.is('android')) {
          //   localStorage.setItem("platForm", "android")
          //   console.log("Platform Name", localStorage.getItem('platForm'))
          // } else if (this.platform.is('ios')) {
          //   localStorage.setItem("platForm", "ios")
          //   console.log("Platform Name", localStorage.getItem('platForm'))
          // } else {
          //   // fallback to browser APIs
          // }
          this.statusBar.backgroundColorByHexString('#4c2a76');
          this.statusBar.overlaysWebView(false);
          this.splashScreen.hide();
          //google-analytics
          // this.ga.startTrackerWithId('UA-158914076-1')
          // .then(() => {}).catch(e => alert('Error starting GoogleAnalytics == '+ e));

          this.authenticationService.authState.subscribe(state => {
            if (state) {
              let options: NativeTransitionOptions = {
                direction: 'left',
                duration: 300
              }
              this.fcm.onNotification().subscribe(data => {
                this.apiService.isNotification = true;
                if (data.wasTapped) {
                  console.log(data)
                  // this.navCtrl.navigateRoot('/notification')
                  // this.fcm.unsubscribeFromTopic('')
                } else {
                  // console.log("Received in foreground");
                };
              });
              this.nativePageTransitions.slide(options).then().catch();
              this.router.navigate(['/adopt-landing']);
            } else {
              this.router.navigate(['/home']);
            }
          })
        } else {
          this.presentAlertConfirm()
        }
      });
    });
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: '<strong>Kindly download the latest version of the app to keep exploring.</strong>!!!',
      buttons: [{
        text: 'Okay',
        handler: () => {
          // navigator['app'].exitApp();
          window.open('https://play.google.com/store/apps/details?id=com.pawzeeble&hl=en', '_system', 'location=yes');
        }
      }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }
  logout() {
    sessionStorage.clear();
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.mainService.isLoggedIn = false;
    this.google.logout();
    this.facebook.logout();
    this.storage.clear();
    this.authenticationService.authState.next(false);
    this.router.navigate(['/login']);
    this.logoutToast();
  }
  navigate() {
    this.router.navigate(['/profile']);
    this.menuCtrl.close();
  }
  userData: any = {};
  menuOpened() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.profile = this.userData.profileImage;
    console.log(this.profile);
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Press back again to exit App",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  ngAfterViewInit() {
  }
  ngOnDestory() {
    this.backButtonSubscription.unsubscribe();
  }
  RateUs() {
    this.appRate.preferences.storeAppURL = {
      android: "market://details?id=com.pawzeeble",
    }
    this.appRate.promptForRating(true);
  }

  async logoutToast() {
    const toast = await this.toastController.create({
      message: 'Logged out successfully',
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
}
