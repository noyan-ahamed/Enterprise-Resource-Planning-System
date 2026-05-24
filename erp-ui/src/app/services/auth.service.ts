import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private API_URL = 'http://localhost:8080/authentication';
    requestHeader = new HttpHeaders(
      {'No-Auth':'True'}
    )
    
  constructor(private http :HttpClient){}

   public login(data: any){
    return this.http.post(`${this.API_URL}/authenticate`,data, {headers: this.requestHeader});
  }
}
