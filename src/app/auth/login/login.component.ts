import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  authstatusSubs: Subscription;
  disableBtn: boolean;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authstatusSubs = this.authService
      .getAuthStatusListner()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.disableBtn = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }

  resolved(captchaEvent: string) {
    if (captchaEvent) this.disableBtn = false;
    else this.disableBtn = true;
  }

  ngOnDestroy() {
    this.authstatusSubs.unsubscribe();
  }
}
