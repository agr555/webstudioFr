import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { DefaultResponseType } from '../../../../types/default-response.type';
import {LoginResponseType} from "../../../../types/login-response.type";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string | null = '';

  @Input() name: string = '';

  constructor(
private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.userName = this.authService.getIsLoggedInName();
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
        if (this.isLogged) {
           this.getUserName();
        }
      });

    if (this.isLogged) {
      this.authService.getInfo();
       this.getUserName();
    }
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        },
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('You have logged out');
    this.router.navigate(['/']);
  }

   getUserName(){
      const tokens = this.authService.getTokens();
      if(tokens){
        this.authService.getUserInfo()
          .subscribe((data: LoginResponseType | DefaultResponseType) =>{
            if((data as DefaultResponseType).error){
              console.log('Error');
            } else{
              this.userName = (data as LoginResponseType).name;
              // console.log(this.userName);
            }
          });
      }
    }
}
