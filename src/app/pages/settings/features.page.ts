import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  preferencesLink: string;
  extraLink?: { text: string; url: string };
  showToggle?: boolean;
  locked?: boolean;
}

@Component({
  selector: 'app-features-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="features-settings-layout">
      <div class="features-title">Features</div>
      <div *ngFor="let feature of features" class="feature-card">
        <div class="feature-header">
          <span class="feature-icon" [innerHTML]="feature.icon"></span>
          <span class="feature-title-wrapper" (mouseenter)="hovered = feature.title" (mouseleave)="hovered = null">
            <span class="feature-title">{{ feature.title }}</span>
            @if (feature.title === 'Work Orders' && hovered === 'Work Orders') {
              <span class="edit-labels" (click)="openEditLabelsDialog()">
                <span class="pencil-icon">&#9998;</span> Edit Labels
              </span>
            }
          </span>
        </div>
        <div class="feature-desc">{{ feature.description }}</div>
        <a class="feature-link" href="#">Set Preferences <span>&#8594;</span></a>
        @if (feature.extraLink) {
          <a class="feature-link" [href]="feature.extraLink.url">{{ feature.extraLink.text }} <span>&#8594;</span></a>
        }
        @if (feature.showToggle) {
          <div class="feature-toggle-row">
            <span class="feature-toggle-label">Feature Module: On</span>
            <span class="feature-toggle-switch"><span class="toggle-circle"></span></span>
          </div>
        }
        @if (feature.locked) {
          <span class="feature-locked"><span class="lock-icon">&#128274;</span></span>
        }
      </div>

      <!-- Edit Labels Modal -->
      @if (showEditLabelsDialog) {
        <div class="modal-overlay" (click)="closeEditLabelsDialog()"></div>
      }
      @if (showEditLabelsDialog) {
        <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span>Customize Feature Labels</span>
          <span class="modal-close" (click)="closeEditLabelsDialog()">&times;</span>
        </div>
        <div class="modal-desc">
          Customizing labels will have an impact across the entire App, so we suggest labeling features in a way that sounds familiar to your team.
        </div>
        <div class="modal-features-list">
          <div *ngFor="let label of editableLabels; let i = index" class="modal-feature-group">
            <div class="modal-feature-header" (click)="toggleAccordion(i)">
              <span>{{ label.title }}</span>
              <span class="accordion-arrow">{{ expandedIndex === i ? '▲' : '▼' }}</span>
            </div>
            @if (expandedIndex === i) {
              <div class="modal-feature-body">
              <div class="modal-label-row">
                <label>"{{ label.titleSingular }}"</label>
                <input type="text" [(ngModel)]="label.singular" placeholder="Enter Custom Label" />
                <label>"{{ label.titlePlural }}"</label>
                <input type="text" [(ngModel)]="label.plural" placeholder="Enter Custom Label" />
              </div>
              </div>
            }
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-cancel" (click)="closeEditLabelsDialog()">Cancel</button>
          <button class="modal-save" (click)="saveLabels()">Save Changes</button>
        </div>
        </div>
      }
    </div>
  `,
  styles: [
    `.features-settings-layout { max-width: 900px; margin: 0 auto; padding: 2rem 0; }`,
    `.features-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 2rem; }`,
    `.feature-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.5rem 2rem 1.5rem 2rem; margin-bottom: 1.5rem; position: relative; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid #e5eaf2; }`,
    `.feature-header { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.2rem; }`,
    `.feature-icon { font-size: 2rem; background: #eaf3ff; color: #1a6cff; border-radius: 50%; padding: 0.4rem; display: flex; align-items: center; justify-content: center; min-width: 2.5rem; min-height: 2.5rem; }`,
    `.feature-title-wrapper { display: flex; align-items: center; gap: 0.5rem; position: relative; }`,
    `.feature-title { font-size: 1.25rem; font-weight: 700; color: #232b4d; }`,
    `.edit-labels { color: #7b8ca6; font-size: 1rem; font-weight: 500; margin-left: 0.7rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer; }`,
    `.pencil-icon { font-size: 1.1rem; color: #1a6cff; }`,
    `.feature-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.5rem; }`,
    `.feature-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; margin-top: 0.2rem; display: inline-block; }`,
    `.feature-link:hover { text-decoration: underline; }`,
    `.feature-toggle-row { position: absolute; right: 2rem; top: 1.5rem; display: flex; align-items: center; gap: 0.7rem; }`,
    `.feature-toggle-label { color: #7b8ca6; font-size: 1.05rem; font-weight: 500; }`,
    `.feature-toggle-switch { width: 38px; height: 22px; background: #eaf3ff; border-radius: 12px; display: inline-block; position: relative; }`,
    `.toggle-circle { width: 18px; height: 18px; background: #1abc9c; border-radius: 50%; position: absolute; top: 2px; right: 2px; transition: right 0.2s; }`,
    `.feature-locked { margin-left: 0.5rem; color: #1a6cff; font-size: 1.2rem; }`,
    `.lock-icon { margin-left: 0.2rem; }`,
    `.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(30,37,77,0.18); z-index: 2000; }`,
    `.modal-dialog { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); background: #fff; border-radius: 10px; box-shadow: 0 2px 16px rgba(6,11,40,0.18); z-index: 2001; min-width: 600px; max-width: 98vw; padding: 2rem 2.5rem 1.5rem 2.5rem; }`,
    `.modal-header { font-size: 1.3rem; font-weight: 600; color: #232b4d; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }`,
    `.modal-close { font-size: 2rem; color: #7b8ca6; cursor: pointer; margin-left: 1rem; }`,
    `.modal-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 1.5rem; }`,
    `.modal-features-list { max-height: 60vh; overflow-y: auto; }`,
    `.modal-feature-group { background: #f7faff; border-radius: 8px; margin-bottom: 1.2rem; }`,
    `.modal-feature-header { font-size: 1.1rem; font-weight: 600; color: #232b4d; padding: 1rem 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }`,
    `.accordion-arrow { font-size: 1.1rem; color: #7b8ca6; }`,
    `.modal-feature-body { padding: 1rem 1.5rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }`,
    `.modal-label-row { display: flex; align-items: center; gap: 1.2rem; }`,
    `.modal-label-row label { color: #7b8ca6; font-size: 1.05rem; min-width: 90px; }`,
    `.modal-label-row input { border: 1.5px solid #1a6cff; border-radius: 6px; padding: 0.5rem 1rem; font-size: 1.05rem; min-width: 180px; outline: none; }`,
    `.modal-actions { display: flex; justify-content: flex-end; gap: 1.5rem; margin-top: 1.5rem; }`,
    `.modal-cancel { background: none; border: none; color: #1a6cff; font-size: 1.05rem; font-weight: 500; cursor: pointer; }`,
    `.modal-save { background: #1a6cff; color: #fff; border: none; border-radius: 6px; padding: 0.6rem 1.5rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }`,
    `.modal-save:disabled { background: #eaf3ff; color: #7b8ca6; cursor: not-allowed; }`
  ]
})
export class FeaturesSettingsPageComponent {
  hovered: string | null = null;
  showEditLabelsDialog = false;
  expandedIndex: number | null = 0;

