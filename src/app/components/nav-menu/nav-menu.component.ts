import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  showSettingsDialog = false;

  constructor(private router: Router) {}

  openSettingsDialog(event: Event) {
    event.preventDefault();
    this.showSettingsDialog = true;
  }

  closeSettingsDialog() {
    this.showSettingsDialog = false;
  }

  navigateAndClose(route: string) {
    this.router.navigateByUrl(route);
    this.closeSettingsDialog();
  }
}
