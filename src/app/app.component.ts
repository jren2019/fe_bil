import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AssetX - Manage your database schema as code';
  showHeader = true;
  showFooter = true;
  isAppLayout = false;
  constructor(public router: Router) {
    this.updateHeaderVisibility(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateHeaderVisibility(event.urlAfterRedirects);
    });
  }
  updateHeaderVisibility(url: string) {
    const appRoutes = /^\/(login|splash|signup|workorder|purchaseorders|reporting|requests|assets|messages|categories|category\/tags(?:\/.*)?|library|manufacturing|meters|automations|locations|teams|vendors|parts|messages\/new|settings\/general|settings\/features|settings\/subscription|settings\/teammates|settings\/customization|settings\/integrations|settings\/privacy|settings\/manufacturing|finance|accounting)|\/sales$/.test(url.split('?')[0]);

    // External routes should show header/footer (like public pages)
    const externalRoutes = /^\/external\//.test(url.split('?')[0]);

    // Hide header/footer for app pages, show header but hide footer for external pages
    this.showHeader = !appRoutes || externalRoutes;
    this.showFooter = !appRoutes && !externalRoutes;

    // Use app layout (100% height, no scroll) for app pages but not for external pages
    this.isAppLayout = appRoutes && !externalRoutes;
  }
}
