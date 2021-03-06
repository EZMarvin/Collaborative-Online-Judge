import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService {

  constructor(@Inject('auth') private auth,
              private router: Router) { }
  
  canActivate(): boolean {
    if (this.auth.authenticated()) {
      return true;
    } else {
      this.router.navigate['/'];
    }
  }

  isAdmin(): boolean {
    if (this.auth.authenticated() && this.auth.getProfile().roles.includes('Admin')) {
      return true;
    } else {
      return false;
    }
  }
}
