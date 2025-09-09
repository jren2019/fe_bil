import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-layout">
      <div class="privacy-title">Data & Privacy</div>
      <div class="privacy-section">
        <div class="section-header">Asset Connect</div>
        <div class="section-desc">Get support from the experts. Share basic Asset Information with OEMs so they can help you identify issues and resolve them quickly.</div>
        <div class="privacy-card">
          <div class="card-content">
            <div>
              <div class="card-title">Share Asset Information</div>
              <div class="card-desc">Give OEMs visibility into asset status and location, with control over what information you share.</div>
            </div>
            <label class="switch">
              <input type="checkbox" [checked]="false" disabled>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.privacy-layout { max-width: 900px; margin: 0 auto; padding: 2.5rem 0 1.5rem 0; }`,
    `.privacy-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 2.2rem; }`,
    `.privacy-section { margin-bottom: 2.5rem; }`,
    `.section-header { font-size: 1.35rem; font-weight: 700; color: #232b4d; margin-bottom: 0.3rem; }`,
    `.section-desc { color: #232b4d; font-size: 1.08rem; margin-bottom: 1.7rem; }`,
    `.privacy-card { background: #fff; border-radius: 8px; border: 1px solid #e5eaf2; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.5rem 2rem; display: flex; flex-direction: column; margin-bottom: 1.5rem; }`,
    `.card-content { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }`,
    `.card-title { font-size: 1.13rem; font-weight: 700; color: #232b4d; margin-bottom: 0.2rem; }`,
    `.card-desc { color: #7b8ca6; font-size: 1.01rem; }`,
    `.switch { position: relative; display: inline-block; width: 44px; height: 24px; }`,
    `.switch input { opacity: 0; width: 0; height: 0; }`,
    `.slider { position: absolute; cursor: not-allowed; top: 0; left: 0; right: 0; bottom: 0; background-color: #7b8ca6; border-radius: 24px; transition: .4s; }`,
    `.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: #fff; border-radius: 50%; transition: .4s; }`,
    `.switch input:checked + .slider { background-color: #1a6cff; }`,
    `.switch input:checked + .slider:before { transform: translateX(20px); }`,
    `@media (max-width: 700px) { .privacy-layout { padding: 1.2rem 0; } .privacy-card { padding: 1rem 1rem; } .card-content { flex-direction: column; align-items: flex-start; gap: 1rem; } }`
  ]
})
export class PrivacySettingsPageComponent {} 