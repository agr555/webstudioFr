import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { LoginResponseType } from '../../../../types/login-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[A-ZА-ЯЁ][a-zа-яё]*(?:\\s[A-ZА-ЯЁ][a-zа-яё]*)*?$')]],
    // email: ['', [Validators.email, Validators.required]],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$')]],
    agree: [false, [Validators.requiredTrue]],
  });

  constructor(
private fb: FormBuilder,
private authService: AuthService,
              private _snackBar: MatSnackBar,
private router: Router,
  ) {
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
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
              this._snackBar.open('отсюда');

              throw new Error(error);
            }

            // set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            if (this.signupForm.value.name) {
              this.authService.userName = this.signupForm.value.name;
            }

            this._snackBar.open('Login success');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Signup error!');
            }
          },
        });
    }
  }
}
