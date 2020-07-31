// const apiLink = 'https://localhost:6559/pawzeeble/'; // Local
// const apiLink = 'http://192.168.43.114:6559/pawzeeble/'; //local
// const apiLink = 'http://speclocal.com:6559/pawzeeble/'; //live server
const apiLink = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/"; //live server
// const apiLink = 'https://pawzeeble.com:6559/pawzeeble/'; //live server
export const environment = {
  production: true,
  isToggle: false,
  base_url: apiLink,
  //User
  loginUrl: apiLink + "user/login",
  signUpUrl: apiLink + "user/register",
  googleSignUpUrl: apiLink + "user/register_by_google",
  getUserByIdUrl: apiLink + "user/getuser_by_id",
  getUserByEmailIdUrl: apiLink + "user/getuser_by_email",
  forgotPasswordUrl: apiLink + "user/forgot_password",
  resetPasswordUrl: apiLink + "user/reset_password",
  savePasswordUrl: apiLink + "user/save_password",
  checkUserUrl: apiLink + "user/check_user",
  checkExistEmail: apiLink + "user/check_email",
  checkExistUsername: apiLink + "user/check_username",
  updateUserUrl: apiLink + "user/upadet_user",
  updateUserProfileUrl: apiLink + "user/upadet_user_profile",
  updateUserDeviceIDUrl: apiLink + "user/upadet_user_device_id",
  updateUserImageUrl: apiLink + "user/update_image_url",
  //Pet
  addPetUrl: apiLink + "pet/addpet",
  updatePetUrl: apiLink + "pet/updatePet",
  updatePetProfileUrl: apiLink + "pet/updatePetProfile",
  getfilterProfilesUrl: apiLink + "pet/filterProfile",
  getAdoptionListUrl: apiLink + "pet/get_pet_profiles",
  getAdoptedPetsUrl: apiLink + "pet/get_adopted_pets",
  getSavedPetsUrl: apiLink + "pet/get_saved_pets",
  getPetsCountUrl: apiLink + "pet/get_pet_count_by_user",
  bookMarkPetUrl: apiLink + "pet/bookmark_pet",
  getBookMarkedPetsUrl: apiLink + "pet/get_bookmarked_pets",
  removeBookMarkedPetsUrl: apiLink + "pet/remove_bookmarked_pet",
  checkBookMarkedPetsUrl: apiLink + "pet/check_isbookmarked",
  dogsBreedsUrl: apiLink + "pet/get_dog_breeds",
  catsBreedsUrl: apiLink + "pet/get_cat_breeds",
  filterPetsUrl: apiLink + "pet/filter_adoption_list",
  removeMediaUrl: apiLink + "pet/remove_media",
  updateMediaUrl: apiLink + "pet/update_image_urls",

  //enquiry
  makeEnquiryUrl: apiLink + "enquiry/make_enquiry",
  addAdoptersUrl: apiLink + "enquiry/add_adopters_info",
  updateAdoptersUrl: apiLink + "enquiry/update_adopters_info",
  reportPageUrl: apiLink + "enquiry/report_page",
  getEnquiryInfoUrl: apiLink + "enquiry/get_enquiry_info",
  getEnquiryStatusUrl: apiLink + "enquiry/get_enquiry_status",
  updateEnquiryInfoUrl: apiLink + "enquiry/update_enquiry_info",
  getAdoptersInfoUrl: apiLink + "enquiry/get_adopters_info",

  //Notification
  sendEnquiryNotificationUrl: apiLink + "notification/send_notification",
  sendAcceptNotificationUrl: apiLink + "notification/send_accept_notification",
  saveNotificationUrl: apiLink + "notification/save_notification",
  getPendingNotificationUrl: apiLink + "notification/get_pending_notifications",
  getAcceptedNotificationUrl:
    apiLink + "notification/get_accepted_notifications",
  acceptNotificationUrl: apiLink + "notification/accept_notification",
  denyNotificationUrl: apiLink + "notification/deny_notification",

  //Message
  sendMessageUrl: apiLink + "message/chat-messages",
  getallMessageUrl: apiLink + "message/chat-messages",
  getallMessagebyidUrl: apiLink + "message/chat-messages",
  markReceiverMessagesUrl: apiLink + "message/receiver-messages",
  sendMessageNotificationUrl:
    apiLink + "message/chat-messages/send_Newmessage_notification",

  //Help and Feedback
  feedbackUrl: apiLink + "user/feedback",

  //Version
  getAppVersionUrl: apiLink + "notification/get_version",
};
