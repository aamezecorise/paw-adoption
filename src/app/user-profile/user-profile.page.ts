import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
// import { AdoptLandingPage } from '../adopt-landing/adopt-landing.page';
import { ModalController } from '@ionic/angular';
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import { ApiService } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DetailsPage } from '../details/details.page';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import analytics from '../../analytics';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userData: any = {};
  public selectSections: any = {
    About: 'About',
    SavedPets: 'SavedPets',
    Adopted: 'Adopted',
    selectedSection: 'About'
  };
  adoptedPetsList: any = [];
  savedPetsList: any = [];
  isLoading = false;
  platform: any = "android";
  paramId: any;
  isShow = false;
  pageNumber = 1;
  pagingEnabled = true;
  constructor(public popoverController: PopoverController,
    public modalController: ModalController,
    private nativePageTransitions: NativePageTransitions,
    public apiService: ApiService,
    public router: Router,
    public location: Location,
    private socialSharing: SocialSharing,
    private route: ActivatedRoute) {
    if (this.paramId == "2") {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  ngOnInit() {
    analytics.page()
    this.platform = localStorage.getItem("platForm");
    this.route.params.subscribe(params => {
      this.userData = JSON.parse(params["userData"]);
      this.paramId = params["id"];
      if (this.paramId == "2") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    })

  }
  getAdoptedPets() {
    this.isLoading = true;
    this.adoptedPetsList = [];
    this.apiService.getAdoptedPets(this.userData.id).subscribe(res => {
      if (res.json().error == false) {
        this.isLoading = false;
        this.adoptedPetsList = res.json().result;
      }
    })
  }
  getSavedPets() {
    this.pagingEnabled =true
    this.isLoading = true;
    this.savedPetsList = [];
    this.apiService.getSavedPets(this.userData._id, 1).subscribe(res => {
      if (res.json().error == false) {
        this.isLoading = false;
        this.savedPetsList = res.json().result;
      }
    })
  }
  modal: any;
   async viewDetails(data: any) {
    console.log(data);
    this.modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: { data: JSON.stringify(data) }
    });
    return await this.modal.present();
    // this.router.navigate(['/details', { data: JSON.stringify(data) }]);
  }
  async presentPopover(item: any) {
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      componentProps: {
        "user": "user",
        "paramTitle": "userProfile",
        "petId": item._id,
        "parentRef": this
      }
      // translucent: true
    });
    return await popover.present();
  }
  async presentPopover1(ev: any) {
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        "user": "user",
        "paramTitle": "userProfile"
      }
      // translucent: true
    });
    return await popover.present();
  }
  goBack() {
    this.location.back();
  }
  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'left',
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
    let options: NativeTransitionOptions = {
      direction: 'right',
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
  url: any;
  shareLink(id: any) {
    this.url = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/pet/" + id;
    this.socialSharing.share(this.url).then((res) => {
      //Success
    }).catch((e) => {
      //error
    })
  }
  petName(value: string) {
    return value.toUpperCase();
  }
  petGender(value: string) {
    if(value !== "NA"){
      return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
      } else {
        return value
      }
  }
  refresher(event:any){
    let pageNumber = 1
    this.isLoading = true;
    this.savedPetsList = [];
    this.pagingEnabled = true;
    this.apiService.getSavedPets(this.userData._id, pageNumber).subscribe(res => {
      if (res.json().error == false) {
        this.isLoading = false;
        this.savedPetsList = res.json().result;
      }
    })
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  loadData(event:any){
    this.pageNumber = this.pageNumber + 1;
    // this.getSavedPets();
    // return new Promise((resolve) => {
      setTimeout(() => {
        // this.isLoading = true;
        this.apiService.getSavedPets(this.userData._id, this.pageNumber).subscribe(res => {
          if (res.json().error == false) {
            let newData = res.json().result;
            if (newData.length > 0) {
              for (let i = 0; i < newData.length; i++) {
                this.savedPetsList.push(newData[i]);
              }
            } else {
              event.target.disabled = true;
            }
            // this.isLoading = false;
          }
        })
        event.target.disabled = true;
        // resolve();
      }, 500);
    // })
  }
  petAge(value: any) {
    let ageMonth = 0;
    let today:any = new Date();
    let birthdate:any = new Date(value);
    let ageDays = Math.round((today - birthdate) / (1000 * 60 * 60 * 24));
    ageMonth = Math.round(ageDays / 30);
    return ageMonth;
  }
}
