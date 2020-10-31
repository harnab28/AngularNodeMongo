
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service'

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
    
})
export class SignupComponent implements OnInit , OnDestroy {
    isLoading: boolean = false;
    authStatusSubs: Subscription;

    constructor(public authService: AuthService ){

    }

    ngOnInit(){
        this.authStatusSubs = this.authService.getAuthStatusListner().subscribe( (authStatus) => {
            this.isLoading = false;
        });
    } 

    onSignup(form: NgForm){
        if(form.invalid)
            return;
        this.isLoading = true;
        this.authService.createuser(form.value.email, form.value.password);
    }

    ngOnDestroy(){
        this.authStatusSubs.unsubscribe();
    }
}