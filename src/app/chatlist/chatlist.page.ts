import { Component, OnInit, ViewChild} from '@angular/core';
import { MainService } from '../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController, ActionSheetController,IonContent, ToastController, Platform, NavController } from '@ionic/angular';
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import { ApiService } from '../service/api.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PreferencePage } from '../preference/preference.page';
import { DetailsPage } from '../details/details.page';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google: any;
import analytics from '../../analytics';
import { ChatpagePage } from '../chatpage/chatpage.page';
import _ from 'lodash';
import io from 'socket.io-client';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.page.html',
  styleUrls: ['./chatlist.page.scss'],
})
export class ChatlistPage implements OnInit {

  userData: any = {};
  senderId:any;
  message:any;
  chatnameFilter:any;
  modal: any;
  senderName: any;
  showEmptyMsg = false;
  isLoading = true;
  socket: any;


  constructor(public mainService: MainService,
    public router: Router,
    private nativePageTransitions: NativePageTransitions,
    public modalController: ModalController,
    public actionCtrl: ActionSheetController,
    public apiService: ApiService,
    private platForm: Platform,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    public navCtrl: NavController,
    private route: ActivatedRoute, public geolocation: Geolocation, public nativeGeocoder: NativeGeocoder,
    public popoverController: PopoverController) { 

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/');
    // this.socket = io('http://localhost:6559/');

	this.userData = JSON.parse(localStorage.getItem("userData"))
    this.senderId = this.userData.id;
    this.senderName = this.userData.fullName;
    console.log(this.senderId);

    this.socket.on('refreshPage', ()=>{
      this.getallMessagesbyId(this.senderId);
    })
  }

    getallMessagesbyId(senderId){
  	this.apiService.GetAllMessagesbyId(senderId).subscribe(res => {
	    this.message = res.json().result;
      console.log(this.message);
      if(this.message == undefined){
          this.showEmptyMsg = true;
          this.isLoading = false;
      }
      this.message.sort((a, b) => -a.createdAt.localeCompare(b.createdAt))
      this.chatnameFilter = res.json().result;
      console.log(this.message);

     // if (this.message.length > 0) {
     //      this.showEmptyMsg = false;
     //    } else {
     //      this.showEmptyMsg = true;
     //    }
        this.isLoading = false;
  	});
  }

  ngOnInit() {
    this.getallMessagesbyId(this.senderId);
  }

  back(){
	  this.router.navigate(['/adoption-list/1'])
  }


  async chatpage(item: any) {
    var recName;
    if(item.sender !== this.senderName){
      recName = item.sender
    }if(item.receiver !== this.senderName){
      recName = item.receiver
    }
    console.log(this.senderName);
    console.log(recName);
    this.apiService.MarkMessages(this.senderName,recName).subscribe(res => {
      console.log(res);
      this.socket.emit('refresh',{});
    });
    this.modal = await this.modalController.create({
      component: ChatpagePage,
      componentProps: { data: item }
    });
    return await this.modal.present();
  }

  delete(item){
  	console.log(item);
  }

    async presentPopover(ev: any) {

    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        "user": this.mainService.username,
        "paramTitle": "chatList",
      }
    });
    return await popover.present();
  }

    refresher(event: any) {
	    this.getallMessagesbyId(this.senderId);
	    setTimeout(() => {
	      event.target.complete();
	    }, 1000);
 	}

 	searchfilter(event){
      const val = event.target.value.toLowerCase();
      const filter = this.chatnameFilter.filter(function(d) {
      	console.log(d.sender);
      	console.log(d.receiver);
        return d.sender.toLowerCase().indexOf(val) !== -1 || d.receiver.toLowerCase().indexOf(val) !== -1;
	      });
	      this.message = filter;
	      this.message.offset = 0;
    }

    CheckIfFalse(arr, name){
      let total = 0;
      _.forEach(arr, val=>{
        if(val.isRead === false && val.receivername !== name){
          total += 1;
        }
      });
      return total;
      console.log(total);
    }

}
