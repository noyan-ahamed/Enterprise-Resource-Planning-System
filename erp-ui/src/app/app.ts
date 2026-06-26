import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
   selector: 'app-root',
   imports: [RouterOutlet],
   templateUrl: './app.html',
   styleUrl: './app.scss'
})
export class App {
   protected readonly title = signal('enterprise-resource-planning-app');

   constructor(
      private authService: AuthService
   ) { }

   // ngOnInit() {

   //    this.authService
   //        .loadCurrentUser()
   //        .subscribe({
   //           next: user => {

   //              this.authService
   //                  .currentUser
   //                  .set(user);

   //           },
   //           error: () => {}
   //        });
   // }
}
