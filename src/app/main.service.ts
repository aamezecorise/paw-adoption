import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  public isLoggedIn  = false;
  public username = '';
  public password = '';
  constructor() { }
}
