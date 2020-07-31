import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, LoadingController, MenuController, ModalController, Platform, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Location } from "@angular/common";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Storage } from '@ionic/storage';
import { Breed, Breeds, CatBreed, CatBreeds } from '../demo-data';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { async } from 'q';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { StartPage } from '../start/start.page';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { toUnicode } from 'punycode';
declare var google: any;
import analytics from '../../analytics';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddPetPage implements OnInit {
  maxDate = new Date();
  // @ViewChild('mapInput') mapInput : ElementRef;
  @ViewChild('primaryComponent') primaryComponent: IonicSelectableComponent;
  @ViewChild('secondaryComponent') secondaryComponent: IonicSelectableComponent;
  backButtonSubscription;
  page = 2;
  map: any;
  marker: any;
  latitude: any = "";
  longitude: any = "";
  timestamp: any = "";
  toggle = true;
  group = null;
  selected = [];
  breeds: Breed[] = Breeds;
  dogBreeds: any = [];// = Breeds;
  catBreeds: CatBreed[] = CatBreeds;
  showMap = false;

  address: string;
  autocomplete: any = {};
  GoogleAutocomplete: any;
  zone: any;
  autocompleteItems: any = [];
  geocoder: any;
  markers: any = [];
  deviceWidth: any;
  deviceHeight: any;

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('slides') slides: any;
  sliderOpts = {
    autoplay: false,
    speed: 500,
    allowTouchMove: false,
  };
  isChecked = false;
  isToggle = false;
  isNext = false;
  base64Image: any = null;
  base64Profie: any = null;
  petForm: FormGroup;
  userData: any = {};
  petDetails: any;
  isEdit = false;
  dob = '';
  category = null;
  isLoading = false;
  isOpened = false;
  isClickedItem1 = false;
  isClickedItem2 = false;
  activeIndex = 0;
  slidesArray: any = [];
  slidesArrayForEdit: any = [];
  filesArray: any = [];
  platform: any = "android";
  primary_breed: Breed;
  secondary_breed: Breed;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  isDisplay = false;
  @ViewChild('myvideo') myVideo: any;

  newuserId:any;
  newpetId:any;
  profilePics:any = [];
  profileImage:any;
  constructor(public router: Router, public apiService: ApiService,
    public actionCtrl: ActionSheetController,
    private mediaCapture: MediaCapture,
    private media: Media,
    private storage: Storage,
    public fb: FormBuilder, public camera: Camera,
    public transfer: FileTransfer,
    public filePath: FilePath,
    public toastController: ToastController,
    public file: File,
    private crop: Crop,
    private videoEditor: VideoEditor,
    private location: Location,
    public loadingController: LoadingController,
    public route: ActivatedRoute,
    public keyboard: Keyboard,
    private webview: WebView,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public modalController: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platForm: Platform,
    public base64: Base64) {
    this.backButtonSubscription = this.platForm.backButton.subscribe(async () => {
      let view = this.router.url;
      if (view == "/add-pet") {
        this.router.navigate(['/add-pet'])
      } else if ((view == "/adopt-landing")) {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          navigator['app'].exitApp(); //Exit from app
        } else {
          await this.presentToast('Press back again to exit App');
          this.lastTimeBackPress = new Date().getTime();
        }
      } else {
        this.navCtrl.pop();
      }
    });
    this.platForm.ready().then((readySource) => {
      this.deviceWidth = this.platForm.width();
      this.deviceHeight = this.platForm.height();
    });
    this.slidesArray = []
    this.slidesArrayForEdit = []
    this.isNext = false;
    this.petForm = fb.group({
      'category': [null, Validators.required],
      'profileImage': [null],
      'gender': [],
      'primary_breed': [null, Validators.required],
      'secondary_breed': [null],
      'price': [null],
      'weight': [null, Validators.required],
      'birthday': [null],
      'profilePics': [],
      'petName': [null, Validators.required],
      'location': [null, Validators.required],
      'address': [null, Validators.required],
      'isVaccinated': [null, Validators.required],
      'isNeutered': [null, Validators.required],
      'medical_history': [null],
      'description': [null],
      'isAdopt': [false],
      'isDelete': [false],
      'isBookmark': [false],
      'userId': [null],
    });
    this.base64Image = null;
    this.breeds = []
    this.apiService.getDogBreeds().subscribe(res => {
      this.dogBreeds = res.json().dog_breeds;
      this.breeds = this.dogBreeds.slice(0, 19)
    })
    this.apiService.getCatBreeds().subscribe(res => {
      this.catBreeds = res.json().cat_breeds;
    })
  }
  async presentToast(param) {
    const toast = await this.toastController.create({
      message: param,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  primaryBreedChanged(event: { component: IonicSelectableComponent, value: any }) {
    this.isClickedItem1 = false;
    this.petForm.controls['primary_breed'].setValue(event.value.name)
  }
  secondaryBreedChanged(event: { component: IonicSelectableComponent, value: any }) {
    this.isClickedItem2 = false;
    this.petForm.controls['secondary_breed'].setValue(event.value.name)
  }
  async open() {
    this.breeds = []
    this.isClickedItem1 = true;
    await this.presentLoading();
    this.isOpened = this.primaryComponent.isOpened;
    if (this.isOpened) {
      this.breeds = this.dogBreeds.slice(0, 19)
      if (this.category == 'dog') {
        // this.breeds = [];
        this.breeds = this.dogBreeds.slice(0, 19)
      }
      if (this.category == 'cat') {
        // this.breeds = []
        this.breeds = this.catBreeds.slice(0, 19)
      }
      this.dismiss();
    }

  }
  async open1() {
    this.breeds = []
    this.isClickedItem2 = true;
    await this.presentLoading();
    this.isOpened = this.secondaryComponent.isOpened;
    if (this.isOpened) {
      this.breeds = this.dogBreeds.slice(0, 19)
      if (this.category == 'dog') {
        // this.breeds = [];
        this.breeds = this.dogBreeds.slice(0, 19)
      }
      if (this.category == 'cat') {
        // this.breeds = []
        this.breeds = this.catBreeds.slice(0, 19)
      }
      this.dismiss();
    }
  }
  navigateBack() {
    this.slidesArray = [];
    this.filesArray = [];
    this.location.back();
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }

  clickNext() {
    this.isNext = true;
    // this.slides.slideNext();
    this.content.scrollToTop(400);
  }
  clickPrev() {
    this.isNext = false;
    // this.slides.slidePrev();
    this.content.scrollToTop(400);
  }
  async getIndex(event: any) {
    this.content.scrollToTop(400);
    this.activeIndex = await this.slides.getActiveIndex((number) => {
      return number;
    })
  }
  setPetCategory(category: string) {
    this.isDisplay = false;
    setTimeout(() => {
      this.isDisplay = true;
    }, 100);
    this.category = category;
    if (this.category == 'dog') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    if (this.category == 'cat') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    if (this.category == 'bird') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    this.petForm.controls['category'].setValue(category);
  }
  async presentLoading() {
    this.isLoading = true;
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 500,
      cssClass: 'custom-loading'
    });
    return await loadingElement.present();
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  onSubmit() {
    if(this.filesArray && this.filesArray.length > 0){
      this.petForm.controls['userId'].setValue(this.userData.id)
      this.petForm.controls['isAdopt'].setValue(false)
      this.petForm.controls['isDelete'].setValue(false)
      this.petForm.controls['isBookmark'].setValue(false)
      if(this.petForm.controls['gender'].value == null){
        this.petForm.controls['gender'].setValue("NA")
      }
      if (this.petForm.valid) {
        // this.presentLoading();
        this.isLoading = true;
        this.apiService.addPet(this.petForm.value).subscribe(res => {
          console.log(res.json().result);
          this.newuserId = res.json().result.userId
          this.newpetId = res.json().result._id
          this.uploadImage();
          this.uploadProfileImage();
          // this.apiService.isNavigateToAddPet = false;
          // this.apiService.isNavigateDashboard = true;
          // this.isNext = false;
          // this.router.navigate(['/adoption-list', '2'])
          // this.router.navigateByUrl('/adoption-list/2', { skipLocationChange: true });
          // this.navCtrl.navigateRoot(['/adoption-list', '2'])
          // this.isLoading = false;
          // this.petForm.reset();
          // this.filesArray = [];
          // this.slidesArray = [];
          // this.base64Image = null;
          // this.base64Profie = null;
        })
      }
      else {
        // this.dismiss();
        this.isLoading = false;
        this.petForm.markAsTouched();
        console.log("Please enter required fileds")
      }
    }
    else{
      this.presentToast('Please add atleast one media');
      console.log('Image not added');
    }
  }

  updates3Urls(){
    var data = {
      profilePics: this.profilePics,
      profileImage: this.profileImage
    }
    this.apiService.updates3Urls(this.newuserId,this.newpetId,data).subscribe(res => {
      console.log(res);
      this.apiService.isNavigateToAddPet = false;
          this.apiService.isNavigateDashboard = true;
          this.isNext = false;
          // this.router.navigate(['/adoption-list', '2'])
          // this.router.navigateByUrl('/adoption-list/2', { skipLocationChange: true });
          this.navCtrl.navigateRoot(['/adoption-list', '2'])
          this.isLoading = false;
          this.petForm.reset();
          // this.filesArray = [];
          // this.slidesArray = [];
          this.base64Image = null;
          this.base64Profie = null;      
      // this.dismiss();
      // this.router.navigate(['/adoption-list', '2'])
    })
  }
  updatePetProfile() {
    this.isLoading = true;
    if (this.lastImage == null) {
      this.petForm.controls['profilePics'].setValue(null)
    }
    if(this.profileImage){
      this.petForm.controls['profileImage'].setValue(this.profileImage)
    }
    this.petForm.controls['profilePics'].setValue(this.slidesArrayForEdit)
    console.log("petForm Data", this.petForm.value);
    this.apiService.updatePetProfile(this.petDetails._id, this.petForm.value).subscribe(res => {
      console.log(res);
      // this.dismiss();
      this.router.navigate(['/adoption-list', '2'])
      this.isLoading = false;
      this.petForm.reset();
      this.base64Image = null;
      this.slidesArrayForEdit = []
    })
  }
  async selectFile(param: any) {
    console.log(param)
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          if (param == 'profile') {
            this.takeProfilePhoto();
          } else {
            this.takephoto()
          }

        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
          if (param == 'profile') {
            this.openGalleryForProfileImage();
          } else {
            this.openGallery()
          }
        }
      }, {
        text: 'Video',
        icon: 'videocam',
        handler: () => {
          this.captureVideo()
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
  async selectProfile() {
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takeProfilePhoto();
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
          this.openGalleryForProfileImage();
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
  capturedVideo: any;
  tempFilePath: any;

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 15,
      quality: 0
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      console.log(res[0], 'video file url');
      let capturedFile = res[0];
      this.capturedVideo = capturedFile.fullPath;
      var option: CreateThumbnailOptions = {
        fileUri: capturedFile.fullPath,
        outputFileName: capturedFile.fullPath.substr(capturedFile.fullPath.lastIndexOf('/') + 1).split('.')[0],
        atTime: 2,
        quality: 50,
      };
      this.videoEditor.createThumbnail(option).then(async res => {
        if (res != undefined) {
          let imagepath = 'file:///' + res;
          // this.tempFilePath = this.webview.convertFileSrc(imagepath);
          this.slidesArray.unshift({ file: capturedFile, type: 'video', thumbnail: this.webview.convertFileSrc(imagepath) })
        }
      }).catch(err => {
        console.log("Framing Error", err);
      });
      let obj = {
        image: capturedFile
      }
      this.filesArray.unshift(capturedFile);
    },
    (err: CaptureError) => console.error(err));
  }
  takephoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((filepath) => {
      this.tempFilePath = filepath
      this.base64.encodeFile(filepath).then((base64File: string) => {
        // this.base64Image = base64File;
        this.slidesArray.unshift({ file: base64File, type: 'image' })
      }, (err) => {
        console.log(err);
      });
      var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
      var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      let obj = {
        fullPath: filepath,
        name: this.createFileName()
      }
      this.filesArray.unshift(obj)
    }, (err) => {
      console.log(err)
    })
  }
  openGallery() {
    this.camera.getPicture({
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
      .then(filePath => {
        this.base64.encodeFile(filePath).then((base64File: string) => {
          this.slidesArray.unshift({ file: base64File, type: 'image' })
        }, (err) => {
          console.log(err);
        });
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      });
      let obj = {
        fullPath: imagePath,
        name: this.createFileName()
      }
      this.filesArray.unshift(obj)
    }, (err) => {
      console.log(err)
    })
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName = n + ".jpg";
    return newFileName;
  }
  lastImage: string = null;
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  public uploadImage() {
    // Destination URL
    this.presentLoading();
    if(!this.isEdit){
      var url = this.apiService.base_url + "pet/mediaupload/" + this.newuserId + "/" + this.newpetId;
    }else{
      var url = this.apiService.base_url + "pet/mediaupload/" + this.petDetails.userId + "/" + this.petDetails._id;
    }
    // var url = this.apiService.base_url + "pet/mediaupload/" + this.newuserId + "/" + this.newpetId;
    // var url = this.apiService.base_url + "pet/pet_media";
    // File for Upload

    if (this.filesArray.length > 0) {
      for (let i = 0; i < this.filesArray.length; i++) {
        var targetPath = this.filesArray[i].fullPath;
        var fileName = this.filesArray[i].name;
        var options = {
          fileKey: "image",
          fileName: fileName,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params: { 'fileName': fileName }
        };
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.upload(targetPath, url, options).then(data => {
          var newurls;
          newurls = data['response'];
          this.profilePics = [...this.profilePics,newurls];
          console.log(this.profilePics,'media new');
          this.updates3Urls();
          // if (i == this.filesArray.length - 1) {
            // if (!this.isEdit) {
            //   this.updates3Urls();
            //   // this.onSubmit();
            // }
            // else {
            //   this.updatePetProfile();
            // }
            // }

          }, (err) => {
            console.log("upload response", err)
          });
      }
    } else {
      if (this.isEdit) {
        // this.updatePetProfile();
        // this.onSubmit();
      }
      else {
        // this.updatePetProfile();
      }
    }
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  ngOnInit() {
    analytics.page()
    this.platform = localStorage.getItem("platForm");
    this.isNext = false;
    this.filesArray = [];
    this.slidesArray = [];
    this.profilePics = [];
    this.base64Image = null;
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.route.params.subscribe((params: any) => {
      if (params.data) {
        this.petDetails = JSON.parse(params["data"]);
        console.log(this.petDetails);
        this.isEdit = true;
        this.isDisplay = true;
      }
      else
        this.isEdit = false;
    })
    if (this.petDetails) {
      this.petForm.patchValue(this.petDetails);
      this.base64Profie = this.petDetails.profileImage;
      this.slidesArray = this.petDetails.profilePics;
      this.slidesArrayForEdit = this.petDetails.profilePics;
      this.category = this.petDetails.category;
      this.dob = this.petDetails.birthday;
      this.petForm.controls['birthday'].setValue(new Date(this.dob).toISOString().slice(0, -1))
    }
  }
  ionViewWillEnter() {
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
    this.menuCtrl.enable(true)
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
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }
  hideKeyBoard(event: any) {
    console.log(event)
    this.keyboard.hide()
  }
  profileFileName: string = null;
  takeProfilePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((filepath) => {
      this.crop.crop(filepath, { quality: 100 })
      .then((newFilePath) => {
        this.base64.encodeFile(newFilePath).then((base64File: string) => {
          console.log("base64File", base64File);
          this.base64Profie = base64File;
        }, (err) => {
          console.log(err);
        });
        var correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
        var currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
        this.copyProfileToLocalDir(correctPath, currentName, this.createFileName());

      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })
  }
  openGalleryForProfileImage() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
      .then(filePath => {
        this.crop.crop(filePath, { quality: 100 })
        .then((newFilePath) => {
          this.base64.encodeFile(newFilePath).then((base64File: string) => {
            this.base64Profie = base64File;
          }, (err) => {
            console.log(err);
          });
          let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
          this.copyProfileToLocalDir(correctPath, currentName, this.createFileName());
        }, (err) => {
          console.log(err)
        });
      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })
  }
  private copyProfileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.profileFileName = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  public uploadProfileImage() {
    if(!this.isEdit){
      var url = this.apiService.base_url + "pet/profileupload/" + this.newuserId + "/" + this.newpetId;
    }else{
      var url = this.apiService.base_url + "pet/profileupload/" + this.petDetails.userId + "/" + this.petDetails._id;
    }
    // var url = this.apiService.base_url + "pet/pet_profile_image";
    // File for Upload
    if (this.profileFileName) {
      var targetPath = this.pathForImage(this.profileFileName);
      // File name only
      var filename = this.profileFileName;
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };
      const fileTransfer1: FileTransferObject = this.transfer.create();
      fileTransfer1.upload(targetPath, url, options).then(data => {
        var newpeturls;
        newpeturls = data['response'];
        this.profileImage = newpeturls;
        console.log(this.profileImage,'pet profile new');
        // console.log(data)
        // this.petForm.controls['profileImage'].setValue(this.profileFileName)
        if(this.isEdit){
          this.updatePetProfile();
          // this.uploadImage();
        }
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      // this.petForm.controls['profileImage'].setValue(null)
      // this.uploadImage();
    }
  }
  removeItem(position) {
    // if(!this.isEdit){
      this.filesArray.splice(position, 1)
      this.slidesArray.splice(position, 1)
      // } else {
        //   this.slidesArray.splice(position, 1)
        this.slidesArrayForEdit.splice(position, 1)
        this.apiService.removeMedia(this.petDetails._id, {profilePics: this.slidesArrayForEdit}).subscribe(res=>{
        })
        // }
      }
      modal: any;
      async GetLocation() {
        this.keyboard.hide()
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
        // let address = location.place + ', ' + location.district + ', ' + location.pincode;
        let tempAddress = location.address.split(',');
        tempAddress.splice(0, 1);
        for (let i = 0; i < tempAddress.length; i++) {
          address += tempAddress[i] + ','
        }
        this.petForm.controls['location'].setValue(location)
        this.petForm.controls['address'].setValue(address)
      }
      getDogBreeds(page?: number, size?: number): [] {
        var breed: any = [];
        if (page && size) {
          breed = this.dogBreeds.slice((page - 1) * size, ((page - 1) * size) + size - 1);
        }
        return breed;
      }
      getCatBreeds(page?: number, size?: number): [] {
        var breed: any = [];
        if (page && size) {
          breed = this.catBreeds.slice((page - 1) * size, ((page - 1) * size) + size - 1);
        }
        return breed;
      }
      async getMoreBreeds(event: {
        component: IonicSelectableComponent,
        text: string
      }) {
        if (this.category == 'dog') {
          let breeds = [];
          breeds = await this.getDogBreeds(this.page, 20);
          breeds = event.component.items.concat(breeds);
          event.component.items = breeds;
          event.component.endInfiniteScroll();
        }
        if (this.category == 'cat') {
          let breeds: any = [];
          breeds = await this.getCatBreeds(this.page, 20);
          breeds = event.component.items.concat(breeds);
          // if (text) {
            //   ports = this.filterPorts(ports, text);
            // }
            event.component.items = breeds;
            event.component.endInfiniteScroll();
          }

          this.page++;
        }
        SearchBreeds(event: {
          component: IonicSelectableComponent,
          text: string
        }) {
          if (!event.text || event.text.trim() === '') {
            return;
          }
          let breeds: any;
          if (this.category == 'dog') {
            breeds = this.dogBreeds.filter((v) => {
              if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
                else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
              })
          }
          if (this.category == 'cat') {
            breeds = this.catBreeds.filter((v) => {
              if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
                else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
              })
          }
          event.component.items = breeds;
        }
        hideKeyboard() {
          this.keyboard.hide();
        }
      }
