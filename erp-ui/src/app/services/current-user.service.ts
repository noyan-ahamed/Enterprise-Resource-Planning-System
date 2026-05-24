import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private API = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get(`${this.API}/me`, {
      withCredentials: true
    });
  }
}