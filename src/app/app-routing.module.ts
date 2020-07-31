import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuard2, SessionGuard, AddPetGuard, DashboardGuard } from './service/auth-guard.service';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [SessionGuard] },
  // { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [SessionGuard] },
  // { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [AuthGuard2] },
  // { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule', canActivate: [AuthGuard2] },
  // { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  // { path: 'user-profile/:id', loadChildren: './user-profile/user-profile.module#UserProfilePageModule', canActivate: [AuthGuard] },
  // { path: 'adoption-list/:id', loadChildren: './adoption-list/adoption-list.module#AdoptionListPageModule', canActivate: [AuthGuard] },
  // { path: 'details', loadChildren: './details/details.module#DetailsPageModule', canActivate: [AuthGuard] },
  // { path: 'add-pet', loadChildren: './add-pet/add-pet.module#AddPetPageModule', canActivate: [AddPetGuard] },
  // { path: 'adopt-landing', loadChildren: './adopt-landing/adopt-landing.module#AdoptLandingPageModule', canActivate: [AuthGuard] },
  // { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule', canActivate: [AuthGuard] },
  // { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  // { path: 'update-social-user', loadChildren: './update-social-user/update-social-user.module#UpdateSocialUserPageModule' },
  // { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  // { path: 'plans', loadChildren: './plans/plans.module#PlansPageModule' },
  // { path: 'request-verification', loadChildren: './request-verification/request-verification.module#RequestVerificationPageModule' },
  // { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  // { path: 'update-info/:id', loadChildren: './update-info/update-info.module#UpdateInfoPageModule' },
  // { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  // { path: 'chatlist', loadChildren: './chatlist/chatlist.module#ChatlistPageModule' },



  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'user-profile/:id', loadChildren: './user-profile/user-profile.module#UserProfilePageModule' },
  { path: 'adoption-list/:id', loadChildren: './adoption-list/adoption-list.module#AdoptionListPageModule' },
  { path: 'details', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'add-pet', loadChildren: './add-pet/add-pet.module#AddPetPageModule' },
  { path: 'adopt-landing', loadChildren: './adopt-landing/adopt-landing.module#AdoptLandingPageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'update-social-user', loadChildren: './update-social-user/update-social-user.module#UpdateSocialUserPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'plans', loadChildren: './plans/plans.module#PlansPageModule' },
  { path: 'request-verification', loadChildren: './request-verification/request-verification.module#RequestVerificationPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'update-info/:id', loadChildren: './update-info/update-info.module#UpdateInfoPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  { path: 'chatlist', loadChildren: './chatlist/chatlist.module#ChatlistPageModule' },

  // { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
