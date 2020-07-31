import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../service/api.service';
declare var google: any;
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map') mapElement: ElementRef;
  address: string;
  map: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  zone: any;
  autocompleteItems: any = [];
  geocoder: any;
  markers: any = [];
  parentRef: any;
  locationData: any = {}
  constructor(public router: Router, private geolocation: Geolocation, private navParams: NavParams,public apiService: ApiService,
    private nativeGeocoder: NativeGeocoder, public modalCtrl: ModalController) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = '';
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }

  ngOnInit() {
    this.parentRef = this.navParams.data.parentRef;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.initMap(resp.coords.latitude, resp.coords.longitude);
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
  mapPosition: any;
  initMap(latitude: any, longitude: any) {
    let coords = { lat: latitude, lng: longitude };
    this.mapPosition = coords;
    let mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 17,
      zoomControl: false,
      gestureHandling:'greedy',
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
    console.log(this.map)
    this.map.addListener('dragend', () => {
      console.log(this.map)
      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    this.locationData = {}
    let options: NativeGeocoderOptions = {
      useLocale: false,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        console.log(result)
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        // this.address = this.address.slice(0, -2);
        this.locationData = {
          place: result[0].subLocality,
          district: result[0].subAdministrativeArea,
          state: result[0].administrativeArea,
          country: result[0].countryName,
          countryCode: result[0].countryCode,
          pincode: result[0].postalCode,
          // lat: result[0].latitude,
          // lng: result[0].longitude,
          lat: lattitude,
          lng: longitude,
          address: this.address
        }
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }
  updateSearchResults(inputValue: any) {
    this.autocomplete = inputValue
    if (inputValue == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: inputValue },
      (predictions, status) => {
        this.autocompleteItems = [];
        // this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
          // });
        });
      });
  }
  selectSearchResult(item) {
    this.markers = [];
    this.address = "";
    this.locationData = {};
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        this.mapPosition = results[0].geometry.location
        // let marker = new google.maps.Marker({
        //   position: this.mapPosition,
        //   map: this.map,
        //   draggable: true
        // })
        // this.markers.push(marker);
        this.map.setCenter(this.mapPosition);
        this.getAddressFromCoords(results[0].geometry.location.lat(), results[0].geometry.location.lng())
      }
    })
  }
  tryGeolocation() {
    this.markers = [];
    this.autocompleteItems = [];
    this.geolocation.getCurrentPosition().then((resp) => {
      this.mapPosition = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.map.panTo(this.mapPosition);

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  dismiss() {
    this.modalCtrl.dismiss({
    });
    this.parentRef.onDismiss();
  }
  saveLocation() {
      this.modalCtrl.dismiss({
        'location': this.locationData
      });
      this.parentRef.onDismiss();
  }
}
