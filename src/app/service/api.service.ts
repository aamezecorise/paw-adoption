import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: Http = null;
  public head = new Headers();
  public isNgo = false;
  public isLoggedIn = false;
  public currentLocation: any;
  public mapCoords: any;
  public isNotification = false;
  public isNavigateToAddPet = false;
  public isNavigateDashboard = false;
  base_url = environment.base_url;
  constructor(@Inject(Http) http: Http) {
    this.http = http;
    this.head.set("authorization", localStorage.getItem("token"))
  }
  //User services
  login(data: any): Observable<any> {
    return this.http.post(environment.loginUrl, data);
  }
  signUp(param: any): Observable<any> {
    return this.http.post(environment.signUpUrl, param)
  }
  googleSignUp(param: any): Observable<any> {
    return this.http.post(environment.googleSignUpUrl, param)
  }
  getUserById(id): Observable<any> {
    return this.http.get(environment.getUserByIdUrl + "/" + id)
  }
  getUserByEmailId(email): Observable<any> {
    return this.http.get(environment.getUserByEmailIdUrl + "/" + email)
  }
  forgotPassword(param: any): Observable<any> {
    return this.http.post(environment.forgotPasswordUrl, param)
  }
  resetPassword(param: any): Observable<any> {
    return this.http.post(environment.resetPasswordUrl, param)
  }
  savePassword(param: any): Observable<any> {
    return this.http.post(environment.savePasswordUrl, param)
  }
  checkUserExists(email:any){
    return this.http.get(environment.checkUserUrl + "/" + email)
  }
  checkExistEmail(email:any){
    return this.http.get(environment.checkExistEmail + "/" + email)
  }
  checkExistUsername(username:any){
    return this.http.get(environment.checkExistUsername + "/" + username)
  }
  updateUser(id, param: any, ): Observable<any> {
    return this.http.put(environment.updateUserUrl + "/" + id, param, {headers: this.head})
  }
  updateUserProfile(id, param: any, ): Observable<any> {
    return this.http.put(environment.updateUserProfileUrl + "/" + id, param, {headers: this.head})
  }
  updateUserDeviceID(email, param: any, ): Observable<any> {
    return this.http.put(environment.updateUserDeviceIDUrl + "/" + email, param, {headers: this.head})
  }
  updateUserS3Urls(uid, param: any): Observable<any> {
    return this.http.put(environment.updateUserImageUrl + "/" + uid, param, {headers: this.head})
  }

  

  //Pet Services
  addPet(param: any): Observable<any> {
    return this.http.post(environment.addPetUrl, param, {headers: this.head})
  }
  getAdoptionList(pageNumber:any): Observable<any> {
    return this.http.get(environment.getAdoptionListUrl + '/' + pageNumber, {headers: this.head})
  }

  updatePet(id, param: any, ): Observable<any> {
    return this.http.put(environment.updatePetUrl + "/" + id, param, {headers: this.head})
  }
  removeMedia(id, param: any, ): Observable<any> {
    return this.http.put(environment.removeMediaUrl + "/" + id, param, {headers: this.head})
  }
  updatePetProfile(id, param: any, ): Observable<any> {
    return this.http.post(environment.updatePetProfileUrl + "/" + id, param, {headers: this.head})
  }
  getAdoptedPets(id): Observable<any> {
    return this.http.get(environment.getAdoptedPetsUrl + "/" + id, {headers: this.head})
  }
  getSavedPets(id:any, pageNumber:any): Observable<any> {
    return this.http.get(environment.getSavedPetsUrl + "/" + id + "/" + pageNumber, {headers: this.head})
  }
  getPetsCount(id): Observable<any> {
    return this.http.get(environment.getPetsCountUrl + "/" + id, {headers: this.head})
  }
  bookMarkPet(param:any): Observable<any> {
    return this.http.post(environment.bookMarkPetUrl, param, {headers: this.head})
  }
  getBookMarkedPets(id): Observable<any> {
    return this.http.get(environment.getBookMarkedPetsUrl + "/" + id, {headers: this.head})
  }
  removeBookmarked(param:any): Observable<any> {
    return this.http.post(environment.removeBookMarkedPetsUrl, param, {headers: this.head})
  }
  checkBookmarked(param:any): Observable<any> {
    return this.http.post(environment.checkBookMarkedPetsUrl, param, {headers: this.head})
  }
  getDogBreeds(){
    return this.http.get(environment.dogsBreedsUrl, {headers: this.head})
  }
  getCatBreeds(){
    return this.http.get(environment.catsBreedsUrl, {headers: this.head})
  }
  filterPets(param: any): Observable<any>{
    return this.http.post(environment.filterPetsUrl, param, {headers: this.head})
  }
  updates3Urls(uid,pid, param: any): Observable<any> {
    return this.http.put(environment.updateMediaUrl + "/" + uid + "/" + pid, param, {headers: this.head})
  }
  
  //Enquiry Services
  makeEnquiry(param: any): Observable<any>{
    return this.http.post(environment.makeEnquiryUrl, param, {headers: this.head})
  }
  addAdoptersInfo(param: any): Observable<any>{
    return this.http.post(environment.addAdoptersUrl, param, {headers: this.head})
  }
  getEnquiryInfo(id:any){
    return this.http.get(environment.getEnquiryInfoUrl + "/" + id, {headers: this.head})
  }
  getAdoptersInfo(id:any){
    return this.http.get(environment.getAdoptersInfoUrl + "/" + id, {headers: this.head})
  }
  getEnquiryStatus(id:any, pid:any){
    return this.http.get(environment.getEnquiryStatusUrl + "/" + id + "/" + pid, {headers: this.head})
  }
  updateEnquiryInfo(id:any, param: any,){
    return this.http.put(environment.updateEnquiryInfoUrl + "/" + id, param, {headers: this.head})
  }
  updateAdoptersInfo(id:any, param: any,){
    return this.http.put(environment.updateAdoptersUrl + "/" + id, param, {headers: this.head})
  }

  //Notifications
  sendEnquiryNotification(param:any): Observable<any>{
    return this.http.post(environment.sendEnquiryNotificationUrl, param, {headers: this.head})
  }
  sendAcceptNotification(param:any): Observable<any>{
    return this.http.post(environment.sendAcceptNotificationUrl, param, {headers: this.head})
  }
  saveNotification(param:any): Observable<any>{
    return this.http.post(environment.saveNotificationUrl, param, {headers: this.head})
  }
  getPendingNotifications(id:any){
    return this.http.get(environment.getPendingNotificationUrl + "/" + id, {headers: this.head})
  }
  getAcceptedNotifications(id:any){
    return this.http.get(environment.getAcceptedNotificationUrl + "/" + id, {headers: this.head})
  }
  acceptNotification(id, param: any,){
    return this.http.put(environment.acceptNotificationUrl + "/" + id, param, {headers: this.head})
  }
  denyNotifications(param:any){
    return this.http.post(environment.denyNotificationUrl, param, {headers: this.head})
  }

  //Feedback
  addFeedback(param:any){
    return this.http.post(environment.feedbackUrl, param, {headers: this.head})
  }

  //Version
  getAppVersion(){
    return this.http.get(environment.getAppVersionUrl, {headers: this.head})
  }

  //report page.
  reportPage(param:any){
    return this.http.post(environment.reportPageUrl, param, {headers: this.head})
  }

  //Nearby Places
  getNearByPlaces(lat:any, long:any, radius:any): Observable<any>{
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.3697223,74.2664738&radius=150000&ty&key=AIzaSyAYGl-c0UaC0NYwwKTEju3NGGHTYmrPWfQ
    return this.http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + ',' + long + '&radius=' + radius + '&key=AIzaSyAYGl-c0UaC0NYwwKTEju3NGGHTYmrPWfQ')
  }

  //message
  SendMessage(senderId:any, receiverId:any, receiverName:any, message:any, senderImage:any, receiverImage:any): Observable<any> {
    return this.http.post(environment.sendMessageUrl + "/" + senderId + "/" + receiverId,{
      senderId,
      receiverId,
      receiverName,
      message,
      sendId:senderId,
      recId: receiverId,
      senderImage,
      receiverImage})
  }

  GetAllMessages(senderId:any, receiverId:any): Observable<any> {
    return this.http.get(environment.getallMessageUrl + "/" + senderId + "/" + receiverId, {headers: this.head})
  }

  GetAllMessagesbyId(senderId:any): Observable<any> {
    return this.http.get(environment.getallMessagebyidUrl + "/" + senderId ,{headers: this.head})
  }

  MarkMessages(sender:any,receiver:any): Observable<any> {
    return this.http.get(environment.markReceiverMessagesUrl + "/" + sender + "/" + receiver,{headers: this.head})
  }

  sendMessageNotification(param:any): Observable<any>{
    return this.http.post(environment.sendMessageNotificationUrl, param, {headers: this.head})
  }


}
