import { Component, OnInit, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../service/authentication.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, ToastController, MenuController, AlertController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Device } from '@ionic-native/device/ngx';
//Firebase notification
import { FCM } from '@ionic-native/fcm/ngx';
import analytics from '../../analytics';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  @ViewChild('userNameInput') inputUserName: ElementRef;
  helper = new JwtHelperService;
  isLoader = false;
  loginJson: any = {
    "username": null,
    "password": null
  }
  isLogining: Boolean = false;
  loginForm: FormGroup;
  isToggle = false;
  type = "password";
  constructor(public mainService: MainService,
    public router: Router,
    public fb: FormBuilder,
    private renderer: Renderer2,
    public apiService: ApiService,
    private storage: Storage,
    private authService: AuthenticationService,
    private google: GooglePlus,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public keyboard: Keyboard,
    private menuCtrl: MenuController,
    private device: Device,
    private nativePageTransitions: NativePageTransitions,
    public alertController: AlertController,
    private fcm: FCM,
    private facebook: Facebook) {
    this.loginForm = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      message: `
      <div class="custom-spinner-container">
      <img class="loading" width="64px" height="64px" src="assets/loader/orange/833.gif" />
    </div>`,
      spinner: null,
      duration: 2000,
      cssClass: 'custom-loading'
    });
    return await loadingElement.present();
  }
  async dismiss(param: any) {
    return await this.loadingController.dismiss().then(() => {
      if (param.error == false) {
        this.presentToast(param.message)
        this.authService.authState.next(true);
        this.router.navigate(['/adopt-landing']);
      } else {
        setTimeout(() => {
          this.presentToast(param.message)
        }, 2100);

      }
    });
  }
  async Login() {
    this.isLoader = true;
    let deviceId = {
      device_id: localStorage.getItem('device_id')
    }
    await this.apiService.updateUserDeviceID(this.loginForm.controls['username'].value, deviceId).subscribe(res => {
      // console.log(res.json())
    })

    this.apiService.login(this.loginForm.value).subscribe(async res => {
      let data = res.json();
      if (data.error == false) {
        this.isLoader = false;
        await this.presentToast(data.message)
        this.apiService.isLoggedIn = true
        let decodedToken = this.helper.decodeToken(data.token);
        localStorage.setItem("token", data.token);
        this.apiService.head.set("authorization", data.token)
        localStorage.setItem("userData", JSON.stringify(decodedToken))
        this.storage.set('USER_INFO', JSON.stringify(decodedToken)).then((response) => {
          setTimeout(() => {
            this.router.navigate(['/adopt-landing']);
          }, 100);
          this.authService.authState.next(true);
          this.loginForm.reset();
        });
      } else {
        this.isLoader = false;
        await this.presentToast(data.message)
      }
    })
  }
  user: any = {};
  LoginGoogle() {
    let deviceId = {
      device_id: localStorage.getItem('device_id')
    }
    this.google.login({}).then(res => {
      // this.presentAlertConfirm(res);
      this.apiService.isLoggedIn = true
      localStorage.removeItem("userData");
      this.saveGoogleData(res);
    })
      .catch((err) => {
        // this.presentAlertConfirm(err);
      });
  }
  async presentAlertConfirm(msg: any) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          // navigator['app'].exitApp();
        }
      }
      ]
    });

    await alert.present();
  }
  faceBookUser = null;
  LoginWithFaceBook() {
    this.faceBookUser = null;
    let deviceId = {
      device_id: localStorage.getItem('device_id')
    }
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.faceBookUser = { email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name'] }
        this.apiService.isLoggedIn = true
        localStorage.removeItem("userData");
        this.saveFaceBookData(this.faceBookUser);
      });
    }).catch((err) => {
      // this.presentAlertConfirm(err);
    });
  }
  ngOnInit() {
    sessionStorage.setItem("session", "1")
    this.loginForm.reset();
    // this.ga.trackView('login')
    // .then(() => {})
    // .catch(e => console.log(e));
    analytics.page()
  }

  // add back when alpha.4 is out
  // trackEvent(item) {
  //   this.ga.trackEvent('Category', 'Tapped Action', 'Item Tapped is '+item, 0);
  // }

  async saveGoogleData(data: any) {
    let deviceId = {
      device_id: localStorage.getItem('device_id')
    }
    await this.apiService.updateUserDeviceID(data.email, deviceId).subscribe(res => {
      // console.log(res.json())
    })
    await this.apiService.checkUserExists(data.email).subscribe(res => {
      if (res.json().flag == 1) {
        let userData = res.json().userDetail;
        localStorage.setItem("token", res.json().token);
        this.apiService.head.set("authorization", res.json().token)
        localStorage.setItem("userData", JSON.stringify(userData))
        this.storage.set('USER_INFO', JSON.stringify(userData)).then((response) => {
          // this.dismiss();
          setTimeout(() => {
            this.router.navigate(['/adopt-landing']);
          }, 100);
          this.authService.authState.next(true);
        });
      } else {
        this.router.navigate(['/update-social-user', { data: JSON.stringify(data), loginBy: 'google' }]);
      }
    })
  }
  async saveFaceBookData(data: any) {
    let deviceId = {
      device_id: localStorage.getItem('device_id'),
      profileImage: data.picture
    }
    await this.apiService.updateUserDeviceID(data.email, deviceId).subscribe(res => {
      // console.log(res.json())
    })
    await this.apiService.checkUserExists(data.email).subscribe(res => {
      if (res.json().flag == 1) {
        let userData = res.json().userDetail;
        localStorage.setItem("token", res.json().token);
        this.apiService.head.set("authorization", res.json().token)
        localStorage.setItem("userData", JSON.stringify(userData))
        this.storage.set('USER_INFO', JSON.stringify(userData)).then((response) => {
          setTimeout(() => {
            this.router.navigate(['/adopt-landing']);
          }, 100);
          this.authService.authState.next(true);
        });
      } else {
        this.router.navigate(['/update-social-user', { data: JSON.stringify(data), loginBy: 'facebook' }]);
      }
    })
  }
  togglePassword() {
    this.isToggle = !this.isToggle;
    if (this.isToggle) {
      this.type = "text"
    } else {
      this.type = "password"
    }
  }
  forgotPassword() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
    this.router.navigate(['/forgot-password'])
  }
  OnChangeInput(event: string) {
    this.loginForm.controls['username'].setValue(event.toLocaleLowerCase());
  }
  ionViewDidEnter() {
    this.loginForm.reset();
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }
  hideKeyboard() {
    this.keyboard.hide();
  }
}
