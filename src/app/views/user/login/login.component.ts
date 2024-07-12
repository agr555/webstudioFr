import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginResponseType } from '../../../../types/login-response.type';
import { DefaultResponseType } from '../../../../types/default-response.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
private fb: FormBuilder,
private authService: AuthService,
              private _snackBar: MatSnackBar,
private router: Router,
  ) {
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = '';
            if ((data as DefaultResponseType).error != undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Error of signup';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            // set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Login success');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Error of login!');
            }
          },
        });
    }
  }
}
