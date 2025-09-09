import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { PartnersComponent } from '../../components/partners/partners.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { WhyInsightXComponent } from '../../components/why-atlas/why-atlas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    // PartnersComponent,
    NewsletterComponent,
    WhyInsightXComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
