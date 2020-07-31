import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ActionSheetController, LoadingController, IonContent, ToastController, MenuController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { async } from '@angular/core/testing';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupPage implements OnInit {
  @ViewChild('slides') slides: any;
  sliderOpts = {
    autoplay: false,
    speed: 500,
  };
  view = false;
  base64Image: any = null;
  base64Identity: any = null;
  isToggle: boolean;
  pwdToggle: boolean;
  activeIndex = 0;
  signUpForm: FormGroup;
  type = "password";
  isLoading = false;
  isNext = false;
  emailFlag: any;
  usernameFlag: any;
  isClick = false;
  platform: any = "android";
  newuserId:any;
  profileImage:any;

  @ViewChild(IonContent) content: IonContent;
  // @ViewChild('phoneInput') inputEl1: ElementRef;
  // @ViewChild('usernameInput') inputEl2: ElementRef;
  constructor(public router: Router, public apiService: ApiService,
    public actionCtrl: ActionSheetController,
    public fb: FormBuilder, public camera: Camera,
    public transfer: FileTransfer,
    public filePath: FilePath,
    private crop: Crop,
    public file: File,
    public loadingController: LoadingController,
    public base64: Base64,
    private menuCtrl: MenuController,
    private renderer: Renderer2,
    public keyboard: Keyboard, public toastController: ToastController,
    private nativePageTransitions: NativePageTransitions,
  ) {
    this.isToggle = false;
    this.signUpForm = fb.group({
      'fullName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\s]*$')])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-zA-Z]{2,}$')])],
      'phoneNumber': [null, [Validators.maxLength(10), Validators.pattern('[7-9]{1}[0-9]{9}')]],
      'field1': [null, [Validators.maxLength(4)]],
      'field2': [null, [Validators.maxLength(4)]],
      'field3': [null, [Validators.maxLength(4)]],
      'password': [null, Validators.required],
      'userName': [null, Validators.compose([Validators.required, Validators.pattern('^[a-z0-9_.]{3,18}$')])],
      'about_ngo': [null],
      'profileImage': [null],
      'website': [null],
      'isNgo': [null],
      'isSocial': [null],
      // 'identification': [null, Validators.required],
      'identification': [null],
      'aadhar_number': [null],
      'aadhar_image': [null],
      'pan_number': [null],
      'pan_image': [null],
    });
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
  fileTransfer: FileTransferObject = this.transfer.create();
  ngOnInit() {
    this.platform = localStorage.getItem("platForm");
    this.signUpForm.reset();
    this.isNext = false;
  }
  OnChangeInput(event: string) {
    this.signUpForm.controls['email'].setValue(event.toLocaleLowerCase());
  }
  OnChangeInput2(event: string) {
    this.signUpForm.controls['userName'].setValue(event.toLocaleLowerCase());
  }
  removeSpace(event: string) {
    this.signUpForm.controls['userName'].setValue(event.replace(/\s/g, ''));
  }
  _keyPress(event: string) {
    let value = event;
    if (value.length > 10) {
      this.signUpForm.controls['phoneNumber'].setValue(value.slice(0, 10))
    }
  }
  _keyPress2(event: string) {
    let value = event;
    if (value.length > 12) {
      this.signUpForm.controls['aadhar_number'].setValue(value.slice(0, 12))
    }
  }
  _keyPressPwd(event: string) {
    let value = event;
    if (value.length > 15) {
      this.signUpForm.controls['password'].setValue(value.slice(0, 15))
    }
  }
  field1Kepress(event: string) {
    let value = event;
    if (value.length > 4) {
      this.signUpForm.controls['field1'].setValue(value.slice(0, 4))
      this.signUpForm.controls['field2'].setValue(value.slice(4, 5))
      this.signUpForm.controls['aadhar_number'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
        );
        document.getElementById('box2').focus()
    }
  }
  field2Kepress(event: string) {
    let value = event;
    if (value.length > 4) {
      this.signUpForm.controls['field2'].setValue(value.slice(0, 4))
      this.signUpForm.controls['field3'].setValue(value.slice(4, 5))
      this.signUpForm.controls['aadhar_number'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
        );
        document.getElementById('box3').focus()
    }
  }
  field3Kepress(event: string) {
    let value = event;
    if (value.length > 3) {
      this.signUpForm.controls['field3'].setValue(value.slice(0, 4))
      this.signUpForm.controls['aadhar_number'].setValue(
        this.signUpForm.controls['field1'].value + ' ' + this.signUpForm.controls['field2'].value + ' ' + this.signUpForm.controls['field3'].value
      );
    }
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  navigateBack() {
    this.router.navigate(['/login']);
  }
  changeToggle(event: any) {
    this.isToggle = event.detail.checked;
  }
  clickNext() {
    this.isNext = true;
    this.content.scrollToTop(400);
  }
  clickPrev() {
    this.isNext = false;
    this.content.scrollToTop(400);
  }
  async getIndex(event: any) {
    this.content.scrollToTop(400);
    this.activeIndex = await this.slides.getActiveIndex((number) => {
      return number;
    })
  }
  signUp() {
    this.signUpForm.controls['isSocial'].setValue(false)
      this.isLoading = true;
      this.signUpForm.controls['isNgo'].setValue(this.isToggle)
      this.signUpForm.controls['isSocial'].setValue(false)
      console.log(this.signUpForm.value);
      this.apiService.signUp(this.signUpForm.value).subscribe(res => {
        console.log(res.json().result);
        this.newuserId = res.json().result._id
        this.uploadImage();
        this.isLoading = false;
        this.router.navigate(['/login']);
        this.signUpForm.reset();
        this.base64Image = null;
        this.base64Identity = null;
        this.presentToast('You have signed up successfully')
      })
      setTimeout(() => {
        this.isLoading = false;
        for (let i in this.signUpForm.controls) {
          this.signUpForm.controls[i].markAsTouched();
        }
      }, 500);
  }

  updateUserS3Urls(){
    var data = {
      profileImage: this.profileImage
    }
    this.apiService.updateUserS3Urls(this.newuserId,data).subscribe(res => {
      console.log(res);
      this.router.navigate(['/login']);
      this.signUpForm.reset();
      this.presentToast('You have signed up successfully')
      // this.dismiss();
      // this.router.navigate(['/adoption-list', '2'])
    })
  }
  async selectFile(value: any) {
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          if (value == 'profile') {
            this.takephoto()
          } else {
            this.takeIdentityPhoto()
          }

        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
          if (value == 'profile') {
            this.openGallery()
          } else {
            this.openGalleryforIdentity()
          }
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
            debugger
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
      if (this.platform == 'android') {
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
            this.base64.encodeFile(imagePath).then((base64File: string) => {
              this.base64Image = base64File
            }, (err) => {
              console.log(err)
            });
            let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
            let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }, (err) => {
            console.log(err)
          })
      }

    }, (err) => {
      console.log(err)
    })
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
        // if (this.signUpForm.controls['identification'].value == '1') {
        //   this.signUpForm.controls['pan_number'].setValidators([Validators.minLength(0)])
        //   this.signUpForm.controls['pan_number'].updateValueAndValidity();
        // }
        // if (this.signUpForm.controls['identification'].value == '2') {
        //   this.signUpForm.controls['aadhar_number'].setValidators([Validators.minLength(0)])
        //   this.signUpForm.controls['aadhar_number'].updateValueAndValidity();
        // }
      }, (err) => {
        console.log(err);
      });
      var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
      var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
      this.copyFileToLocalDirIdentity(correctPath, currentName, this.createFileName());
    }, (err) => {
      console.log(err)
    })

    // this.camera.getPicture(options).then((filepath) => {
    //   this.crop.crop(filepath, { quality: 100 })
    //     .then((newFilePath) => {
    //       this.base64.encodeFile(newFilePath).then((base64File: string) => {
    //         console.log("base64File", base64File);
    //         this.base64Identity = base64File;
    //       }, (err) => {
    //         console.log(err);
    //       });
    //       var correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
    //       var currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
    //       this.copyFileToLocalDirIdentity(correctPath, currentName, this.createFileName());

    //     }, (err) => {
    //       console.log(err)
    //     })
    // }, (err) => {
    //   console.log(err)
    // })
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
            // if (this.signUpForm.controls['identification'].value == '1') {
            //   this.signUpForm.controls['pan_number'].setValidators([Validators.minLength(0)])
            //   this.signUpForm.controls['pan_number'].updateValueAndValidity();
            // }
            // if (this.signUpForm.controls['identification'].value == '2') {
            //   this.signUpForm.controls['aadhar_number'].setValidators([Validators.minLength(0)])
            //   this.signUpForm.controls['aadhar_number'].updateValueAndValidity();
            // }
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
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
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
  identityImage: string = null;
  private copyFileToLocalDirIdentity(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.identityImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }
  public uploadImage() {
    this.isLoading = true;
    var url = this.apiService.base_url + "user/userprofile/" + this.newuserId;
    // File for Upload
    console.log(this.lastImage);
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
        var newpeturls;
        newpeturls = data['response'];
        this.profileImage = newpeturls;
        console.log(this.profileImage,'user profile new');

        if(this.profileImage){
          this.updateUserS3Urls();
        }else{
          this.router.navigate(['/login']);
          this.signUpForm.reset();
          this.presentToast('You have signed up successfully')
        }
        // this.signUpForm.controls['profileImage'].setValue(this.lastImage)
        // this.signUp();
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      // this.signUp();
    }
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  togglePassword() {
    this.pwdToggle = !this.pwdToggle;
    if (this.pwdToggle) {
      this.type = "text"
    } else {
      this.type = "password"
    }
  }
  check_mail_exists_or_not(value: any) {
    this.apiService.checkExistEmail(value).subscribe(async res => {
      let result = res.json();
      this.emailFlag = result.flag;
      if (result.error == false && result.flag == 1) {
        let msg = "An account with this email already exists."
        await this.presentToast(msg)
      }
    })
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
  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }
    this.nativePageTransitions.slide(options).then().catch();
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 300
    }
    this.nativePageTransitions.slide(options).then().catch();
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(false);
  }
  createProfile() {
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
  //Remove Idenity preview image
  removePhoto() {
    this.base64Identity = null;
  }
  pancardValidation(event: string) {
    if (this.signUpForm.controls['identification'].value == '1') {
      this.signUpForm.controls['aadhar_number'].setValue(event)
    } else {
      this.signUpForm.controls['pan_number'].setValue(event.toLocaleUpperCase());
    }
  }
  radioChange(event: any) {
    this.view = true;
    if (event.value == "1") {
      this.signUpForm.controls['aadhar_number'].setValidators([Validators.required, Validators.minLength(14)])
      this.signUpForm.controls['aadhar_number'].updateValueAndValidity();
      this.signUpForm.controls['pan_number'].clearValidators();
      this.signUpForm.controls['pan_number'].reset();
      this.signUpForm.controls['pan_number'].updateValueAndValidity();
      this.base64Identity = null;
    }
    if (event.value == "2") {
      this.signUpForm.controls['pan_number'].setValidators([Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')])
      this.signUpForm.controls['pan_number'].updateValueAndValidity();
      this.signUpForm.controls['aadhar_number'].clearValidators();
      this.signUpForm.controls['aadhar_number'].reset();
      this.signUpForm.controls['aadhar_number'].updateValueAndValidity();
      this.signUpForm.controls['field1'].reset();
      this.signUpForm.controls['field2'].reset();
      this.signUpForm.controls['field3'].reset();
      this.base64Identity = null;
    }
  }
  hideKeyboard() {
    this.keyboard.hide();
  }
  _kepress4(event:string){
    let value = event;
    if (value.length > 10) {
      this.signUpForm.controls['pan_number'].setValue(value.slice(0, 10))
    }
  }

}
