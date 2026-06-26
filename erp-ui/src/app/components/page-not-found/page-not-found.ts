import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound {
  constructor(private router: Router,
    private authService: AuthService){}

  goToHome() {

    const role = this.authService.currentUser().roles?.[0]; // Assuming the first role is the primary role
    if (role === 'ADMIN') {
      this.router.navigate(['/admin-layout']);
    }
    else if (role === 'EMPLOYEE') {
      this.router.navigate(['/employee-layout']);
    }
    else {
      this.router.navigate(['/login-component']);
    }

  }
}
