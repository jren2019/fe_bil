import { Component } from '@angular/core';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [NavMenuComponent, ButtonModule, InputTextModule, CommonModule],
  template: `
    <div class="messages-layout">
      <app-nav-menu></app-nav-menu>
      <div class="messages-main">
        <div class="messages-header">
          <div class="messages-title">Messages</div>
          <input pInputText type="text" placeholder="Search or start a new chat" class="messages-search" />
          <button pButton label="+ New Message" class="p-button-primary new-message-btn" (click)="startNewMessage()"></button>
        </div>
        <div class="messages-content">
          <div class="messages-list-panel">
            @if (isNewMessageRoute()) {
              <div class="conversation-item new-message-item">
                <div class="conversation-avatar">🆕</div>
                <div class="conversation-main">
                  <input pInputText type="text" placeholder="To: Start typing..." class="new-message-to-input" />
                </div>
              </div>
            }
            <div class="conversation-item selected">
              <div class="conversation-avatar">👥</div>
              <div class="conversation-main">
                <div class="conversation-title">All Team</div>
                <div class="conversation-meta">Organization-wide conversation</div>
              </div>
              <div class="conversation-date">09/05/2023</div>
            </div>
            <div class="direct-messages-label">Direct Messages</div>
            <div class="messages-empty-card">
              <div class="empty-icon"><svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="48" rx="60" ry="48" fill="#F7FAFF"/><ellipse cx="60" cy="48" rx="36" ry="28.8" fill="#1A6CFF" fill-opacity="0.15"/><ellipse cx="60" cy="48" rx="24" ry="19.2" fill="#1A6CFF" fill-opacity="0.25"/><ellipse cx="60" cy="48" rx="12" ry="9.6" fill="#1A6CFF"/></svg></div>
              <div class="empty-title">Start adding conversations to<br>bifaka on MaintainX</div>
              <div class="empty-desc">Click the <b>+ New Message</b> button in the top right to get started</div>
            </div>
          </div>
          <div class="messages-details-panel">
            @if (isNewMessageRoute()) {
              <div class="details-header">
                <div class="details-avatar">🆕</div>
                <div class="details-main">
                  <input pInputText type="text" placeholder="To: Start typing..." class="new-message-to-input" />
                </div>
              </div>
              <div class="details-chat-area"></div>
              <div class="details-message-input">
                <span class="attach-icon">📎</span>
                <input pInputText type="text" placeholder="Write a message..." class="message-input" />
                <button pButton label="Send" class="p-button-outlined send-btn"></button>
              </div>
            } @else {
              <div class="details-header">
                <div class="details-avatar">👥</div>
                <div class="details-main">
                  <div class="details-title">All Team</div>
                  <div class="details-meta">View Conversation Information</div>
                </div>
                <div class="details-actions">
                  <span class="details-notification">🔔</span>
                  <span class="details-menu">⋮</span>
                </div>
              </div>
              <div class="details-chat-area"></div>
              <div class="details-message-input">
                <span class="attach-icon">📎</span>
                <input pInputText type="text" placeholder="Write a message..." class="message-input" />
                <button pButton label="Send" class="p-button-outlined send-btn"></button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.messages-layout { display: flex; min-height: 100vh; background: #f7faff; }`,
    `.messages-main { flex: 1; padding: 2rem 2.5rem; background: #f7faff; display: flex; flex-direction: column; }`,
    `.messages-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.2rem; }`,
    `.messages-title { font-size: 2rem; font-weight: 700; color: #232b4d; }`,
    `.messages-search { width: 320px; margin-left: auto; }`,
    `.new-message-btn { font-weight: 600; font-size: 1rem; margin-left: 1rem; }`,
    `.messages-content { display: flex; gap: 2rem; flex: 1; }`,
    `.messages-list-panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); min-width: 340px; max-width: 400px; padding: 0; display: flex; flex-direction: column; }`,
    `.conversation-item { display: flex; align-items: center; padding: 1rem 1.5rem; border-left: 4px solid transparent; background: #f7faff; border-radius: 0 8px 8px 0; margin: 1rem 0 0.5rem 0; box-shadow: 0 1px 2px rgba(6,11,40,0.03); cursor: pointer; }`,
    `.conversation-item.selected { border-left: 4px solid #1a6cff; background: #eaf3ff; }`,
    `.conversation-avatar { font-size: 2.2rem; color: #dbeafe; margin-right: 1rem; }`,
    `.conversation-main { flex: 1; }`,
    `.conversation-title { font-weight: 600; color: #232b4d; font-size: 1.1rem; }`,
    `.conversation-meta { color: #7b8ca6; font-size: 0.95rem; }`,
    `.conversation-date { color: #7b8ca6; font-size: 0.95rem; }`,
    `.direct-messages-label { color: #232b4d; font-weight: 500; font-size: 1rem; margin: 1.5rem 0 0.5rem 1.5rem; }`,
    `.messages-empty-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 3rem 2rem; margin: 0 1.5rem 1.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; }`,
    `.empty-icon { margin-bottom: 2rem; }`,
    `.empty-title { font-size: 1.5rem; font-weight: 600; color: #232b4d; text-align: center; margin-bottom: 1rem; }`,
    `.empty-desc { color: #7b8ca6; font-size: 1.1rem; text-align: center; }`,
    `.messages-details-panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); flex: 1; padding: 0; display: flex; flex-direction: column; }`,
    `.details-header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 2rem 1rem 2rem; border-bottom: 1px solid #e5eaf2; }`,
    `.details-avatar { font-size: 2.2rem; color: #dbeafe; }`,
    `.details-main { flex: 1; }`,
    `.details-title { font-weight: 600; color: #232b4d; font-size: 1.1rem; }`,
    `.details-meta { color: #7b8ca6; font-size: 0.95rem; }`,
    `.details-actions { display: flex; align-items: center; gap: 1.2rem; }`,
    `.details-notification { font-size: 1.3rem; color: #1a6cff; cursor: pointer; }`,
    `.details-menu { font-size: 1.5rem; color: #7b8ca6; cursor: pointer; }`,
    `.details-chat-area { flex: 1; }`,
    `.details-message-input { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; border-top: 1px solid #e5eaf2; }`,
    `.attach-icon { font-size: 1.3rem; color: #7b8ca6; cursor: pointer; }`,
    `.message-input { flex: 1; }`,
    `.send-btn { font-weight: 500; }`,
    `.new-message-item { background: #eaf3ff; border-left: 4px solid #1a6cff; }`,
    `.new-message-to-input { width: 100%; font-size: 1rem; }`
  ]
})
export class MessagesPageComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  startNewMessage() {
    this.router.navigate(['/messages/new']);
  }

  isNewMessageRoute(): boolean {
    return this.router.url.endsWith('/messages/new');
  }
}
