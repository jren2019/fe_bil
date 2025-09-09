import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="integrations-layout">
      <div class="integrations-title">Integrations</div>
      <div class="integrations-tabs-row">
        <button class="tab-btn" [class.active]="activeTab === 'connectors'" (click)="activeTab = 'connectors'">Connectors</button>
        <button class="tab-btn" [class.active]="activeTab === 'apiKeys'" (click)="activeTab = 'apiKeys'">API Keys</button>
        <button class="tab-btn" [class.active]="activeTab === 'webhooks'" (click)="activeTab = 'webhooks'">Webhooks</button>
      </div>
      <div class="tab-content">
        <!-- Connectors Tab -->
        @if (activeTab === 'connectors') {
          <div class="section-title">Available Connectors</div>
          <div class="connectors-cards-row">
            <div class="connector-card">
              <div class="enterprise-badge"><span class="lock">&#128274;</span> Enterprise Plan</div>
              <div class="mqtt-logo">MQTT</div>
              <div class="connector-title">MQTT</div>
              <div class="connector-desc">Power your maintenance activities with real-time machine data and automated workflows.</div>
              <button class="learn-more-btn">Learn More <span class="arrow">&rarr;</span></button>
            </div>
            <div class="connector-card wide">
              <div class="connector-title">Connect with all your favorite software</div>
              <div class="connector-desc">MaintainX provides out-of-the-box and customizable integrations so you can work - your way.</div>
              <div class="integration-graphic"></div>
              <button class="browse-btn">Browse Integrations <span class="arrow">&#8594;</span></button>
            </div>
            <div class="connector-card">
              <div class="not-found-icon">&#128640;</div>
              <div class="connector-title">Didn't find what you're looking for?</div>
              <div class="connector-desc">Tell us what integrations you'd like to see here</div>
              <button class="request-btn">Request Integration <span class="arrow">&#8594;</span></button>
            </div>
          </div>
        }
        <!-- API Keys Tab -->
        @if (activeTab === 'apiKeys') {
          <div class="api-keys-section">
            <div class="section-title">API Keys</div>
            <div class="api-keys-desc">These keys will allow you to authenticate API requests. <a href="#" class="api-docs-link">Explore API Docs.</a></div>
            <button class="new-key-btn">+ New Key</button>
            <table class="api-keys-table">
              <thead>
                <tr><th>Label</th><th>User</th><th>Last Used</th><th>Created</th></tr>
              </thead>
              <tbody>
                <tr><td colspan="4" class="empty-row">No API keys have been generated.</td></tr>
              </tbody>
            </table>
            <div class="zapier-card">
              <span class="zapier-logo">zapier</span>
              <div class="zapier-desc">Instantly connect MaintainX with 3,000+ apps to automate your work and find productivity super powers.</div>
              <a class="zapier-link" href="#">Go to Zapier <span class="arrow">&gt;</span></a>
            </div>
          </div>
        }
        <!-- Webhooks Tab -->
        @if (activeTab === 'webhooks') {
          <div class="webhooks-section">
            <div class="section-title">Webhook Endpoints</div>
            <div class="webhooks-desc">Those are the endpoints currently created for this organization <a href="#" class="api-docs-link">Explore API Docs.</a></div>
            <button class="new-webhook-btn">+ New Webhook</button>
            <table class="webhooks-table">
              <thead>
                <tr><th>ID</th><th>Url</th><th>User</th><th>Type</th><th>Secret</th></tr>
              </thead>
              <tbody>
                <tr><td colspan="5" class="empty-row">No Webhook endpoints have been generated.</td></tr>
              </tbody>
            </table>
            <div class="zapier-card">
              <span class="zapier-logo">zapier</span>
              <div class="zapier-desc">Instantly connect MaintainX with 3,000+ apps to automate your work and find productivity super powers.</div>
              <a class="zapier-link" href="#">Go to Zapier <span class="arrow">&gt;</span></a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `.integrations-layout { max-width: 1200px; margin: 0 auto; padding: 2.5rem 0 1.5rem 0; }`,
    `.integrations-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 1.5rem; }`,
    `.integrations-tabs-row { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.5rem; }`,
    `.tab-btn { background: #fff; border: 1.5px solid #c7d6ee; border-radius: 6px; padding: 0.5rem 1.5rem; font-size: 1.05rem; font-weight: 600; color: #232b4d; cursor: pointer; transition: background 0.2s, color 0.2s, border 0.2s; }`,
    `.tab-btn.active { background: #1a6cff; color: #fff; border: 1.5px solid #1a6cff; }`,
    `.tab-content { margin-top: 1.5rem; }`,
    `.section-title { font-size: 1.18rem; font-weight: 700; color: #232b4d; margin-bottom: 1.1rem; }`,
    `.connectors-cards-row { display: flex; gap: 1.2rem; }`,
    `.connector-card { background: #fff; border-radius: 8px; border: 1px solid #e5eaf2; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.5rem 1.5rem 1.5rem 1.5rem; display: flex; flex-direction: column; align-items: flex-start; min-width: 260px; max-width: 320px; flex: 1; position: relative; }`,
    `.connector-card.wide { flex: 2; align-items: center; text-align: center; justify-content: center; max-width: 420px; }`,
    `.enterprise-badge { background: #f7faff; color: #1a6cff; font-size: 0.98rem; font-weight: 600; border-radius: 5px; padding: 0.2rem 0.7rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.3rem; }`,
    `.lock { font-size: 1.1rem; margin-right: 0.3rem; }`,
    `.mqtt-logo { font-size: 2.2rem; font-weight: 700; color: #7b2ff2; margin-bottom: 0.7rem; }`,
    `.connector-title { font-size: 1.18rem; font-weight: 700; color: #232b4d; margin-bottom: 0.3rem; }`,
    `.connector-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 1.1rem; }`,
    `.learn-more-btn, .browse-btn, .request-btn { background: #1a6cff; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.3rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; margin-top: auto; }`,
    `.browse-btn { background: #fff; color: #1a6cff; border: 1.5px solid #1a6cff; margin-top: 1.2rem; }`,
    `.request-btn { background: #fff; color: #1a6cff; border: 1.5px solid #1a6cff; }`,
    `.arrow { font-size: 1.1rem; margin-left: 0.2rem; }`,
    `.not-found-icon { font-size: 2.2rem; color: #7b8ca6; margin-bottom: 0.7rem; }`,
    `.api-keys-section, .webhooks-section { position: relative; }`,
    `.api-keys-desc, .webhooks-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.7rem; }`,
    `.api-docs-link { color: #1a6cff; text-decoration: underline; }`,
    `.new-key-btn, .new-webhook-btn { position: absolute; right: 0; top: 0; background: #1a6cff; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.3rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }`,
    `.api-keys-table, .webhooks-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); border: 1px solid #e5eaf2; margin-top: 2.5rem; }`,
    `.api-keys-table th, .api-keys-table td, .webhooks-table th, .webhooks-table td { padding: 1rem 1.2rem; text-align: left; font-size: 1.05rem; }`,
    `.api-keys-table th, .webhooks-table th { color: #7b8ca6; font-weight: 700; background: #f7faff; }`,
    `.api-keys-table td, .webhooks-table td { color: #232b4d; font-weight: 500; border-top: 1px solid #e5eaf2; }`,
    `.empty-row { color: #7b8ca6; font-style: italic; text-align: center; }`,
    `.zapier-card { background: #fff; border-radius: 8px; border: 1px solid #e5eaf2; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.2rem 1.5rem; display: flex; align-items: center; gap: 1.2rem; margin-top: 2.2rem; }`,
    `.zapier-logo { color: #ff4f00; font-size: 2rem; font-weight: 700; margin-right: 1.2rem; }`,
    `.zapier-desc { color: #232b4d; font-size: 1.05rem; flex: 1; }`,
    `.zapier-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; margin-left: auto; }`,
    `.zapier-link:hover { text-decoration: underline; }`,
    `@media (max-width: 1100px) { .connectors-cards-row { flex-direction: column; gap: 1.2rem; } .connector-card, .connector-card.wide { max-width: 100%; min-width: 0; } }`,
    `@media (max-width: 900px) { .integrations-layout { padding: 1.2rem 0; } .integrations-title { font-size: 1.5rem; } .section-title { font-size: 1.05rem; } }`
  ],
})
export class IntegrationsSettingsPageComponent {
  activeTab: 'connectors' | 'apiKeys' | 'webhooks' = 'connectors';
}
