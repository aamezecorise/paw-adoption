import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit} from '@angular/core';
import { ModalController,PopoverController, LoadingController, MenuController, NavParams, ToastController, IonContent,Platform, ActionSheetController} from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Location } from "@angular/common";
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import { MainService } from '../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Breed, Breeds, CatBreed, CatBreeds } from '../demo-data';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { configFromSession } from '@ionic/core';
declare var google: any;
import analytics from '../../analytics';
// import { Socket } from 'ngx-socket-io';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.page.html',
  styleUrls: ['./chatpage.page.scss'],
})
export class ChatpagePage implements OnInit, AfterViewInit{
  @ViewChild(IonContent) content: IonContent;
  backButtonSubscription: any;
  // platform: any = "android";
  message = '';
  messages = [];
  messageresult:any;
  senderName = '';  
  userData: any = {};
  userDetails: any = {};
  receiverName: any = '';
  socket: any;
  typingMessage;
  users: any = [];
  isOnline = false;
  typing = false;
  isLoading = true;

  senderId:any;
  receiverId:any;
  senderImage:any;
  receiverImage:any;
  deviceId:any;

  base64Image: any = null;
  base64Profie: any = null;

  constructor(public router: Router,public popoverController: PopoverController, public mainService: MainService,private platform: Platform,public modalCtrl: ModalController, public _elementRef: ElementRef, private menuCtrl: MenuController,
    public fb: FormBuilder, public keyboard: Keyboard, private nativePageTransitions: NativePageTransitions,
    private crop: Crop,public base64: Base64,public filePath: FilePath,public file: File,
    private navParams: NavParams,public camera: Camera, public geolocation: Geolocation, public nativeGeocoder: NativeGeocoder,
    public actionCtrl: ActionSheetController,public modalController: ModalController,private toastCtrl: ToastController,
    private location: Location, public loadingController: LoadingController, public apiService: ApiService) { 

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/');
    // this.socket = io('http://localhost:6559/');

    this.platform.ready().then((readySource) => {
      this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.router.navigate(['/chatlist'])
      this.closeModal();
      });
    });
  }

  ngOnInit() {
  this.GotoBottom();
    analytics.page();
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.senderId = this.userData.id;
    this.senderImage = this.userData.profileImage;
    this.userDetails = this.navParams.get('data');
     if(this.userDetails.sendId === this.senderId){
       console.log('user match');
     }if(this.userDetails.sendId !== this.senderId){
       this.receiverId = this.userDetails.sendId;
     }if(this.userDetails.recId === this.senderId){
       // this.receiverId = ''
       console.log('user match');
     }if(this.userDetails.recId !== this.senderId){
       this.receiverId = this.userDetails.recId;
     }
    console.log(this.receiverId);
    console.log(this.senderId);
    console.log(this.userDetails,this.userData);

    this.senderName = this.userData.fullName;

    this.getallMessages(this.senderId,this.receiverId);
    this.getuserbyId(this.receiverId);

  this.socket.on('refreshPage', ()=>{
  this.GotoBottom();
  this.getallMessages(this.senderId,this.receiverId);
  })

  this.socket.emit('online', {room: 'global', user: this.senderName});

    this.SocketFunction();
  }

   ngAfterViewInit(){
    const params = {
      room1 : this.senderName,
      room2 : this.receiverName
    }
    this.socket.emit('join chat', params);
    this.socket.on('usersOnline', data =>{
      this.users = data;
      if(this.users.length > 0){
        const result = _.indexOf(this.users, this.receiverName);
        if(result > -1){
          this.isOnline = true;
        }else {
          this.isOnline = false;
        }
        console.log(this.users);
      }
    })
  }


    getuserbyId(receiverId){
  this.apiService.getUserById(this.receiverId).subscribe(res => {
      let data = res.json().result;
      console.log(data);
      this.deviceId = data.device_id;
      this.receiverImage = data.profileImage;
      this.receiverName = data.fullName
    })
    }

    getallMessages(senderId,receiverId){
    this.apiService.GetAllMessages(senderId,receiverId).subscribe(res => {
      this.messageresult = res.json().result;
      this.messages = this.messageresult.message;
      this.isLoading = false;
      console.log(this.messages);
    });
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter');
  }

  SendMessage() {
    console.log(this.senderId,this.receiverId,this.receiverName,this.message,this.senderImage,this.receiverImage);
    this.apiService.SendMessage(this.senderId,this.receiverId,this.receiverName,this.message,this.senderImage,this.receiverImage).subscribe(data =>{
      this.socket.emit('refresh', {});
      this.GotoBottom();
      this.sendMessageNotification();
       this.message = '';
      console.log(data);
    });
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }


  SocketFunction(){
    console.log('SocketFunction');
    this.socket.on('is_typing', data =>{
      console.log(data);
      if(data.sender === this.receiverName){
        this.typing = true;
        // this.isOnline = false;
      }
    });

    this.socket.on('has_stopped_typing', data =>{
      console.log(data);
      if(data.sender === this.receiverName){
        this.typing = false;
        // this.isOnline = true;
      }
  });
  }

  closeModal() {
    this.modalController.dismiss({
    });
  }

