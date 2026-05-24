import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  public setRoles(roles:[]){
    localStorage.setItem('roles', JSON.stringify(roles));
  }
  public getRoles(): any[]{
    return JSON.parse(localStorage.getItem('roles'));
  }

  public setToken(token: any){
    localStorage.setItem('token', token)
  }

  public getToken(){
    return localStorage.getItem('token')
  }

  public clear(){
    localStorage.clear();
  }
  public isLoggedIn(){
    return this.getToken() && this.getRoles();
  }
}
