import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatToolbar,
    // RouterOutlet
    MatIcon,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
    
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
activeMenu: string | null = '';

  setActive(menu: string) {
    this.activeMenu = menu;
  }

  router = inject(Router)

   logout() {
  localStorage.removeItem('userId');
  this.router.navigateByUrl('/login');
}

// Example – compute initials & color
userPhotoUrl: string | null = null;           // set from auth service
userName = 'Admin User';                      // from auth / profile

get userInitials(): string {
  if (!this.userName) return 'AU';
  const names = this.userName.trim().split(/\s+/);
  return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
}

get avatarBgColor(): string {
  // Simple hash-based color (consistent per user)
  let hash = 0;
  for (const char of this.userName) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}
onSettings(){

}
onProfile(){

}
}
