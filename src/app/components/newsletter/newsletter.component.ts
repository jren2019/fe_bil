import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  faGithub = faGithub;
  faDiscord = faDiscord;
  faTwitter = faTwitter;
}
