import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './user-auth-service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:8080/authentication';
  requestHeader = new HttpHeaders(
    { 'No-Auth': 'True' }
  )

  constructor(private http: HttpClient,
    private router: Router,
    private userAuthService: UserAuthService
  ) { }

  public login(data: any) {
    return this.http.post(
      `${this.API_URL}/authenticate`,
      data,
      {
        headers: this.requestHeader
        // withCredentials: true
      }
    );
  }

  public roleMatch(allowRoles: string[]): boolean {
    const userRoles: string[] = this.userAuthService.getRoles();
    for (let i = 0; i < userRoles.length; i++) {
      for (let j = 0; j < allowRoles.length; j++) {
        if (userRoles[i] === allowRoles[j]) {
          return true;
        }
      }
    }
    return false;
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
