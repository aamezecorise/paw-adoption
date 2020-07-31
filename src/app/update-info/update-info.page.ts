import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, ToastController, MenuController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Location } from '@angular/common';
import { ApiService } from '../service/api.service';
import { MainService } from '../main.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../service/authentication.service';
import analytics from '../../analytics';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.page.html',
  styleUrls: ['./update-info.page.scss'],
})
export class UpdateInfoPage implements OnInit {
  paramId: any;
  EmailForm: FormGroup;
  PasswordForm: FormGroup;
  platform: any = "android";
  userData: any = {};
  isLoading1 = false;
  isLoading3 = false;
  constructor(private route: ActivatedRoute, public location: Location, public router: Router, public fb: FormBuilder, private menuCtrl: MenuController,
    private nativePageTransitions: NativePageTransitions, public toastController: ToastController, public modalCtrl: ModalController,
    public apiService: ApiService,  public mainService: MainService,
    public google: GooglePlus,
    public facebook: Facebook,
    private authenticationService: AuthenticationService,
    public storage: Storage,) { 
      this.EmailForm = fb.group({
        'email': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-zA-Z]{2,}$')])]
      });
      this.PasswordForm = fb.group({
        // 'old-password': [null, Validators.compose([Validators.required])],
        'password': [null, Validators.compose([Validators.required])],
        'confirm-password': [null, Validators.compose([Validators.required])],
      });
    }

  ngOnInit() {
    analytics.page()
    this.userData = JSON.parse(localStorage.getItem("userData"))
    console.log(this.userData)
    // this.EmailForm.controls['email'].setValue(this.userData.email)
    this.platform = localStorage.getItem("platForm");
    let sub = this.route.params.subscribe(params => {
      this.paramId = params['id'];
    });
  }
  OnChangeInput(event: string) {
    this.EmailForm.controls['email'].setValue(event.toLocaleLowerCase());
    console.log(event)
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.EmailForm.controls[controlName].hasError(errorName);
  }
  emailFlag: any;
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  check_mail_exists_or_not(value: any) {
    this.apiService.checkExistEmail(value).subscribe(async res => {
      let result = res.json();
      this.emailFlag = result.flag;
      if (result.error == false && result.flag == 1) {
        let msg = "An account with this email already exists."
        await this.presentToast(msg)
      }
    })
  }
  goBack() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 300
    }
    this.nativePageTransitions.slide(options).then(onSuccess => {})
      .catch(onError => {
        //
      });
    this.location.back();
  }
  changePassword(){
    this.isLoading3 = true;
    let data = {
      email: this.userData.email,
      newPassword: this.PasswordForm.controls['password'].value
    }
    const n = this.PasswordForm.controls['password'].value.localeCompare(this.PasswordForm.controls['confirm-password'].value);
    if(n == 0){
      this.apiService.savePassword(data).subscribe(res=>{
        this.isLoading3 = false;
        this.mainService.isLoggedIn = false;
        this.google.logout();
        this.facebook.logout();
        this.storage.clear();
        this.authenticationService.authState.next(false);
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
        this.presentToast('Password changed successfully.')
      })
    } else {
      this.isLoading3 = false;
      this.presentToast('Password is not matched')
    }
  }
  changeEmail(){
    this.isLoading1 = true;
    let data = {
      email: this.EmailForm.value
    }
    this.apiService.updateUser(this.userData.id, this.EmailForm.value).subscribe(res=> {
      this.isLoading1 = false;
      this.mainService.isLoggedIn = false;
      this.google.logout();
      this.facebook.logout();
      this.storage.clear();
      this.authenticationService.authState.next(false);
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
      this.presentToast('Changed email id successfully.')
    })
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 300
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }
}
