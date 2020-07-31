import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ViewEncapsulation } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ApiService } from '../service/api.service';
import { MainService } from '../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { MenuController, ModalController, NavParams, ToastController, Platform, NavController } from '@ionic/angular';
import { StartPage } from '../start/start.page';
import analytics from '../../analytics';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnquiryPage implements OnInit {
  backButtonSubscription;
  members: number = 0;
  radio1: any;
  radio2: any;
  petData: any = {};
  userData: any = {};
  ownerData: any = {};
  enquiryData: any = {};
  enquiryData2: any = {};
  enquiryForm: FormGroup;
  isLoading = false;
  isEdit = false;
  platform: any = "android";
  parentRef: any;
  constructor(private location: Location,
    public keyboard: Keyboard,
    public mainService: MainService,
    public apiService: ApiService,
    public router: Router,
    public navCtrl: NavController,

    private nativePageTransitions: NativePageTransitions,
    public fb: FormBuilder,
    private menuCtrl: MenuController,
    public route: ActivatedRoute,
    private navParams: NavParams,
    public toastController: ToastController,
    public modalController: ModalController,
    private platForm: Platform,
  ) {
    this.enquiryForm = fb.group({
      'address': [null, Validators.required],
      'location': [null, Validators.required],
      'familyMembers': [1, Validators.required],
      'houseType': [null, Validators.required],
      'isExperienced': [null, Validators.required],
      'costAwareness': [null, Validators.required],
      'petId': [null],
      'enquiryDate': [new Date()],
      'enquiryBy': [null],
      'ownerId': [null],
      'isAccepted': [false],
    });
  }
  ngOnInit() {
    analytics.page()
    this.isEdit = false;
    this.platform = localStorage.getItem("platForm");
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.parentRef = this.navParams.data.parentRef;
    if (this.navParams.data.enquiryData !== null) {
      this.enquiryData = JSON.parse(this.navParams.data.enquiryData);
      this.isEdit = true;
      this.enquiryForm.patchValue(this.enquiryData)
    }
    if (this.navParams.data.enquiryData2 !== null) {
      this.enquiryData2 = JSON.parse(this.navParams.data.enquiryData2);
      this.enquiryForm.patchValue(this.enquiryData2)
    }
    if (this.navParams.data.petData && this.navParams.data.ownerData) {
      this.petData = JSON.parse(this.navParams.data.petData);
      this.ownerData = JSON.parse(this.navParams.data.ownerData);
      console.log(this.ownerData);
    }
  }
  makeEnquiry() {
    this.isLoading = true;
    this.enquiryForm.controls['enquiryBy'].setValue(this.userData.id),
      this.enquiryForm.controls['ownerId'].setValue(this.petData.userId),
      this.enquiryForm.controls['petId'].setValue(this.petData._id);
          console.log(this.enquiryForm.value);
    if (!this.isEdit && this.enquiryData2 == null && this.enquiryData == null) {
      console.log(this.enquiryForm.value);
      this.apiService.makeEnquiry(this.enquiryForm.value).subscribe(res => {
        if (res.json().error === false) {
          console.log(this.enquiryForm.value);
          this.apiService.addAdoptersInfo(this.enquiryForm.value).subscribe(res => {
            if (res.json().error === false) {
              this.sendEnquiryNotification();
              this.isLoading = false;
              this.enquiryForm.reset();
              this.goBack()
            }
          })
        }
      })
    }
    else if (this.isEdit && this.enquiryData !== null) {
          console.log(this.userData.id, this.enquiryForm.value);
      this.apiService.updateAdoptersInfo(this.userData.id, this.enquiryForm.value).subscribe(res => {
        this.isLoading = false;
        this.enquiryForm.reset();
        this.goBack()
      })
    } else if (!this.isEdit && this.enquiryData2 !== null && this.enquiryData == null) {
      this.apiService.makeEnquiry(this.enquiryForm.value).subscribe(res => {
        if (res.json().error === false) {
          console.log(this.userData.id, this.enquiryForm.value);
          this.apiService.updateAdoptersInfo(this.userData.id, this.enquiryForm.value).subscribe(res => {
            if (res.json().error === false) {
              this.sendEnquiryNotification();
              this.isLoading = false;
              this.enquiryForm.reset();
              this.goBack()
            }
          })
        }
      })
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Enquiry sent.",
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  sendEnquiryNotification() {
    let data = {
      device_id: this.ownerData.device_id,
      userName: this.userData.fullName,
    }
    console.log('data', data);
    this.apiService.sendEnquiryNotification(data).subscribe(res => {
      this.presentToast();
      this.saveNotification()
    })
  }
  saveNotification() {
    let data = {
      userId: this.userData.id,
      fullName: this.userData.fullName,
      profileImage: this.userData.profileImage,
      petName: this.petData.petName,
      petProfileImage: this.petData.profileImage,
      ownerId: this.petData.userId,
      message: 'Enquired about',
      petId: this.petData._id,
      isAccepted: false
    }
    this.apiService.saveNotification(data).subscribe(res => {
      // console.log(res.json())
    })
  }
  goBack() {
    this.modalController.dismiss({
    });
    this.parentRef.getEnquiryStatus();
  }
  addNumber() {
    let members = this.enquiryForm.controls['familyMembers'].value;
    members += 1;
    this.enquiryForm.controls['familyMembers'].setValue(members);
  }
  removeNumber() {
    let members = this.enquiryForm.controls['familyMembers'].value;
    members -= 1;
    if (members < 1) {
      members = 1
    }
    this.enquiryForm.controls['familyMembers'].setValue(members);
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 250
    }

    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true)
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 250
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }
  modal: any;
  async GetLocation() {
    this.modal = await this.modalController.create({
      component: StartPage,
      componentProps: {
        "parentRef": this
      }
    });
    return await this.modal.present();
  }
  async onDismiss() {
    let address: any = "";
    const { data } = await this.modal.onWillDismiss();
    let location = data.location;
    console.log(location)
    let tempAddress = location.address.split(',');
    tempAddress.splice(0, 1);
    for (let i = 0; i < tempAddress.length; i++) {
      address += tempAddress[i] + ','
    }
    this.enquiryForm.controls['location'].setValue(location)
    this.enquiryForm.controls['address'].setValue(address)
  }
  hideKeyBoard(event: any) {
    console.log(event)
    this.keyboard.hide()
  }
}
