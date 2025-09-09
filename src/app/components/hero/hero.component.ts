import { Component, OnInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface Testimonial {
  image: string;
  author: string;
  company: string;
  text: string;
  link: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, CommonModule, FontAwesomeModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      transition('visible <=> hidden', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer') svgContainer!: ElementRef;
  faCopy = faCopy;
  currentTestimonial = 0;
  private intervalId: any;
  private lastScrollTop = 0;
  logoState = 'visible';

  testimonials: Testimonial[] = [
    {
      image: '/assets/images/logo.svg',
      author: 'Viktor Farcic',
      company: 'DevOps Toolkit',
      text: 'InsightX is a great tool for managing databases, there you go, I said it!',
      link: 'https://www.youtube.com/watch?v=JLvHpXJ1hHk'
    },
    {
      image: '/assets/images/logo.svg',
      author: 'Brian Morrison II',
      company: 'PlanetScale',
      text: 'InsightX can be an incredible utility to add to your DevOps tool kit.',
      link: 'https://planetscale.com/blog/declarative-mysql-schemas-with-InsightX-cli'
    },
    {
      image: '/assets/images/logo.svg',
      author: 'Hacker News Discussion',
      company: '',
      text: 'InsightX helps you manage your database as code instead of managing your schema manually.',
      link: 'https://news.ycombinator.com/item?id=30020288'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize SVG animations after view is initialized
    setTimeout(() => {
      this.initializeSvgAnimations();
    }, 1000);

    // Rotate testimonials every 5 seconds
    this.intervalId = setInterval(() => {
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 5000);
  }

  get currentTestimonialData(): Testimonial {
    return this.testimonials[this.currentTestimonial];
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
      // Could add a toast notification here
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }

  private initializeSvgAnimations(): void {
    const svg = this.svgContainer.nativeElement.querySelector('.hero-svg');
    if (!svg) return;

    // Add hover effects to database elements
    const databaseElements = svg.querySelectorAll('.database-element');
    databaseElements.forEach((element: SVGElement) => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('active');
      });
      element.addEventListener('mouseleave', () => {
        element.classList.remove('active');
      });
    });

    // Animate connection lines
    const connectionLines = svg.querySelectorAll('.connection-line');
    connectionLines.forEach((line: SVGElement, index: number) => {
      setTimeout(() => {
        line.classList.add('drawing');
      }, index * 200);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
    this.lastScrollTop = scrollTop;

    // Update logo state based on scroll direction
    if (scrollDirection === 'down') {
      this.logoState = 'hidden';
    } else {
      this.logoState = 'visible';
    }
  }
}
