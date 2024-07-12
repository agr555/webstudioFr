import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
private authService: AuthService,
              private _snackBar: MatSnackBar,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.authService.getIsLoggedIn();
    if (!isLoggedIn) {
      this._snackBar.open('Для доступа нужно авторизоваться!');
    }
    return isLoggedIn;
  }
}
