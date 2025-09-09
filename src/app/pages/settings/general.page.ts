import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-settings-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule],
  template: `
    <div class="general-settings-layout">
      <div class="general-title">General</div>
      <div class="company-card">
        <img src="/assets/logo.png" alt="Logo" class="company-logo" />
        <div class="company-info">
          <div class="company-name">bifaka</div>
          <div class="company-address">10 Dalcross Drive, Flat Bush, Auckland, Auckland, 2016, NZ<br>Other | 2 Members</div>
          <span class="premium-badge">Premium Plan</span>
        </div>
        <a class="edit-profile-link" href="#">Edit Profile</a>
      </div>
      <div class="preferences-card">
        <div class="preferences-title">Preferences</div>
        <div class="preferences-row">
          <span>Currency</span>
          <input pInputText type="text" value="USD (US Dollar)" readonly />
        </div>
        <div class="preferences-row">
          <span>Date Format</span>
          <input pInputText type="text" value="MM/DD/YYYY – 11:59 PM" readonly />
        </div>
        <div class="preferences-row">
          <span>Time Zone</span>
          <input pInputText type="text" value="Pacific/Auckland : +12:00" readonly />
        </div>
      </div>
      <div class="export-card">
        <div class="export-title">Export Data</div>
        <div class="export-grid">
          <button pButton label="Work Orders" class="export-btn"></button>
          <button pButton label="Assets" class="export-btn"></button>
          <button pButton label="Asset Status" class="export-btn"></button>
          <button pButton label="Locations" class="export-btn"></button>
          <button pButton label="Parts List" class="export-btn"></button>
          <button pButton label="Parts Transactions" class="export-btn"></button>
          <button pButton label="Purchase Orders" class="export-btn"></button>
          <button pButton label="Meters" class="export-btn"></button>
          <button pButton label="Readings" class="export-btn"></button>
          <button pButton label="Vendors" class="export-btn"></button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.general-settings-layout { max-width: 900px; margin: 0 auto; padding: 2rem 0; }`,
    `.general-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 2rem; }`,
    `.company-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 2rem; display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; position: relative; }`,
    `.company-logo { width: 80px; height: 80px; object-fit: contain; }`,
    `.company-info { flex: 1; }`,
    `.company-name { font-size: 1.5rem; font-weight: 600; color: #232b4d; margin-bottom: 0.5rem; }`,
    `.company-address { color: #7b8ca6; font-size: 1rem; margin-bottom: 0.5rem; }`,
    `.premium-badge { background: #eaf3ff; color: #1a6cff; border-radius: 6px; padding: 0.2rem 0.8rem; font-weight: 600; font-size: 1rem; }`,
    `.edit-profile-link { color: #1a6cff; font-weight: 500; text-decoration: none; position: absolute; right: 2rem; top: 2rem; }`,
    `.preferences-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 2rem; margin-bottom: 2rem; }`,
    `.preferences-title { font-size: 1.3rem; font-weight: 600; color: #232b4d; margin-bottom: 1.2rem; }`,
    `.preferences-row { display: flex; align-items: center; gap: 2rem; margin-bottom: 1.2rem; font-size: 1.05rem; }`,
    `.preferences-row span { min-width: 120px; color: #7b8ca6; }`,
    `.export-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 2rem; }`,
    `.export-title { font-size: 1.3rem; font-weight: 600; color: #232b4d; margin-bottom: 1.2rem; }`,
    `.export-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.2rem; }`,
    `.export-btn { width: 100%; font-size: 1.05rem; font-weight: 500; background: #f7faff; color: #1a6cff; border: 1.5px solid #e5eaf2; border-radius: 8px; }`,
    `.export-btn:hover { background: #eaf3ff; color: #232b4d; }`
  ]
})
export class GeneralSettingsPageComponent {} 