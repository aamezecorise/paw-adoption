import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( public authenticationService: AuthenticationService) { }

  canActivate(): boolean {
    return this.authenticationService.isAuthenticated();
  }
}
@Injectable()
export class AuthGuard2 implements CanActivate {

  constructor( public authenticationService: AuthenticationService) { }

  canActivate(): boolean {
    if(!localStorage.getItem('token')){
      return true;
    } else {
      return false;
    }
  }
}
@Injectable()
export class SessionGuard implements CanActivate {

  constructor( public authenticationService: AuthenticationService) { }

  canActivate(): boolean {
    if(!sessionStorage.getItem('session') && !localStorage.getItem('token')){
      return true;
    } else {
      return false;
    }
  }
}
@Injectable()
export class AddPetGuard implements CanActivate {

  constructor( public authenticationService: AuthenticationService, public authService: ApiService) { }

  canActivate(): boolean {
    if(this.authService.isNavigateToAddPet){
      return true;
    } else {
      return false;
    }
  }
}
@Injectable()
export class DashboardGuard implements CanActivate {

  constructor( public authenticationService: AuthenticationService, public authService: ApiService) { }

  canActivate(): boolean {
    if(this.authService.isNavigateDashboard){
      return true;
    } else {
      return false;
    }
  }
}
