import { Component, OnInit, DebugNode } from '@angular/core';
import { NavParams, BooleanValueAccessor, PopoverController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { ModalPage } from 'src/app/modal/modal.page';

@Component({
  selector: 'app-morepopover',
  templateUrl: './morepopover.component.html',
  styleUrls: ['./morepopover.component.scss'],
})
export class MorepopoverComponent implements OnInit {

  paramId: string;
  paramTitle: string;
  isNgo: Boolean;
  petId: any;
  enquiryBy: any;
  bkuserId: any;
  segment: any;
  constructor(
    private navParams: NavParams,
    public router: Router,
    private apiService: ApiService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
  }
  parentRef: any;
  enquiryInfo: any = [];
  userData: any = {}
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.paramId = this.navParams.data.paramId;
    this.paramTitle = this.navParams.data.paramTitle;
    this.isNgo = this.navParams.data.isNgo;
    this.petId = this.navParams.data.petId;
    this.bkuserId = this.navParams.data.userId;
    this.parentRef = this.navParams.data.parentRef;
    this.enquiryBy = this.navParams.data.enquiryBy;
    this.segment = this.navParams.data.segment;
    if (this.paramTitle == 'enquiry_info') {
      this.apiService.getAdoptersInfo(this.enquiryBy).subscribe(res => {
        console.log(res.json().result)
        let data = res.json();
        this.enquiryInfo = data.result;
      })
    }
  }
  adoptPet() {
    this.presentModal()
    this.popoverController.dismiss();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'petId': this.petId,
        'parentRef': this.parentRef
      }
    });
    return await modal.present();
  }
  removePet() {
    let data = {
      isDelete: true
    }
    this.apiService.updatePet(this.petId, data).subscribe(res => {
      this.parentRef.onDismiss();
    })
  }
  editPetProfile() {
    this.parentRef.editPetProfile(this.parentRef.petDetails)
    this.parentRef.onDismiss();
    this.modalController.dismiss({});
  }
  removeBookmarkedPet() {
    let data = {
      petId: this.petId,
      userId: this.bkuserId
    }
    console.log(data)
    this.apiService.removeBookmarked(data).subscribe(res => {
      this.parentRef.onDismiss();
    })
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async reportProfile() {
    let obj = {
      petId: this.petId,
      reportBy: this.userData.id
    }
    this.apiService.reportPage(obj).subscribe(async res => {
      this.popoverController.dismiss();
      await this.presentToast("The page has been reported.")
    })
  }
  shareLink() {
    this.popoverController.dismiss();
    this.parentRef.shareLink();
  }
  shareLink1() {
    this.popoverController.dismiss();
    this.parentRef.shareLink(this.petId);
  }
  reportPage() {
    this.popoverController.dismiss();
    this.parentRef.reportPage(this.petId)
  }

}
