import { Component, OnInit, ViewChild } from "@angular/core";
import { MainService } from "../main.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ModalController,
  PopoverController,
  ActionSheetController,
  IonContent,
  ToastController,
  Platform,
  NavController,
} from "@ionic/angular";
import { MorepopoverComponent } from "../components/morepopover/morepopover.component";
import { ApiService } from "../service/api.service";
import {
  NativePageTransitions,
  NativeTransitionOptions,
} from "@ionic-native/native-page-transitions/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { PreferencePage } from "../preference/preference.page";
import { DetailsPage } from "../details/details.page";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
} from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
declare var google: any;
import analytics from "../../analytics";
import io from "socket.io-client";
import { Network } from "@ionic-native/network/ngx";
import { Dialogs } from "@ionic-native/dialogs/ngx";

@Component({
  selector: "app-adoption-list",
  templateUrl: "./adoption-list.page.html",
  styleUrls: ["./adoption-list.page.scss"],
})
export class AdoptionListPage implements OnInit {
  @ViewChild(IonContent) private content: IonContent;
  paramId: any;
  adoptionList: any = [];
  citywiselist: any = [];
  noncitywiseList: any = [];
  filteradoption: any = [];
  usercurrentLocation: any;
  userData: any = {};
  isLoading = true;
  data = true;
  socket: any;
  platform: any = "android";
  notification_count = 0;
  pageNumber = 1;
  showEmptyMsg = false;
  public pagingEnabled: boolean = true;
  msgString = "Pets data not availabel..!!";
  radius: Number = 15000;
  radiusInKm: any;
  gps: any;
  service: any;
  pincodeArray: any = [];
  nearByLocations: any = [];
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  backButtonSubscription;
  defaultProfileImage: any;
  persistsSelection: any = {
    category: null,
    gender: null,
    breeds: [],
    Pincodes: [],
  };
  districtlist: any = [];
  message: any;
  isFalse: boolean;
  constructor(
    public mainService: MainService,
    public router: Router,
    private nativePageTransitions: NativePageTransitions,
    public modalController: ModalController,
    public actionCtrl: ActionSheetController,
    public apiService: ApiService,
    private platForm: Platform,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
    public navCtrl: NavController,
    public network: Network,
    public dialog: Dialogs,
    private route: ActivatedRoute,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public popoverController: PopoverController
  ) {
    // this.socket = io("http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/");
    // this.socket = io('http://localhost:6559/');

    this.backButtonSubscription = this.platForm.backButton.subscribe(
      async () => {
        let view = this.router.url;
        if (view == "/adoption-list/1") {
          this.router.navigate(["/adoption-list", "1"]);
          if (view == "/adoption-list/1") {
            this.navCtrl.navigateRoot(["/adopt-landing"]);
          }
        } else if (view == "/adoption-list/2") {
          this.navCtrl.navigateRoot(["/adopt-landing"]);
        }
      }
    );
    this.pageNumber = 1;
    this.tryGeolocation();

    this.userData = JSON.parse(localStorage.getItem("userData"));
    // this.socket.on("refreshPage", () => {
    //   this.getallMessagesbyId(this.userData.id);
    // });

    //network connection code
    this.network.onDisconnect().subscribe(() => {
      this.disconnectToast();
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.connectToast();
      }, 2000);
    });
  }

  getAdoptionList() {
    this.persistsSelection = {
      category: null,
      gender: null,
      breeds: [],
      Pincodes: [],
    };
    this.showEmptyMsg = false;
    this.isLoading = true;
    this.filteradoption = [];
    this.adoptionList = [];
    this.citywiselist = [];
    this.apiService.getAdoptionList(1).subscribe((res) => {
      console.log(res);
      if (res.json().error == false) {
        this.citywiselist = res.json().result;
        this.filteradoption = res.json().result;
        // this.districtlist = this.adoptionList.location.district;
        // console.log(this.districtlist);
        console.log(this.citywiselist);
        this.noncitywiseList = [];
        this.filteradoption = [];
        for (let i = 0; i < this.citywiselist.length; i++) {
          if (
            this.citywiselist[i].location.district === this.usercurrentLocation
          ) {
            this.adoptionList.push(this.citywiselist[i]);
            this.filteradoption.push(this.citywiselist[i]);
          }
          if (
            this.citywiselist[i].location.district !== this.usercurrentLocation
          ) {
            this.noncitywiseList = [
              ...this.noncitywiseList,
              this.citywiselist[i],
            ];
          }
        }
        console.log(this.noncitywiseList);
        this.adoptionList = this.adoptionList.concat(this.noncitywiseList);
        this.filteradoption = this.filteradoption.concat(this.noncitywiseList);
        console.log(this.adoptionList);
        console.log(this.filteradoption);

        if (this.adoptionList.length > 0) {
          this.showEmptyMsg = false;
        } else {
          this.msgString = "Pets data not availabel..!!";
          this.showEmptyMsg = true;
        }
        this.isLoading = false;
      }
    });
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  ionViewWillEnter() {
      this.getallMessagesbyId(this.userData.id);
    // setTimeout(() => {
    //   this.data = false;
    // }, 3000);
  }

  nevigateToAdd() {
    this.apiService.isNavigateToAddPet = true;
    this.router.navigate(["/add-pet"]);
  }
  modal: any;
  async presentModal() {
    this.modal = await this.modalController.create({
      component: PreferencePage,
      componentProps: {
        parentRef: this,
        persistsSelection: JSON.stringify(this.persistsSelection),
      },
    });
    return await this.modal.present();
  }
  filterPets(data: any) {
    this.persistsSelection = data;
    // console.log(data)
    this.adoptionList = [];
    this.apiService.filterPets(data).subscribe((res) => {
      console.log(res);
      if (res.json().error == false) {
        this.adoptionList = res.json().result;
        console.log(this.adoptionList);
        if (this.adoptionList.length > 0) {
          this.showEmptyMsg = false;
          this.pagingEnabled = false;
        } else {
          this.showEmptyMsg = true;
          this.pagingEnabled = false;
        }
        this.isLoading = false;
      }
    });
  }
  async viewDetails(data: any) {
    this.modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: { data: JSON.stringify(data) },
    });
    return await this.modal.present();
    // let options: NativeTransitionOptions = {
    //       direction: 'left',
    //       duration: 250
    //     }
    //   this.nativePageTransitions.slide(options)
    //   .then(onSuccess => {
    //     //
    //   })
    //   .catch(onError => {
    //     //
    //   });
    // this.router.navigate(['/details', { data: JSON.stringify(data) }]);
  }
  async presentPopover(ev: any, data: any) {
    const popover = await this.popoverController.create({
      component: MorepopoverComponent,
      event: ev,
      componentProps: {
        paramTitle: "adoptionList",
        paramId: this.paramId,
        isNgo: false,
        petId: data._id,
        parentRef: this,
      },
      translucent: true,
    });
    return await popover.present();
  }
  onDismiss() {
    this.pagingEnabled = true;
    this.pageNumber = 1;
    try {
      this.popoverController.dismiss();
      if (this.paramId == "1") {
        this.getPendingNotifications();
        this.getAdoptionList();
      } else {
        this.isLoading = true;
        this.adoptionList = [];
        this.apiService
          .getSavedPets(this.userData.id, this.pageNumber)
          .subscribe((res) => {
            if (res.json().error == false) {
              this.isLoading = false;
              this.adoptionList = res.json().result;
            }
          });
      }
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }

  ngOnInit() {
    analytics.page();
    this.defaultProfileImage = "assets/img/profile_icon.png";
    this.pagingEnabled = true;
    this.pageNumber = 1;
    this.platform = localStorage.getItem("platForm");
    this.isLoading = true;
    setTimeout(() => {
      this.data = false;
    }, 3000);
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
    this.getallMessagesbyId(this.userData.id);
    let sub = this.route.params.subscribe((params) => {
      this.paramId = params["id"];
      if (this.paramId == "1") {
        this.getPendingNotifications();
        this.getAdoptionList();
      } else {
        this.getPendingNotifications();
        this.isLoading = true;
        this.adoptionList = [];
        this.filteradoption = [];
        this.apiService.getSavedPets(this.userData.id, 1).subscribe((res) => {
          if (res.json().error == false) {
            this.isLoading = false;
            this.adoptionList = res.json().result;
            this.filteradoption = res.json().result;
            console.log(this.adoptionList);
            console.log(this.filteradoption);
          }
        });
      }
    });
  }

  // add back when alpha.4 is out
  // trackEvent(item) {
  //   this.ga.trackEvent('Category', 'Tapped Action', 'Item Tapped is '+item, 0);
  // }

  getPendingNotifications() {
    this.notification_count = 0;
    this.apiService
      .getPendingNotifications(this.userData.id)
      .subscribe((res) => {
        let data = res.json();
        console.log(data);
        this.notification_count = data.count;
      });
  }
  seeNotification() {
    this.router.navigate(["/notification"]);
  }

  seeChatlist() {
    console.log("move to chat list");
    this.router.navigate(["/chatlist"]);
  }
  url: any;
  shareLink(id: any) {
    this.url = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com/pet/" + id;
    this.socialSharing
      .share(this.url)
      .then((res) => {
        //Success
      })
      .catch((e) => {
        //error
      });
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: "bottom",
    });
    toast.present();
  }

  async disconnectToast() {
    const toast = await this.toastController.create({
      message: "Network Disconnected",
      duration: 1000,
      color: "danger",
      position: "bottom",
    });
    toast.present();
  }

  async connectToast() {
    const toast = await this.toastController.create({
      message: "Network Connected",
      duration: 1000,
      color: "success",
      position: "bottom",
    });
    toast.present();
  }

  reportPage(petId: any) {
    let obj = {
      petId: petId,
      reportBy: this.userData.id,
    };
    console.log(obj);
    this.apiService.reportPage(obj).subscribe(async (res) => {
      await this.presentToast("The page has been reported.");
    });
  }
  petName(value: string) {
    return value.toUpperCase();
  }
  petGender(value: string) {
    if (value !== "NA") {
      return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
    } else {
      return value;
    }
  }
  isRefresherEnabled() {
    return true;
  }
  refresher(event: any) {
    this.persistsSelection = {
      category: null,
      gender: null,
      breeds: [],
      Pincodes: [],
    };
    let pageNumber = 1;
    this.pagingEnabled = true;
    if (this.paramId == "1") {
      this.showEmptyMsg = false;
      // this.isLoading = true;
      this.adoptionList = [];
      this.getPendingNotifications();
      this.apiService.getAdoptionList(pageNumber).subscribe((res) => {
        if (res.json().error == false) {
          this.adoptionList = res.json().result;
          var shufflearr = this.adoptionList;
          var shuffledata = this.shuffle(shufflearr);
          console.log(shufflearr);
          console.log(shuffledata);
          if (this.adoptionList.length > 0) {
            this.showEmptyMsg = false;
          } else {
            this.showEmptyMsg = true;
          }
          this.isLoading = false;
        }
      });
    } else {
      // this.isLoading = true;
      this.adoptionList = [];
      this.apiService
        .getSavedPets(this.userData.id, pageNumber)
        .subscribe((res) => {
          if (res.json().error == false) {
            this.isLoading = false;
            this.adoptionList = res.json().result;
          }
        });
    }
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  loadData(event: any) {
    this.persistsSelection = {
      category: null,
      gender: null,
      breeds: [],
      Pincodes: [],
    };
    this.pageNumber++;
    if (this.paramId == "1") {
      setTimeout(() => {
        this.apiService.getAdoptionList(this.pageNumber).subscribe((res) => {
          console.log(res);
          if (res.json().error == false) {
            let newData = res.json().result;
            if (newData.length > 0) {
              for (let i = 0; i < newData.length; i++) {
                this.adoptionList.push(newData[i]);
              }
            } else {
              event.target.disabled = true;
            }
            this.isLoading = false;
          }
        });
        event.target.disabled = true;
      }, 500);
    } else {
      this.isLoading = true;
      setTimeout(() => {
        this.apiService
          .getSavedPets(this.userData.id, this.pageNumber)
          .subscribe((res) => {
            if (res.json().error == false) {
              let newData = res.json().result;
              if (newData.length > 0) {
                for (let i = 0; i < newData.length; i++) {
                  this.adoptionList.push(newData[i]);
                }
              } else {
                event.target.disabled = true;
              }
              this.isLoading = false;
            }
          });
        event.target.disabled = true;
      }, 500);
    }
  }
  tryGeolocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log(resp);
        let mapPosition = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        };
        this.gps = new google.maps.LatLng(mapPosition.lat, mapPosition.lng);
        this.GetNearestPlaces(this.gps, this.radius);

        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 2,
        };

        this.nativeGeocoder
          .reverseGeocode(mapPosition.lat, mapPosition.lng, options)
          .then((result: NativeGeocoderResult[]) => {
            console.log(result[0].subAdministrativeArea);
            this.usercurrentLocation = result[0].subAdministrativeArea;
            console.log(this.usercurrentLocation);
          })
          .catch((error: any) => {
            // this.address = "Address Not Available!";
          });
        // .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0].subAdministrativeArea)))
        // .catch((error: any) => console.log(error));
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  GetNearestPlaces(gps, radiusInMetre) {
    let request = {
      location: gps,
      radius: radiusInMetre,
    };
    var container = document.getElementById("poiDiv");
    var service = new google.maps.places.PlacesService(container);
    var ref = this;
    service.nearbySearch(request, function (results, status) {
      console.log(results);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var nearByLocations = results;
        if (nearByLocations.length > 0) {
          var locationData1: any = [];
          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 2,
          };
          console.log(ref.nearByLocations.length);
          for (let i = 0; i < nearByLocations.length; i++) {
            ref.nativeGeocoder
              .reverseGeocode(
                nearByLocations[i].geometry.location.lat(),
                nearByLocations[i].geometry.location.lng(),
                options
              )
              .then((result: NativeGeocoderResult[]) => {
                console.log(result[0].subAdministrativeArea);
                ref.pincodeArray.push(result[0].postalCode);
                console.log(ref.pincodeArray);
              })
              .catch((error: any) => {
                // this.address = "Address Not Available!";
              });
          }
        }
      }
    });
  }
  petAge(value: any) {
    let ageMonth = 0;
    let today: any = new Date();
    let birthdate: any = new Date(value);
    let ageDays = Math.round((today - birthdate) / (1000 * 60 * 60 * 24));
    ageMonth = Math.round(ageDays / 30);
    return ageMonth;
  }

  searchfilter(event) {
    console.log(event);
    const val = event.target.value.toLowerCase();
    const filter = this.filteradoption.filter(function (d) {
      return d.petName.toLowerCase().indexOf(val) !== -1;
    });
    this.adoptionList = filter;
    this.adoptionList.offset = 0;
  }

  scrolltoTop() {
    this.content.scrollToTop(1000);
  }

  getallMessagesbyId(senderId) {
    this.isFalse = false;
    this.apiService.GetAllMessagesbyId(senderId).subscribe((res) => {
      this.message = res.json().result;
      var a;
      for (let i = 0; i < this.message.length; i++) {
        a = this.message[i].message;
        console.log(a);
        for (let j = 0; j < a.length; j++) {
          if (this.userData.fullName === a[j].receivername) {
            // this.isFalse = a[j].isRead;
            // console.log(this.isFalse);
            if (a[j].isRead == false) {
              console.log(a[j]);
              this.isFalse = true;
            }
          }
        }
      }
    });
  }
}