  features: FeatureCard[] = [
    {
      icon: '<span style="color:#1a6cff;">&#128188;</span>',
      title: 'Work Orders',
      description: 'Customize Work Order preferences like Time & Cost Tracking, Procedure Corrective Actions, and more.',
      preferencesLink: '#',
      showToggle: false
    },
    {
      icon: '<span style="color:#1a6cff;">&#128172;</span>',
      title: 'Requests',
      description: 'Customize Request preferences like routing and required fields',
      preferencesLink: '#',
      showToggle: false
    },
    {
      icon: '<span style="color:#1a6cff;">&#128736;</span>',
      title: 'Assets',
      description: 'Customize Assets-related settings like Barcode Generation or Assets creation form.',
      preferencesLink: '#',
      showToggle: false
    },
    {
      icon: '<span style="color:#1a6cff;">&#128205;</span>',
      title: 'Locations',
      description: 'Create, manage and edit Locations within your Organization.',
      preferencesLink: '#',
      showToggle: false
    },
    {
      icon: '<span style="color:#1a6cff;">&#128202;</span>',
      title: 'Reporting',
      description: 'Customize aspects of the Reporting feature.',
      preferencesLink: '#',
      showToggle: false
    },
    {
      icon: '<span style="color:#1a6cff;">&#128230;</span>',
      title: 'Request Portals',
      description: 'Create, manage, and edit all Request Portals in your organization.',
      preferencesLink: '#',
      extraLink: { text: 'Go to Request Portals', url: '#' },
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#128179;</span>',
      title: 'Purchase Orders',
      description: 'Customize your Purchase Orders by adding titles and/or prefixes and setting default CC email addresses.',
      preferencesLink: '#',
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#9881;</span>',
      title: 'Parts Inventory',
      description: 'Customize Parts Inventory form, edit Escalation Teams, and adjust Barcode Generation settings.',
      preferencesLink: '#',
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#128207;</span>',
      title: 'Meters',
      description: 'Set (or Create) Meters and track their Readings.',
      preferencesLink: '#',
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#128188;</span>',
      title: 'Vendors',
      description: 'Create, manage, and edit Vendors to contact from your Organization.',
      preferencesLink: '#',
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#128257;</span>',
      title: 'Workstation Mode',
      description: 'Allow your teammates to sign in to multiple sessions on a single device.',
      preferencesLink: '#',
      showToggle: true,
      locked: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#128196;</span>',
      title: 'Work Order Template',
      description: 'Create Work Order Templates to standardize your Work Orders.',
      preferencesLink: '#',
      showToggle: true
    },
    {
      icon: '<span style="color:#1a6cff;">&#9889;</span>',
      title: 'Automations',
      description: 'Use conditions to trigger tasks and optimize your maintenance operations.',
      preferencesLink: '#',
      showToggle: true
    }
  ];

  editableLabels = [
    { title: 'Work Order', titleSingular: 'Work Order', titlePlural: 'Work Orders', singular: '', plural: '' },
    { title: 'Asset', titleSingular: 'Asset', titlePlural: 'Assets', singular: '', plural: '' },
    { title: 'Location', titleSingular: 'Location', titlePlural: 'Locations', singular: '', plural: '' },
    { title: 'Request', titleSingular: 'Request', titlePlural: 'Requests', singular: '', plural: '' },
    { title: 'Purchase Order', titleSingular: 'Purchase Order', titlePlural: 'Purchase Orders', singular: '', plural: '' },
    { title: 'Part', titleSingular: 'Part', titlePlural: 'Parts', singular: '', plural: '' },
    { title: 'Meter', titleSingular: 'Meter', titlePlural: 'Meters', singular: '', plural: '' },
    { title: 'Team', titleSingular: 'Team', titlePlural: 'Teams', singular: '', plural: '' }
  ];

  openEditLabelsDialog() {
    this.showEditLabelsDialog = true;
    this.expandedIndex = 0;
  }

  closeEditLabelsDialog() {
    this.showEditLabelsDialog = false;
  }

  toggleAccordion(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  saveLabels() {
    // Save logic here (mock)
    this.closeEditLabelsDialog();
  }
}
