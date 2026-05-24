import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:8080/authentication';
  requestHeader = new HttpHeaders(
    { 'No-Auth': 'True' }
  )

  constructor(private http: HttpClient,
  private router: Router
  ) { }

  public login(data: any) {
    return this.http.post(
      `${this.API_URL}/authenticate`,
      data,
      {
        headers: this.requestHeader,
        withCredentials: true
      }
    );
  }

  logout() {
    this.http.post(
      'http://localhost:8080/authentication/logout',
      {},
      { withCredentials: true }
    ).subscribe(() => {
      this.router.navigate(['/login']);
    })
  }
}
