import { Component, OnInit } from '@angular/core';
// import { AdoptLandingPage } from '../adopt-landing/adopt-landing.page';
import { ModalController, PopoverController, ToastController, ActionSheetController } from '@ionic/angular';
import { MorepopoverComponent } from '../components/morepopover/morepopover.component';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import analytics from '../../analytics';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any = {};
  isLoading = false;
  isEdit = false;
  isLoading1 = false;
  base64Image: any = null;
  public selectSections: any = {
    About: 'About',
    SavedPets: 'SavedPets',
    Adopted: 'Adopted',
    selectedSection: 'About'
  };
  public cardsArray = [
  { "image": "assets/slides/slide0.jpg", "title": "Adopt" },
  { "image": "assets/slides/slide1.jpg", "title": "Search" },
  { "image": "assets/slides/slide2.jpg", "title": "Communicate" },
  ];
  adoptedPetsList: any = [];
  savedPetsList: any = [];
  platform: any = "android";
  signUpForm: FormGroup;
  isAbout = true;
  constructor(public modalController: ModalController,
    public popoverController: PopoverController,
    private nativePageTransitions: NativePageTransitions,
    public apiService: ApiService,
    public toastController: ToastController,
    public actionCtrl: ActionSheetController,
    public fb: FormBuilder,
    public keyboard: Keyboard,
    public router: Router,
    public camera: Camera,
    public transfer: FileTransfer,
    public filePath: FilePath,
    private crop: Crop,
    public base64: Base64,
    public file: File,
    private socialSharing: SocialSharing,
    ) {
    this.isEdit = false;
    this.isAbout = true;
    this.signUpForm = fb.group({
      'userName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9_.]{3,30}$')])],
      'about_ngo': [null],
      'phoneNumber': [null, [Validators.maxLength(10), Validators.pattern('[7-9]{1}[0-9]{9}')]],
      'profileImage': [null],
      'website': [null],
    });
  }
  async presentPopover(ev: any, item: any, segment: any) {
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        "user": "ngo",
        "segment": segment,
        "paramTitle": "profile",
        "petId": item._id,
        "userId": this.userData.id,
        "parentRef": this
      }
      // translucent: true
    });
    return await popover.present();
  }
  getAdoptedPets() {
    this.isAbout = false;
    this.isLoading = true;
    this.adoptedPetsList = [];
    this.apiService.getAdoptedPets(this.userData.id).subscribe(res => {
      if (res.json().error == false) {
        this.isLoading = false;
        this.adoptedPetsList = res.json().result;
      }
    })
  }
  _keyPress(event: string) {
    let value = event;
    if (value.length > 10) {
      this.signUpForm.controls['phoneNumber'].setValue(value.slice(0, 10))
    }
  }
  getSavedPets() {
    this.isLoading = true;
    this.savedPetsList = [];
    this.apiService.getBookMarkedPets(this.userData.id).subscribe(res => {
      if (res.json().error == false) {
        this.isLoading = false;
        this.savedPetsList = res.json().result;
        console.log(this.savedPetsList)
      }
    })
  }
  viewDetails(data: any) {
    this.router.navigate(['/details', { data: JSON.stringify(data) }]);
  }
  editProfile() {
    this.isEdit = true;
    this.signUpForm.controls['userName'].setValue(this.userData.userName);
    this.signUpForm.controls['about_ngo'].setValue(this.userData.about_ngo);
    this.signUpForm.controls['website'].setValue(this.userData.website);
    this.signUpForm.controls['profileImage'].setValue(this.userData.profileImage);
    this.signUpForm.controls['phoneNumber'].setValue(this.userData.phoneNumber);
  }
  clickAbout() {
    this.isAbout = true;
  }
  clickStarred() {
    this.isAbout = false;
  }
  ngOnInit() {
    analytics.page()
    this.isAbout = true;
    this.getSavedPets();
    this.platform = localStorage.getItem("platForm");
    this.userData = JSON.parse(localStorage.getItem("userData"))
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
  onDismiss() {
    try {
      this.popoverController.dismiss();
      this.getSavedPets();
      this.getAdoptedPets();
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }
  usernameFlag: any;
  public hasError = (controlName: string, errorName: string) => {
    return this.signUpForm.controls[controlName].hasError(errorName);
  }
  removeSpace(event: string) {
    this.signUpForm.controls['userName'].setValue(event.replace(/\s/g, ''));
    console.log(event)
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  check_username_exists_or_not(value: any) {
    this.apiService.checkExistUsername(value).subscribe(async res => {
      let result = res.json();
      this.usernameFlag = result.flag;
      if (result.error == false && result.flag == 1) {
        let msg = "This username is already taken."
        await this.presentToast(msg)
      }
    })
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  async selectFile() {
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
          this.openGallery();
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
  takephoto() {
    const options: CameraOptions = {
      quality: 80,
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
        if (this.platform == 'android') {
          this.base64.encodeFile(newFilePath).then((base64File: string) => {
            this.base64Image = base64File;
            console.log("BASE 64 : ", base64File)
          }, (err) => {
            console.log(err);
          });
          var correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          var currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        } else {
          var correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          var currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }

      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })

  }
  openGallery() {
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
          console.log("newFilePath", newFilePath)
          this.base64.encodeFile(newFilePath).then((base64File: string) => {
            // console.log("base64File", base64File);
            this.base64Image = base64File;
          }, (err) => {
            console.log(err);
          });
          let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
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
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName = n + ".jpg";
    return newFileName;
  }
  newProfileImage: string = null;
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.newProfileImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  updateUserProfile() {
    this.isLoading = true;
    var url = this.apiService.base_url + "user/userprofile/" + this.userData.id;
    // File for Upload
    if (this.newProfileImage) {
      var targetPath = this.pathForImage(this.newProfileImage);
      // File name only
      var filename = this.newProfileImage;
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.upload(targetPath, url, options).then(data => {
        var newpeturls;
        newpeturls = data['response'];
        this.signUpForm.controls['profileImage'].setValue(newpeturls)
        this.saveProfile();
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      this.signUpForm.controls['profileImage'].setValue(this.userData.profileImage)
      this.saveProfile();
    }
  }
  saveProfile() {
    this.isLoading1 = true;
    let data = {
      userName: this.signUpForm.controls['userName'].value,
      website: this.signUpForm.controls['website'].value,
      about_ngo: this.signUpForm.controls['about_ngo'].value,
      newProfileImage: this.newProfileImage,
      profileImage: this.signUpForm.controls['profileImage'].value,
      phoneNumber: this.signUpForm.controls['phoneNumber'].value
    }
    console.log(data);
    localStorage.removeItem("userData")
    this.apiService.updateUserProfile(this.userData.id, data).subscribe(res => {
      console.log(res.json());
      this.presentToast("Profile Updated successfully")
      localStorage.setItem("userData", JSON.stringify(res.json().result))
      this.userData = JSON.parse(localStorage.getItem("userData"))
      this.isLoading1 = false;
      this.isEdit = false;
    })

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
  petAge(value: any) {
    let ageMonth = 0;
    let today: any = new Date();
    let birthdate: any = new Date(value);
    let ageDays = Math.round((today - birthdate) / (1000 * 60 * 60 * 24));
    ageMonth = Math.round(ageDays / 30);
    return ageMonth;
  }
  petGender(value: string) {
    if (value !== "NA") {
      return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
    } else {
      return value
    }
  }
  OnChangeInput2(event: string) {
    this.signUpForm.controls['userName'].setValue(event.toLocaleLowerCase());
  }
  close() {
    this.isEdit = false;
  }
}
