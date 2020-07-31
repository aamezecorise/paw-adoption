import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ModalController, LoadingController, MenuController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Location } from "@angular/common";
import { Breed, Breeds, CatBreed, CatBreeds } from '../demo-data';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { configFromSession } from '@ionic/core';
declare var google: any;
import analytics from '../../analytics';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.page.html',
  styleUrls: ['./preference.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreferencePage implements OnInit {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  page = 2;
  radiusRange:any;
  ageRanger:any;
  toggle = true;
  group = null;
  selected = [];
  isItemClicked = false;
  isLoading = false;
  isOpened = false;
  breeds: Breed[] = Breeds;
  dogBreeds: Breed[] = Breeds;
  catBreeds: CatBreed[] = CatBreeds;
  platform: any = "android";
  petCategory: any = null;
  gender: any = null;
  breedArray: any = [];
  parentRef: any;
  minAge: Number = 0;
  maxAge: Number = 12;
  lower = 0;
  upper = 1;
  radius: Number = 15000;
  radiusInKm: any;
  gps: any;
  service: any;
  pincodeArray: any = [];
  nearByLocations: any = [];
  persistsSelection:any = {};
  constructor(public modalCtrl: ModalController, public _elementRef: ElementRef, private menuCtrl: MenuController,
    public fb: FormBuilder, public keyboard: Keyboard, private nativePageTransitions: NativePageTransitions,
    private navParams: NavParams, public geolocation: Geolocation, public nativeGeocoder: NativeGeocoder,
    public modalController: ModalController,
    private location: Location, public loadingController: LoadingController, public apiService: ApiService) {
    // this.breeds = []
    this.apiService.getDogBreeds().subscribe(res => {
      this.dogBreeds = res.json().dog_breeds;
      this.breeds = this.dogBreeds.slice(0, 19)
    })
    this.apiService.getCatBreeds().subscribe(res => {
      this.catBreeds = res.json().cat_breeds;
    })

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
  radioChange(event: any) {
    if (event.value == 'dog') {
      this.breeds = this.dogBreeds;
    } else if (event.value == 'cat') {
      this.breeds = this.catBreeds
    } else {
      this.breeds = []
    }
  }
  async open() {
    this.breeds = []
    this.isItemClicked = true;
    await this.presentLoading();
    this.isOpened = this.selectComponent.isOpened;
    if (this.isOpened) {
      this.breeds = this.dogBreeds.slice(0, 19)
      if (this.petCategory == 'dog') {
        this.breeds = this.dogBreeds.slice(0, 19)
      }
      if (this.petCategory == 'cat') {
        this.breeds = this.catBreeds.slice(0, 19)
      }
      this.dismiss();
    }
  }
  async filter() {
    var pincodes = await this.tryGeolocation()
    let data = {
      category: this.petCategory,
      gender: this.gender,
      breeds: this.breedArray,
      minAge: this.minAge,
      maxAge: this.maxAge,
      Pincodes: this.pincodeArray
    }
    await this.parentRef.filterPets(data)
    this.modalController.dismiss({
    });
  }
  closeModal() {
    this.modalController.dismiss({
    });
  }
  clearSelection() {
    console.log(this.ageRanger)
    this.petCategory = null;
    this.ageRanger = null;
    this.radiusRange = 15;
    this.gender = null;
    this.breedArray = [];
    this.minAge = null;
    this.maxAge = null;
    this.pincodeArray = [];
  }
  keyboardCheck() {
    return !this.keyboard.isVisible;
  }
  onChange(event: any) {
    let lower = event.detail.value.lower;
    let upper = event.detail.value.upper;
    this.minAge = lower == 0 ? 0 : lower * 12;
    this.maxAge = upper * 12;

  }
  onChangeRadius(event: any) {
    this.radiusInKm = event.detail.value;
    this.radius = event.detail.value * 1000;

  }
  ngOnInit() {
    analytics.page()
    this.breedArray = [];
    this.tryGeolocation();
    this.platform = localStorage.getItem("platForm");
    this.parentRef = this.navParams.data.parentRef;
    this.persistsSelection = JSON.parse(this.navParams.data.persistsSelection);
    this.petCategory = this.persistsSelection.category;
    this.gender = this.persistsSelection.gender;
    this.breedArray = this.persistsSelection.breeds;
    this.pincodeArray = this.persistsSelection.Pincodes;
  }
  breedChanged(event: { component: IonicSelectableComponent, value: any }) {
    this.isItemClicked = false;
    for (let i = 0; i < event.value.length; i++) {
      this.breedArray.push(event.value[i].name)
    }
  }
  clear() {
    this.isItemClicked = false;
    this.breedArray = [];
    this.selectComponent.clear();
    this.selectComponent.close();
  }
  confirm() {
    this.selectComponent.confirm();
    this.selectComponent.close();
  }
  onClose(event: any) {
    this.isItemClicked = false;
  }
  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'up',
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
      direction: 'down',
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
  tryGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let mapPosition = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      // this.radius = 15000;
      this.gps = new google.maps.LatLng(mapPosition.lat, mapPosition.lng)
      this.GetNearestPlaces(this.gps, this.radius)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  GetNearestPlaces(gps, radiusInMetre) {
    let request = {
      location: gps,
      radius: radiusInMetre
    }
    var container = document.getElementById('poiDiv')
    var service = new google.maps.places.PlacesService(container);
    var ref = this;
    service.nearbySearch(request, function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var nearByLocations = results;
        if (nearByLocations.length > 0) {
          var locationData1: any = [];
          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 2
          };
          for (let i = 0; i < nearByLocations.length; i++) {
            ref.nativeGeocoder.reverseGeocode(nearByLocations[i].geometry.location.lat(), nearByLocations[i].geometry.location.lng(), options)
              .then((result: NativeGeocoderResult[]) => {
                ref.pincodeArray.push(result[0].postalCode)
              })
              .catch((error: any) => {
                // this.address = "Address Not Available!";
              });
          }
        }
      }
    })

  }
  getDogBreeds(page?: number, size?: number): [] {
    var breed: any = [];
    if (page && size) {
      breed = this.dogBreeds.slice((page - 1) * size, ((page - 1) * size) + size);
    }
    return breed;
  }
  getCatBreeds(page?: number, size?: number): [] {
    var breed: any = [];
    if (page && size) {
      breed = this.catBreeds.slice((page - 1) * size, ((page - 1) * size) + size);
    }
    return breed;
  }
  getMoreBreeds(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (this.petCategory == 'dog') {
      let breeds = this.getDogBreeds(this.page, 20);
      this.breeds = event.component.items.concat(breeds);
      // if (text) {
      //   ports = this.filterPorts(ports, text);
      // }
      event.component.items.push(this.breeds);
      event.component.endInfiniteScroll();
    }
    if (this.petCategory == 'cat') {
      let breeds = this.getCatBreeds(this.page, 20);
      this.breeds = event.component.items.concat(breeds);
      // if (text) {
      //   ports = this.filterPorts(ports, text);
      // }
      event.component.items.push(this.breeds);
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
    if (this.petCategory == 'dog') {
      breeds = this.dogBreeds.filter((v) => {
        if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
        else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
      })
    }
    if (this.petCategory == 'cat') {
      breeds = this.catBreeds.filter((v) => {
        if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
        else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
      })
    }
    event.component.items = breeds;
  }
}
