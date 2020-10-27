import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string;
  private tokenTimer : any;
  isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}
  
  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  createuser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);

      });
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  login(email: string, password: string){
    const authdata : AuthData = { email, password };
    this.http
      .post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authdata)
      .subscribe(response => {
        this.token = response.token;
        if(this.token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate )
          this.router.navigate(['/']);
        }
        
      })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation)
    {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000)
      this.authStatusListner.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/'])
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  getToken(){
    return this.token;
  }


  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration*1000);
  }

}
