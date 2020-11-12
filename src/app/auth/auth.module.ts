import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [LoginComponent, SignupComponent],

  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RecaptchaFormsModule,
    RecaptchaModule,
  ],
})
export class AuthModule {}
