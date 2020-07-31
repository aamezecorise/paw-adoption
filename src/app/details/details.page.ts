import { Component, OnInit, ViewChild, QueryList, ViewChildren, Input} from '@angular/core';
import { ModalController, PopoverController, MenuController, ActionSheetController, ToastController, Platform, NavController, IonRouterOutlet, NavParams} from '@ionic/angular';
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import { MainService } from '../main.service';
import { ApiService } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EnquiryPage } from '../enquiry/enquiry.page';
import analytics from '../../analytics';
// import { threadId } from 'worker_threads';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  backButtonSubscription: any;
  // @ViewChild('video') video;
  @Input() data: string;
  @ViewChild('slides') slides: any;
  autoPlay = false;
  mapLink: any;
  userData: any = {};
  petDetails: any = {};
  user: any = {};
  isVisible = false;
  paramId: any;
  isBookMarked = false;
  isShowInfo = false;
  url: any;
  sliderOpts = {
    speed: 500,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  deviceWidth: any;
  deviceHeight: any;
  videoHeight: any;
  videoWidth: any;
  mediaArray: any = [];
  activeIndex = 1;
  previousIndex = 1;
  disableEnquiry = false;
  disableEnquiry1 = false;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    public popoverController: PopoverController,
    public mainService: MainService,
    public apiService: ApiService,
    private nativePageTransitions: NativePageTransitions,
    public router: Router,
    private iab: InAppBrowser,
    private menuCtrl: MenuController,
    public route: ActivatedRoute,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    public actionCtrl: ActionSheetController,
    public modalController: ModalController,
    private platform: Platform,
    private navCtrl: NavController,
    private location: Location,
    private navParams: NavParams) {
    this.platform.ready().then((readySource) => {
      this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.router.navigate(['/adoption-list/1']);
      this.closeModal();

        let view = this.router.url;

        if (view.includes("/details")) {
          console.log("return true")
          let vid: any;
          vid = document.getElementById('video' + String(this.activeIndex))
          if (vid !== null) {
            vid.pause();
          }
          this.router.navigate(['/details', { data: JSON.stringify(this.petDetails) }]);
        }
        else {
          this.closeModal();
          // this.navCtrl.pop();
        }
      });

      this.deviceWidth = this.platform.width();
      this.deviceHeight = this.platform.height();
      this.videoHeight = Math.round(this.platform.height() / 2.5);
      this.videoWidth = Math.round(this.videoHeight - 40);
    });
    this.mediaArray = [];
  }
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.router.navigate(['/adoption-list/1']);
      this.closeModal();
      
      // close modal
      try {
        const element = await this.modalController.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
        console.log(error);

      }

      this.modalController.dismiss({
      });

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        }
        // else if (this.router.url === '/home') {
        //     if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
        //         // this.platform.exitApp(); // Exit from app
        //         navigator['app'].exitApp(); // work for ionic 4

        //     } else {
        //         this.toast.show(
        //             `Press back again to exit App.`,
        //             '2000',
        //             'center')
        //             .subscribe(toast => {
        //                 // console.log(JSON.stringify(toast));
        //             });
        //         this.lastTimeBackPress = new Date().getTime();
        //     }
        // }
      });
    });
  }
  async slideChanged(item) {
    this.activeIndex = await this.slides.getActiveIndex((number) => {
      return number;
    })
    this.previousIndex = await this.slides.getPreviousIndex((number) => {
      return number;
    })
    let vid: any;
    let vid1: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    vid1 = document.getElementById('video' + String(this.previousIndex))
    if (this.mediaArray[this.activeIndex].type == 'video') {
      vid.play();
    } else {
      if (this.mediaArray[this.previousIndex].type == 'video') {
        vid1.pause();
      }
      vid.pause();
    }
    if (this.mediaArray[this.previousIndex].type == 'video') {
      vid1.pause();
    }
  }
  async ngOnInit() {
    analytics.page()
    this.mediaArray = []
    this.paramId = localStorage.getItem("paramId");
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.navParams.get('data'));
    this.petDetails = JSON.parse(this.navParams.get('data'));
    this.url = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/pet/" + this.petDetails._id;
      console.log(this.petDetails)
      this.petDetails.profilePics.forEach(element => {
        if (element.type == 'video') {
          this.mediaArray.push(element)
        } else {
          this.mediaArray.unshift(element)
        }
    });
    this.mapLink = "geo:?q=" + this.petDetails.location.lat + ',' + this.petDetails.location.lng + "&z=" + 17;
      

    // await this.route.params.subscribe(params => {
    //   console.log(params);
    //   this.mediaArray = []
    //   this.petDetails = JSON.parse(params["data"]);
    //   this.url = "https://www.pawzeeble.com/pet/" + this.petDetails._id;
    //   console.log(this.petDetails)
    //   this.petDetails.profilePics.forEach(element => {
    //     if (element.type == 'video') {
    //       this.mediaArray.push(element)
    //     } else {
    //       this.mediaArray.unshift(element)
    //     }
    //   });
    //   this.mapLink = "geo:?q=" + this.petDetails.location.lat + ',' + this.petDetails.location.lng + "&z=" + 17;
    //   // this.mapLink = "geo://" + this.petDetails.location.lat + "," + this.petDetails.location.lng + "?q=" + this.petDetails.location.lat + ',' + this.petDetails.location.lng + "&z=" + 20;
    // })
    await this.apiService.checkBookmarked({ petId: this.petDetails._id, userId: this.userData.id }).subscribe(res => {
      let result = res.json();
      if (result.flag == 1) {
        this.isBookMarked = true;
      } else {
        this.isBookMarked = false;
      }
    })
    await this.apiService.getUserById(this.petDetails.userId).subscribe(res => {
      let data = res.json();
      if (data.error == false) {
        this.user = data.result;
      }
    })
    this.getEnquiryStatus();
  }
  goBack() {
    // this.router.navigate(['/adoption-list', this.paramId])
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    this.location.back();
  }

  closeModal() {
    this.modalController.dismiss({
    });
  }
  async presentPopover(ev: any) {
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        "user": this.mainService.username,
        "paramTitle": "adoptionDetails",
        "isNgo": this.userData.isNgo,
        "petId": this.petDetails._id,
        "paramId": this.paramId,
        "parentRef": this
      }
    });
    return await popover.present();
  }
  goToUserProfile(user: any) {
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    this.router.navigate(['/user-profile', '1', { userData: JSON.stringify(user) }]);
  }
  goToAdoptersProfile(user: any) {
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    this.isShowInfo = false;
    this.apiService.getUserByEmailId(user.email).subscribe(res => {
      let userdata = res.json().result;
      if (userdata) {
        this.router.navigate(['/user-profile', '1', { userData: JSON.stringify(userdata) }]);
      } else {
        this.isShowInfo = true;
      }
    })
  }
  editPetProfile(data: any) {
    console.log("petdetails from popover", data);
    // this.closeModal();
    this.router.navigate(['/add-pet', { data: JSON.stringify(data) }]);
  }
  onDismiss() {
    try {
      this.popoverController.dismiss();
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }
  modal: any;
  enquiryData: any = {}
  async makeEnquiry() {
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    this.apiService.getAdoptersInfo(this.userData.id).subscribe(async res => {
      this.enquiryData = res.json().result;
      this.modal = await this.modalController.create({
        component: EnquiryPage,
        componentProps: {
          "enquiryData2": this.enquiryData ? JSON.stringify(this.enquiryData) : null,
          "enquiryData": null,
          "petData": JSON.stringify(this.petDetails),
          "ownerData": JSON.stringify(this.user),
          "parentRef": this
        },
        // backdropDismiss: true
      });
      return await this.modal.present();
    })
  }
  bookMarkPet() {
    let data = {
      userId: this.userData.id,
      petId: this.petDetails._id,
      date: new Date()
    };
    this.apiService.bookMarkPet(data).subscribe(res => {
      this.isBookMarked = true;
      console.log(res.json())
    })
  }
  unBookMarkPet() {
    this.apiService.removeBookmarked({ petId: this.petDetails._id, userId: this.userData.id }).subscribe(res => {
      console.log("Remove bookmark successfully")
      if (res.json().error == false) {
        this.isBookMarked = false
      } else {
        this.isBookMarked = true
      }
    })
  }
  // ionViewWillEnter() {
  //   let options: NativeTransitionOptions = {
  //     direction: 'left',
  //     duration: 250
  //   }

  //   this.nativePageTransitions.slide(options)
  //     .then(onSuccess => {
  //       //
  //     })
  //     .catch(onError => {
  //       //
  //     });
  // }
  ionViewWillLeave() {
    this.menuCtrl.enable(true)
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
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }
  redirectMap() {
    let vid: any;
    vid = document.getElementById('video' + String(this.activeIndex))
    if (vid !== null) {
      vid.pause();
    }
    this.iab.create(this.mapLink, '_system')
    // window.location = this.mapLink;
    // window.open(this.mapLink, '_system');
  }
  shareLink(value: any) {
    this.socialSharing.share(this.url).then((res) => {
      //Success
    }).catch((e) => {
      //error
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
  reportPage(petId: any) {
    let obj = {
      petId: petId,
      reportBy: this.userData.id
    }
    this.apiService.reportPage(obj).subscribe(async res => {
      await this.presentToast("The page has been reported.")
    })
  }
  petName(value: string) {
    return value.toUpperCase();
  }
  petGender(value: string) {
    if (value !== "NA") {
      return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
    } else {
      return value
    }
  }
  petVaccinate(value: string) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
  }
  petNeutered(value: string) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
  }
  petNameAtAbout(value: string) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
  }
  petAge(value: any) {
    let ageMonth = 0;
    let today: any = new Date();
    let birthdate: any = new Date(value);
    let ageDays = Math.round((today - birthdate) / (1000 * 60 * 60 * 24));
    ageMonth = Math.round(ageDays / 30);
    return ageMonth;
  }
  getEnquiryStatus() {
    this.disableEnquiry = false;
    this.apiService.getEnquiryStatus(this.userData.id, this.petDetails._id).subscribe(res => {
      let response = res.json();
      if (response.status) {
        this.disableEnquiry = true;
      } else {
        this.disableEnquiry = false;
      }
    })
  }
}
