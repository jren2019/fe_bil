import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-prime-test',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="card flex justify-center">
      <p-button label="Check" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `]
})
export class PrimeTestComponent {} 