async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  GotoBottom(){
    setTimeout(()=>{
      if(this.content.ionScrollStart){
        this.content.scrollToBottom()
      }
    }, 500)
      // this.content.scrollToBottom(500); 
    }

    IsTyping(){
      this.socket.emit('start_typing' , {
        sender: this.senderName,
        receiver: this.receiverName 
      });

      if(this.typingMessage) {
        clearTimeout(this.typingMessage);
      }

      this.typingMessage = setTimeout(() =>{
        this.socket.emit('stop_typing', {
          sender: this.senderName,
          receiver: this.receiverName
        });
      }, 500);
    }

    async selectFile(param: any) {
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
            this.takephoto()
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
            this.openGallery()
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

    profileFileName: string = null;

    private copyProfileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.profileFileName = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  takephoto() {
    console.log('take photo');
    // const options: CameraOptions = {
    //   quality: 100,
    //   targetWidth: 1525,
    //   targetHeight: 720,
    //   // destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   // mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   saveToPhotoAlbum: false,
    //   correctOrientation: true
    // }
    // this.camera.getPicture(options).then((filepath) => {
    //   this.tempFilePath = filepath
    //   this.base64.encodeFile(filepath).then((base64File: string) => {
    //     // this.base64Image = base64File;
    //     this.slidesArray.unshift({ file: base64File, type: 'image' })
    //   }, (err) => {
    //     console.log(err);
    //   });
    //   var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
    //   var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
    //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //   let obj = {
    //     fullPath: filepath,
    //     name: this.createFileName()
    //   }
    //   this.filesArray.unshift(obj)
    // }, (err) => {
    //   console.log(err)
    // })
  }
  openGallery() {
    console.log('open gallery');
    // this.camera.getPicture({
    //   quality: 100,
    //   targetWidth: 1525,
    //   targetHeight: 720,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    // }).then((imagePath) => {
    //   this.filePath.resolveNativePath(imagePath)
    //     .then(filePath => {
    //       this.base64.encodeFile(filePath).then((base64File: string) => {
    //         this.slidesArray.unshift({ file: base64File, type: 'image' })
    //       }, (err) => {
    //         console.log(err);
    //       });
    //       let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
    //       let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
    //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //     });
    //   let obj = {
    //     fullPath: imagePath,
    //     name: this.createFileName()
    //   }
    //   this.filesArray.unshift(obj)
    // }, (err) => {
    //   console.log(err)
    // })
  }

    async presentPopover(ev: any) {

    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        "user": this.mainService.username,
        "paramTitle": "chatpage",
      }
    });
    return await popover.present();
  }

  sendMessageNotification() {
    let data = {
      device_id: this.deviceId,
      userName: this.senderName,
    }
    console.log('data', data);
    this.apiService.sendMessageNotification(data).subscribe(res => {
      console.log(res);
    })
  }



}
