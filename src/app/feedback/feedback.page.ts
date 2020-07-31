import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MenuController, ToastController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import analytics from '../../analytics';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  userData: any = {};
  feedback: any = null;
  isLoading = false;
  constructor(public location: Location, public router: Router, public fb: FormBuilder, private menuCtrl: MenuController,
    private nativePageTransitions: NativePageTransitions, public toastController: ToastController,
    public apiService: ApiService) { }

  ngOnInit() {
    analytics.page()
    this.userData = JSON.parse(localStorage.getItem("userData"))
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
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
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
  }
  submitFeedback() {
    this.isLoading = true;
    let data = {
      id: this.userData.id,
      fullName: this.userData.fullName,
      feedback: this.feedback
    }
    this.apiService.addFeedback(data).subscribe(res=>{
      let result = res.json();
      this.isLoading = false;
      this.feedback = null;
      this.presentToast(result.massage)
    })
    
    setTimeout(() => {
      
    }, 500);
  }
}
