import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, MenuController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  Form: FormGroup;
  isLoading1 = false;
  @Input() petId: string;
  parentRef: any;
  constructor(public location: Location, public router: Router, public fb: FormBuilder, private menuCtrl: MenuController,
    private nativePageTransitions: NativePageTransitions, public toastController: ToastController, public modalCtrl: ModalController,
    public apiService: ApiService, private navParams: NavParams) {
    this.Form = fb.group({
      'fullName': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-zA-Z]{2,}$')])],
      'phoneNumber': [null, [Validators.required, Validators.maxLength(10), Validators.pattern('[7-9]{1}[0-9]{9}')]],
    });
    this.petId = this.navParams.data.petId
    this.parentRef = this.navParams.data.parentRef
  }

  ngOnInit() {
  }
  dismiss() {
    this.parentRef.onDismiss();
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  }
  _keyPress(event: string) {
    let value = event;
    if (value.length > 10) {
      this.Form.controls['phoneNumber'].setValue(value.slice(0, 10))
    }
  }
  OnChangeInput(event: string) {
    this.Form.controls['email'].setValue(event.toLocaleLowerCase());
  }
  removeSpace(event: string) {
    this.Form.controls['userName'].setValue(event.replace(/\s/g, ''));
    console.log(event)
  }
  // Save Adopters data
  submit() {
    this.isLoading1 = true;
    let data = {
      isAdopt: true,
      adopters_detail: this.Form.value
    }
    this.apiService.updatePet(this.petId, data).subscribe(res => {
      this.isLoading1 = false;
      this.dismiss();
    })
  }
}
