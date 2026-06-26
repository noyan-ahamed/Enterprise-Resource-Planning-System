import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { UserAuthService } from '../../services/user-auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  constructor(private authService: AuthService,
    private userAuthService: UserAuthService,
    private router: Router
  ) { }
  hidePassword = true;

  //this is for local storage based authentication, not for cookie based authentication

  // login(form: NgForm) {

  //   if (form.invalid) {
  //     return;
  //   }

  //   this.authService.login(form.value).subscribe(
  //     (res: any) => {

  //       this.userAuthService.setRoles(res.roles)
  //       this.userAuthService.setToken(res.token)
  //       const role = res.roles[0];

  //       if (role === 'ADMIN') {
  //         this.router.navigate(['/admin-layout'])
  //       } else if (role === 'HR') {
  //         this.router.navigate(['/hr-dashboard'])
  //       } else {
  //         this.router.navigate(['/employee-layout'])
  //       }
  //     },
  //     (error) => console.log(error)


  //   )
  // }




  //this is for cookie based authentication, not for jwt token based authentication
  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.login(form.value)
      .subscribe(() => {

        this.authService
          .loadCurrentUser()
          .subscribe((user: any) => {

            this.authService.currentUser.set(user);

            const role = user.roles?.[0];

            if (!role) {
              console.error('No role found');
              return;
            }

            if (role === 'ADMIN') {
              this.router.navigate(['/admin-layout']);
            }
            else if (role === 'HR') {
              this.router.navigate(['/hr-layout']);
            }
            else {
              this.router.navigate(['/employee-layout']);
            }

          });

      });
  }
}
