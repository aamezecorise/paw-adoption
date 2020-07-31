import { Component, OnInit } from '@angular/core';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { PopoverController, Platform, ToastController, NavController, AlertController, ModalController} from '@ionic/angular';
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import analytics from '../../analytics';
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  backButtonSubscription;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  notificationArray: any = [];
  userData: any = [];
  isLoading = false;
  isShow = false;
  notification_count = 0;
  modal: any;
  public selectSections: any = {
    Pending: 'Pending',
    Accepted: 'Accepted',
    selectedSection: 'Pending'
  };
  constructor(private nativePageTransitions: NativePageTransitions, 
    public toastController: ToastController, 
    public popoverController: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public apiService: ApiService, public router: Router, private platForm: Platform, private navCtrl: NavController) {
      this.apiService.isNavigateDashboard = true;
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.getPendingNotifications()
    this.platForm.ready().then(()=>{
    this.backButtonSubscription = this.platForm.backButton.subscribe(async () => {
      let view = this.router.url;
        // this.navCtrl.pop();
        if(view == "/notification"){
          this.navCtrl.navigateRoot(['/adopt-landing'])
        } else if((view == "/adopt-landing")) {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            localStorage.removeItem('device_id')
            localStorage.removeItem('platForm')
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else {
          // this.navCtrl.pop();
        }
    });
    })
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Press back again to exit App",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  ngOnInit() {
    analytics.page()
    // this.presentAlertConfirm()
  }
  async presentAlertConfirm(param:any) {
    const alert = await this.alertController.create({
      message: param
    })
    await alert.present();
  }
  ionViewWillEnter() {
    // this.getPendingNotifications()
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
  ionViewWillLeave() {
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
  acceptNotification(item: any) {
    this.apiService.acceptNotification(item._id, { isAccepted: true }).subscribe(res => {
      this.apiService.isNotification = false;
      this.sendAcceptNotification(item)
      this.getPendingNotifications()
    })
  }
  userInfo: any = [];
  async sendAcceptNotification(item: any) {
    this.userInfo = [];
    await this.apiService.getUserById(item.userId).subscribe(res => {
      let user = res.json();
      this.userInfo = user.result;
      let data = {
        device_id: this.userInfo.device_id,
        userName: this.userData.fullName,
      }
      this.apiService.sendAcceptNotification(data).subscribe(res => {
        this.saveNotification(item)
      })
    })

  }
  saveNotification(item: any) {
    let data = {
      userId: this.userData.id,
      fullName: this.userData.fullName,
      profileImage: this.userData.profileImage,
      petName: item.petName,
      petProfileImage: item.profileImage,
      ownerId: item.userId,
      message: 'Accepted request about',
      petId: item.petId,
      isAccepted: true
    }
    console.log(data);
    this.apiService.saveNotification(data).subscribe(res => {
      // console.log(res.json())
    })
  }
  denyNotification(item: any) {
    console.log(item);
    this.apiService.denyNotifications({ id: item._id }).subscribe(res => {
      this.apiService.isNotification = false;
      this.getPendingNotifications()
    })
  }
  getPendingNotifications() {
    this.isLoading = true;
    this.isShow = false;
    this.notificationArray = [];
    this.apiService.getPendingNotifications(this.userData.id).subscribe(res => {
      let data = res.json();
      this.notificationArray = res.json().result;
      console.log(this.notificationArray);
      this.isLoading = false;
      this.notification_count = data.count;
      if (this.notification_count == 0) {
        this.isShow = true;
      }

    })
  }
  getAcceptedNotifications() {
    this.apiService.isNotification = false;
    this.isLoading = true;
    this.isShow = false;
    this.notificationArray = [];
    this.apiService.getAcceptedNotifications(this.userData.id).subscribe(res => {
      let data = res.json();
      this.notificationArray = res.json().result;
      console.log(this.notificationArray);
      this.isLoading = false;;
      if (data.count == 0) {
        this.isShow = true;
      }
    })
  }
  goToUsersProfile(id: any) {
    this.apiService.getUserById(id).subscribe(res => {
      let userdata = res.json().result;
      this.router.navigate(['/user-profile', '2', { userData: JSON.stringify(userdata) }]);
    })
  }
  async getEnquiryInfo(item: any, id: any) {
    let uid = item.userId
    if (id == '1') {
      uid = item.userId
    } else {
      uid = item.userId
    }
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      componentProps: {
        "paramTitle": "enquiry_info",
        "enquiryBy": uid,
        "parentRef": this
      }
      // translucent: true
    });
    return await popover.present();
  }

  async viewChat(data:any) {
    console.log(data);
    this.modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { data:data }
    });
    return await this.modal.present();
  }

  back(){
    this.router.navigate(['/adoption-list/1'])
  }
}
