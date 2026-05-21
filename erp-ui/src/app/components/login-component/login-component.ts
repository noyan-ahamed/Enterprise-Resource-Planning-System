import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
hidePassword = true;

  login(form: NgForm){

    if(form.invalid){
      return;
    }

    console.log(form.value);
  

  // const loginData = {
  //   email: form.value.userName,
  //   password: form.value.userPassword
  // };

  // this.authService.login(loginData).subscribe({
  //   next: (response) => {

  //     console.log(response);

  //     localStorage.setItem('token', response.token);

  //     this.router.navigate(['/dashboard']);
  //   },

  //   error: (err) => {
  //     console.log(err);
  //   }
  // });
}
}
