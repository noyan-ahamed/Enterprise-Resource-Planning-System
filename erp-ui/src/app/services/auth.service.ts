import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './user-auth-service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  currentUser =
    signal<any | null>(null);

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
      `${this.API_URL}/authenticate-cookies`,
      data,
      {
        // headers: this.requestHeader
        withCredentials: true
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


  //this is for local storage based authentication, not for cookie based authentication

  // logout() {
  //   this.http.post(
  //     'http://localhost:8080/authentication/logout',
  //     {},
  //     { withCredentials: true }
  //   ).subscribe(() => {
  //     this.router.navigate(['/login']);
  //   })
  // }


  //for cookie based authentication, not for jwt token based authentication
  loadCurrentUser() {
    return this.http.get<any>(
      'http://localhost:8080/user/me'
    );
  }

  async initializeApp(): Promise<void> {

  try {

    const user = await firstValueFrom(
      this.loadCurrentUser()
    );

    this.currentUser.set(user);

    // console.log("User Loaded:", user);

  } catch (err) {

    console.log("No logged in user");

    this.currentUser.set(null);

  }

}


  logout() {

    this.http.post(
      'http://localhost:8080/authentication/logout',
      {},
      {
        withCredentials: true
      }
    ).subscribe(() => {
      this.currentUser.set(null);
      this.router.navigate(
        ['/login-component']
      );
    });
  }
}
