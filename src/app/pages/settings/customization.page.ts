import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customization-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customization-layout">
      <div class="customization-title">Customizations</div>
      <div class="customization-cards">
        <div class="customization-card">
          <div class="card-title">Email</div>
          <div class="card-desc">Add your company's logo and branding color to your Work Order and Purchase Order emails</div>
          <a class="card-link" href="#">Customize Emails <span class="arrow">&gt;</span></a>
        </div>
        <div class="customization-card">
          <div class="card-title">Single Sign-On (SSO) Self-Serve <span class="lock">&#128274;</span></div>
          <div class="card-desc">Setup and manage your SSO preferences for an easier and more secure login.</div>
        </div>
        <div class="customization-card">
          <div class="card-title">Conversations</div>
          <div class="card-desc">Customize conversation preferences like the visibility of the "All Team" conversation.</div>
          <a class="card-link" href="#">Set Preferences <span class="arrow">&gt;</span></a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.customization-layout { max-width: 1100px; margin: 0 auto; padding: 2.5rem 0 1.5rem 0; }`,
    `.customization-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 2.2rem; }`,
    `.customization-cards { display: flex; flex-direction: column; gap: 2rem; }`,
    `.customization-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); border: 1px solid #e5eaf2; padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 0.7rem; }`,
    `.card-title { font-size: 1.25rem; font-weight: 700; color: #232b4d; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.5rem; }`,
    `.lock { color: #1a6cff; font-size: 1.1rem; margin-left: 0.2rem; }`,
    `.card-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.2rem; }`,
    `.card-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; margin-top: 0.2rem; display: inline-block; }`,
    `.card-link:hover { text-decoration: underline; }`,
    `.arrow { font-size: 1.1rem; margin-left: 0.2rem; }`,
    `@media (max-width: 900px) { .customization-layout { padding: 1.2rem 0; } .customization-cards { gap: 1.2rem; } }`
  ]
})
export class CustomizationSettingsPageComponent {} 