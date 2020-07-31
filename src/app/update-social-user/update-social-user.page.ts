import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../service/authentication.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, ToastController, MenuController, ActionSheetController, Platform, NavController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-update-social-user',
  templateUrl: './update-social-user.page.html',
  styleUrls: ['./update-social-user.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateSocialUserPage implements OnInit {
  view = false;
  userData: any = {};
  loginBy: any;
  signUpForm: FormGroup;
  profilePicture: any = null;
  isLoading = false;
  usernameFlag: any;
  isClick = false;
  base64Identity: any = null;
  base64Image: any = null;
  isToggle: boolean;
  platform: any = "android";
  backButtonSubscription;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(public router: Router,
    public fb: FormBuilder,
    public apiService: ApiService,
    private storage: Storage,
    public actionCtrl: ActionSheetController,
    private authService: AuthenticationService,
    public loadingController: LoadingController,
    private nativePageTransitions: NativePageTransitions,
    public keyboard: Keyboard,
    public transfer: FileTransfer,
    public filePath: FilePath,
    public camera: Camera,
    public file: File,
    private crop: Crop,
    public base64: Base64,
    public route: ActivatedRoute,
    private platForm: Platform,
    private navCtrl: NavController,
    public toastController: ToastController, private menuCtrl: MenuController, ) {
      this.backButtonSubscription = this.platForm.backButton.subscribe(async () => {
        let view = this.router.url;
         if ((view == "/adopt-landing")) {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
          } else {
            await this.presentToast1();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else {
          this.navCtrl.pop();
        }
      });
      this.isToggle = false;
    this.signUpForm = fb.group({
      'userName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9_.]{3,30}$')])],
      'phoneNumber': [null, [Validators.maxLength(10), Validators.pattern('[7-9]{1}[0-9]{9}')]],
      'about_ngo': [null],
      'website': [null],
      // 'identification': [null, Validators.required],
      'identification': [null],
      // 'aadhar_number2': [null, [Validators.required, Validators.minLength(14)]],
      'aadhar_number2': [null],
      'field1': [null, [Validators.maxLength(4)]],
      'field2': [null, [Validators.maxLength(4)]],
      'field3': [null, [Validators.maxLength(4)]],
      'aadhar_image': [null],
      'pan_number2': [null],
      'pan_image': [null],
      "profileImage": [null]
    });
  }
  async presentToast1() {
    const toast = await this.toastController.create({
      message: "Press back again to exit App",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.signUpForm.controls[controlName].hasError(errorName);
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  removeSpace(event: string) {
    this.signUpForm.controls['userName'].setValue(event.replace(/\s/g, ''));
  }
  OnChangeInput2(event: string) {
    this.signUpForm.controls['userName'].setValue(event.toLocaleLowerCase());
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
  async selectProfile() {
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
  async selectFile() {
    this.isClick = true;
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
            this.takeIdentityPhoto()
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
            this.openGalleryforIdentity()
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
  _keyPress(event: string) {
    let value = event;
    if (value.length > 10) {
      this.signUpForm.controls['phoneNumber'].setValue(value.slice(0, 10))
    }
  }
  _keyPress2(event: string) {
    let value = event;
    if (value.length > 14) {
      this.signUpForm.controls['aadhar_number2'].setValue(value.slice(0, 14))
    }
  }
  field1Kepress(event: string) {
    let value = event;
    if (value.length > 4) {
      this.signUpForm.controls['field1'].setValue(value.slice(0, 4))
      this.signUpForm.controls['field2'].setValue(value.slice(4, 5))
      document.getElementById('box2').focus()
      this.signUpForm.controls['aadhar_number2'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
        );
        
    }
  }
  field2Kepress(event: string) {
    let value = event;
    if (value.length > 4) {
      this.signUpForm.controls['field2'].setValue(value.slice(0, 4))
      document.getElementById('box3').focus()
      this.signUpForm.controls['field3'].setValue(value.slice(4, 5))
      this.signUpForm.controls['aadhar_number2'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
        );
        
      }
  }
  field3Kepress(event: string) {
    let value = event;
    if (value.length > 3) {
      this.signUpForm.controls['field3'].setValue(value.slice(0, 4))
      this.signUpForm.controls['aadhar_number2'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
      );
    }
  }
  takephoto() {
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
      if(this.platform == 'android'){
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
      } else {
        this.crop.crop(imagePath, { quality: 100 })
        .then((newFilePath) => {
          console.log("newFilePath", newFilePath)
          this.base64.encodeFile(imagePath).then((base64File:string) =>{
            this.base64Image = base64File
          }, (err)=>{
            console.log(err)
          });
          let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }, (err)=>{
          console.log(err)
        })
      }
  
    }, (err) => {
      console.log(err)
    })
  }
  saveUser() {
    let profilePicture: any;
    let Data = {}
    if (this.loginBy === 'facebook') {
      Data = {
        fullName: this.userData.username,
        email: this.userData.email,
        profileImage: this.signUpForm.controls['profileImage'].value,
        profilePicture: this.userData.picture || null,
        userName: this.signUpForm.controls['userName'].value,
        about_ngo: this.signUpForm.controls['about_ngo'].value,
        aadhar_number2: this.signUpForm.controls['aadhar_number2'].value,
        pan_number2: this.signUpForm.controls['pan_number2'].value,
        aadhar_image: this.signUpForm.controls['aadhar_image'].value,
        pan_image: this.signUpForm.controls['pan_image'].value,
        phoneNumber: this.signUpForm.controls['phoneNumber'].value,
        device_id: localStorage.getItem('device_id'),
        isNgo: this.isToggle,
        website: this.signUpForm.controls['website'].value,
        isSocial: true
      }
    } else {
      Data = {
        fullName: this.userData.displayName,
        email: this.userData.email,
        profileImage: this.signUpForm.controls['profileImage'].value,
        profilePicture: this.userData.imageUrl || null,
        userName: this.signUpForm.controls['userName'].value,
        about_ngo: this.signUpForm.controls['about_ngo'].value,
        aadhar_number2: this.signUpForm.controls['aadhar_number2'].value,
        pan_number2: this.signUpForm.controls['pan_number2'].value,
        aadhar_image: this.signUpForm.controls['aadhar_image'].value,
        pan_image: this.signUpForm.controls['pan_image'].value,
        phoneNumber: this.signUpForm.controls['phoneNumber'].value,
        isNgo: this.isToggle,
        device_id: localStorage.getItem('device_id'),
        website: this.signUpForm.controls['website'].value,
        isSocial: true
      }
    }
    this.isLoading = true;
    this.apiService.googleSignUp(Data).subscribe(res => {
      let userData = res.json().userDetail;
      localStorage.setItem("token", res.json().token);
      this.apiService.head.set("authorization", res.json().token)
      localStorage.setItem("userData", JSON.stringify(userData))
      this.storage.set('USER_INFO', JSON.stringify(userData)).then((response) => {
        // this.dismiss();
        this.isLoading = false;
        this.signUpForm.reset();
        this.profilePicture = null;
        this.isClick = false;
        this.base64Identity = null;
        this.identityImage = null;
        this.router.navigate(['/adopt-landing']);
        this.navCtrl.pop();
        this.authService.authState.next(true);

      });
    })
  }
  ngOnInit() {
    this.platform = localStorage.getItem("platForm");
    this.route.params.subscribe(params => {
      this.userData = JSON.parse(params["data"]);
      this.loginBy = params["loginBy"];
    })
    if (this.loginBy === 'facebook') {
      this.profilePicture = this.userData.picture || null
    } else {
      this.profilePicture = this.userData.imageUrl || null
    }
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
  takeIdentityPhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 768,
      targetHeight: 520,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((filepath) => {
      this.base64.encodeFile(filepath).then((base64File: string) => {
        this.base64Identity = base64File;
        if (this.signUpForm.controls['identification'].value == '1') {
          this.signUpForm.controls['pan_number2'].setValidators([Validators.minLength(0)])
          this.signUpForm.controls['pan_number2'].updateValueAndValidity();
        } 
        if(this.signUpForm.controls['identification'].value == '2'){
          this.signUpForm.controls['aadhar_number2'].setValidators([Validators.minLength(0)])
          this.signUpForm.controls['aadhar_number2'].updateValueAndValidity();
        }
      }, (err) => {
        console.log(err);
      });
      var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
      var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
      this.copyFileToLocalDirIdentity(correctPath, currentName, this.createFileName());
    }, (err) => {
      console.log(err)
    })
  }
  lastImage: string = null;
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  openGalleryforIdentity() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 768,
      targetHeight: 520,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          this.base64.encodeFile(filePath).then((base64File: string) => {
            this.base64Identity = base64File;
            if (this.signUpForm.controls['identification'].value == '1') {
              this.signUpForm.controls['pan_number2'].setValidators([Validators.minLength(0)])
              this.signUpForm.controls['pan_number2'].updateValueAndValidity();
            } 
            if(this.signUpForm.controls['identification'].value == '2'){
              this.signUpForm.controls['aadhar_number2'].setValidators([Validators.minLength(0)])
              this.signUpForm.controls['aadhar_number2'].updateValueAndValidity();
            }
          }, (err) => {
            console.log(err);
          });
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDirIdentity(correctPath, currentName, this.createFileName());
        });
    }, (err) => {
      console.log(err)
    })
  }
  identityImage: string = null;
  private copyFileToLocalDirIdentity(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.identityImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  removePhoto() {
    this.base64Identity = null;
  }
  public uploadImage() {
    this.isLoading = true;
    var url = this.apiService.base_url + "user/user_profile_image";
    // File for Upload
    if (this.lastImage) {
      var targetPath = this.pathForImage(this.lastImage);
      // File name only
      var filename = this.lastImage;
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.upload(targetPath, url, options).then(data => {
        this.signUpForm.controls['profileImage'].setValue(this.lastImage)
        this.saveUser();
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      this.saveUser();
    }
  }
  createProfile(){
    this.isLoading = true;
    var url: any;
    if (this.signUpForm.controls['identification'].value == '1') {
      url = this.apiService.base_url + "user/aadhar_image";
    } else {
      url = this.apiService.base_url + "user/pan_image";
    }
    // File for Upload
    if (this.identityImage) {
      var targetPath = this.pathForImage(this.identityImage);
      // File name only
      var filename = this.identityImage;
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.upload(targetPath, url, options).then(data => {
        if (this.signUpForm.controls['identification'].value == '1') {
          this.signUpForm.controls['aadhar_image'].setValue(this.identityImage)
        } else {
          this.signUpForm.controls['pan_image'].setValue(this.identityImage)
        }
        this.uploadImage();
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      this.uploadImage();
    }
  }
  pancardValidation(event:string){
    if(this.signUpForm.controls['identification'].value == '1'){
      this.signUpForm.controls['aadhar_number2'].setValue(event)
    } else {
      this.signUpForm.controls['pan_number2'].setValue(event.toLocaleUpperCase());
    }
  }
  changeToggle(event: any) {
    this.isToggle = event.detail.checked;
  }
  radioChange(event: any) {
    this.view = true;
    if (event.value == "1") {
      this.signUpForm.controls['aadhar_number2'].setValidators([Validators.required, Validators.minLength(14)])
      this.signUpForm.controls['aadhar_number2'].updateValueAndValidity();
      this.signUpForm.controls['pan_number2'].clearValidators();
      this.signUpForm.controls['pan_number2'].reset();
      this.signUpForm.controls['pan_number2'].updateValueAndValidity();
      // this.signUpForm.controls['field1'].setValidators([Validators.required, Validators.minLength(4)])
      // this.signUpForm.controls['field2'].setValidators([Validators.required, Validators.minLength(4)])
      // this.signUpForm.controls['field3'].setValidators([Validators.required, Validators.minLength(4)])
      this.base64Identity = null;

    }
    if (event.value == "2") {
      this.signUpForm.controls['pan_number2'].setValidators([Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')])
      this.signUpForm.controls['pan_number2'].updateValueAndValidity();
      this.signUpForm.controls['aadhar_number2'].clearValidators();
      this.signUpForm.controls['aadhar_number2'].reset();
      this.signUpForm.controls['aadhar_number2'].updateValueAndValidity();
      this.signUpForm.controls['field1'].reset();
      this.signUpForm.controls['field2'].reset();
      this.signUpForm.controls['field3'].reset();
      // this.signUpForm.controls['field1'].clearValidators();
      // this.signUpForm.controls['field2'].clearValidators();
      // this.signUpForm.controls['field3'].clearValidators();
      this.base64Identity = null;
    }
  }
  hideKeyboard(){
    this.keyboard.hide();
  }
  _kepress4(event:string){
    let value = event;
    if (value.length > 10) {
      this.signUpForm.controls['pan_number2'].setValue(value.slice(0, 10))
    }
  }
}
