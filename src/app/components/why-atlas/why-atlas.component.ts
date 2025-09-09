import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface TimelineItem {
  id: string;
  text: string;
  active: boolean;
}

@Component({
  selector: 'app-why-InsightX',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './why-atlas.component.html',
  styleUrl: './why-atlas.component.scss'
})
export class WhyInsightXComponent {
  menuItems: TimelineItem[] = [
    { id: 'control', text: 'Your Instant Helper', active: false },
    { id: 'deploy', text: 'Functions Without Internet', active: false },
    { id: 'schema', text: 'Configurable and Extensible', active: true },
    { id: 'ci', text: 'Live Manufacturing Analytics', active: false },
    { id: 'migrations', text: 'Cognitive Knowledge Platform', active: false },
    { id: 'complacency', text: 'H&S complacency Identification', active: false },
  ];

  faArrowRight = faArrowRight;

  selectMenuItem(selectedItem: TimelineItem): void {
    // Reset all items to inactive
    this.menuItems.forEach(item => {
      item.active = false;
    });

    // Set only the clicked item to active
    selectedItem.active = true;

    // Scroll to the selected section
    this.scrollToSection(selectedItem.id);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
