import { Component, inject } from '@angular/core';
import { MatSidenavContainer, MatSidenav, MatSidenavContent, MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbar } from "@angular/material/toolbar";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-employee-layout',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatListModule,
    MatIcon,
    MatExpansionModule,
    MatSidenavContent,
    MatToolbar,
    MatMenu,
    RouterModule,
    MatButtonModule,
    RouterModule,
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
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.scss',
})
export class EmployeeLayout {
activeMenu: string | null = '';

  setActive(menu: string) {
    this.activeMenu = menu;
  }
  // Example – compute initials & color
userPhotoUrl: string | null = null;           // set from auth service
userName = 'Admin User';                      // from auth / profile

  get avatarBgColor(): string {
  // Simple hash-based color (consistent per user)
  let hash = 0;
  for (const char of this.userName) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}
get userInitials(): string {
  if (!this.userName) return 'AU';
  const names = this.userName.trim().split(/\s+/);
  return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
}

  onProfile(){

  }
  onSettings(){

  }
  logout(){}

}