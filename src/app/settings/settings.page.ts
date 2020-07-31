import { Component, OnInit } from '@angular/core';
import { MenuController, NavParams, ToastController, ModalController, Platform, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../service/api.service';
import { EnquiryPage } from '../enquiry/enquiry.page';
import analytics from '../../analytics';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userData: any = {};
  backButtonSubscription:any;
  constructor(
    public location: Location, public router: Router, public fb: FormBuilder, private menuCtrl: MenuController,
    private nativePageTransitions: NativePageTransitions, public platform: Platform, public toastController: ToastController, public modalController: ModalController,
    public apiService: ApiService, public navCtrl: NavController) {
      this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
        let view = this.router.url;
        if(view.includes("/settings")){
          this.router.navigate(['/settings']);
        } 
        else {
          this.navCtrl.pop();
        }
      });
     }

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
  async updateEmail() {
    let id = 1;
    if (!this.userData.isSocial) {
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
      this.router.navigate(['/update-info', id]);
    } else {
      await this.presentToast("You have logged in using Facebook or Gmail.")
    }
  }
  async updatePassword() {
    let id = 2;
    if (!this.userData.isSocial) {
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
      this.router.navigate(['/update-info', id]);
    } else {
      await this.presentToast("You have logged in using Facebook or Gmail.")
    }
  }
  enquiryData: any = {};
  modal:any
  updateInfo() {
    this.apiService.getAdoptersInfo(this.userData.id).subscribe(async res => {
      this.enquiryData = res.json().result;
      this.modal = await this.modalController.create({
        component: EnquiryPage,
        componentProps: {
          "enquiryData": this.enquiryData ? JSON.stringify(this.enquiryData) : null,
          "enquiryData2": null,
          "parentRef": this
        },
        backdropDismiss: true
      });
      return await this.modal.present();
    })

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
}
