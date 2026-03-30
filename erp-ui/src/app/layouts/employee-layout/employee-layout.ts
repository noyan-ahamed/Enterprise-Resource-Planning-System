import { Component, inject } from '@angular/core';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbar } from "@angular/material/toolbar";
import { MatMenu } from "@angular/material/menu";
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
    MatButtonModule
],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.scss',
})
export class EmployeeLayout {
activeMenu: string | null = '';

  setActive(menu: string) {
    this.activeMenu = menu;
  }

  onProfile(){

  }
  onSettings(){

  }
  logout(){}

}