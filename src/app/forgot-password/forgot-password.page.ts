import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ToastController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import analytics from '../../analytics';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  // registerdEmail: any = "";
  resetToken: any = "";
  mailResponse: any = {};
  isReset: boolean;
  newPassword: any = "";
  confirmPassword: any = "";
  Form: FormGroup;
  platform: any = "android";
  constructor(public location: Location, public router: Router,public fb: FormBuilder,private menuCtrl: MenuController,
    private nativePageTransitions: NativePageTransitions, public toastController: ToastController,
     public apiService: ApiService) {
    // this.registerdEmail = "";
    this.resetToken = "";
    this.isReset = false;
    this.Form = fb.group({
      'registerdEmail': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-zA-Z]{2,}$')])],
    });
  }

  ngOnInit() {
    analytics.page()
    this.platform = localStorage.getItem("platForm");
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.Form.controls[controlName].hasError(errorName);
  }

  isLoading1 = false;
  isLoading2 = false;
  isLoading3 = false;
  isDisabled = false;
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  sendMail() {
    this.isLoading1 = true;
    this.mailResponse = {};
    this.isDisabled = false;
    this.apiService.forgotPassword({ email: this.Form.controls['registerdEmail'].value }).subscribe(async res => {
      this.isLoading1 = false;
      if(res.json().error == false){
        this.mailResponse = res.json();
        if(res.json().emailStatus == true){
          this.isDisabled = true;
        }
        await this.presentToast(res.json().message)
      } else {
        this.isLoading1 = false;
        await this.presentToast(res.json().message)
      }
     
    })

  }
  resetPassword() {
    this.isLoading2 = true;
    this.apiService.resetPassword({ email: this.Form.controls['registerdEmail'].value, password: this.resetToken }).subscribe(res => {
      if (res.json().isMatched) {
        this.isLoading2 = false;
        this.isReset = true;
      } else {
        this.isLoading2 = false;
        this.isReset = false;
      }
    })
  }
  savePassword() {
    this.isLoading3 = true;
    const n = this.newPassword.localeCompare(this.confirmPassword);
    if (n == 0) {
      this.apiService.savePassword({ email: this.Form.controls['registerdEmail'].value, newPassword: this.newPassword }).subscribe(res => {
        this.isLoading3 = false;
        this.Form.reset();
        this.resetToken = "";
        this.newPassword = "";
        this.confirmPassword = "";
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
        this.router.navigate(['/login']);
      })
    } else {
      this.isLoading3 = false;
      let param = "Password doesn't match";
      this.presentToast(param)
    }
  }
  goBack() {
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
    this.location.back();
  }
  OnChangeInput(event:string){
    this.Form.controls['registerdEmail'].setValue(event.toLocaleLowerCase());
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
  ionViewDidEnter(){
    this.menuCtrl.enable(false);
  }
}
