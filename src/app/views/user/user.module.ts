import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PolicyComponent } from './policy/policy.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PolicyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
})
export class UserModule {
}
