import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-code-display',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './code-display.component.html',
  styleUrl: './code-display.component.scss'
})
export class CodeDisplayComponent {
  @Input() code: string = '';
  @Input() language: string = 'json';
  @Input() showLineNumbers: boolean = false;

  faCopy = faCopy;

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code).then(() => {
      console.log('Text copied to clipboard');
      // Could add a toast notification here
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }
}
