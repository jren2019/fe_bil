import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { marked } from 'marked';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function markedOptionsFactory(): any {
  const renderer = {
    heading({ text, depth }: { text: string; depth: number }) {
      const id = generateId(text);
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    }
  };
  return { renderer };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    importProvidersFrom(MarkdownModule.forRoot({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      }
    }))
  ]
};
