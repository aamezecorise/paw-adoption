import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MorepopoverComponent } from './components/morepopover/morepopover.component';
import { HttpModule } from '@angular/http';
import { ApiService } from './service/api.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthGuard, AuthGuard2, SessionGuard, AddPetGuard, DashboardGuard } from './service/auth-guard.service';
import { AuthenticationService } from './service/authentication.service';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MaterialModule } from './material.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { ModalPageModule } from './modal/modal.module';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//Firebase notification
import { FCM } from '@ionic-native/fcm/ngx';
import { StartPage } from './start/start.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryPage } from './enquiry/enquiry.page';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { PreferencePage } from './preference/preference.page';
import { ChatPage } from './chat/chat.page';
import { ChatpagePage } from './chatpage/chatpage.page';
import { DetailsPage } from './details/details.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {Network} from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
const config: SocketIoConfig = { url: 'http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/', options: {} };

// const config: SocketIoConfig = { url: 'http://localhost:6559/pawzeeble/', options: {} };
//google-analytics
@NgModule({
  declarations: [
    AppComponent, 
    MorepopoverComponent,
    StartPage,
    EnquiryPage,
    PreferencePage,
    DetailsPage,
    ChatPage,
    ChatpagePage
  ],
  entryComponents: [MorepopoverComponent, StartPage, EnquiryPage, PreferencePage,DetailsPage,ChatpagePage,ChatPage],
  imports: [BrowserModule, IonicModule.forRoot({scrollAssist: true, scrollPadding: false}), AppRoutingModule,
    BrowserAnimationsModule,HttpModule, IonicStorageModule.forRoot(),
    MaterialModule, ModalPageModule,  CommonModule,
    FormsModule,
    // RouterModule.forChild(routes),
    ReactiveFormsModule,
    IonicSelectableModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    ApiService,
    AppVersion,
    FileTransfer,
    FileTransferObject,
    File,
    FilePath,
    FileChooser,
    Camera,
    Base64,
    MediaCapture,
    Media,
    Crop,
    Vibration,
    GooglePlus,
    Facebook,
    Keyboard,
    AuthGuard,
    AuthGuard2,
    SessionGuard,
    AddPetGuard,
    DashboardGuard,
    VideoEditor,
    Device,
    WebView,
    Geolocation,
    NativeGeocoder,
    SocialSharing,
    InAppBrowser,
    NativePageTransitions,
    AuthenticationService,
    AppRate,
    Network,
    Dialogs,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
