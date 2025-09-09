import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-workorder-details',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="workorder-details-card">
      <div class="details-header">
        <span class="details-title">Project 000866 <a class="details-link" href="#">🔗</a></span>
        <div class="details-actions">
          <button pButton label="Comments" class="p-button-outlined p-button-sm"></button>
          <button pButton label="Edit" class="p-button-outlined p-button-sm"></button>
        </div>
      </div>
      <div class="details-status-row">
        <button pButton label="Open" class="p-button-sm status-btn active"></button>
        <button pButton label="On Hold" class="p-button-sm status-btn"></button>
        <button pButton label="In Progress" class="p-button-sm status-btn"></button>
        <button pButton label="Done" class="p-button-sm status-btn"></button>
        <a class="details-share" href="#">Share Externally</a>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Due Date</div>
          <div class="details-value overdue">05/09/2025 <span class="overdue-icon">&#9888;</span> Overdue</div>
        </div>
        <div class="details-col">
          <div class="details-label">Work Order ID</div>
          <div class="details-value">#1</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Assigned To</div>
          <div class="details-value"><span class="avatar">🧑‍💼</span> Jun Ren</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Description</div>
          <div class="details-value">dd</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Asset</div>
          <div class="details-value">Test <span class="asset-status online">● Online</span></div>
        </div>
        <div class="details-col">
          <div class="details-label">Location</div>
          <div class="details-value"><span class="location-icon">📍</span> General</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Estimated Time</div>
          <div class="details-value">1h</div>
        </div>
        <div class="details-col">
          <div class="details-label">Work Type</div>
          <div class="details-value">Preventive</div>
        </div>
      </div>
      <div class="details-grid">
        <div class="details-col">
          <div class="details-label">Categories</div>
          <div class="details-value"><span class="category-tag">Electrical</span></div>
        </div>
      </div>
      <div class="details-section schedule-conditions">
        <div class="details-label"><b>Schedule conditions</b></div>
        <div class="details-value">This Work Order will repeat based on time.</div>
        <div class="details-repeat"><span class="repeat-icon">📅</span> Repeats every day after completion of this Work Order.</div>
      </div>
      <hr class="details-divider" />
      <div class="details-meta">
        <div class="details-meta-row">
          Created by <span class="avatar">🧑‍💼</span> Jun Ren on 05/17/2025, 10:08 AM
        </div>
        <div class="details-meta-row">
          Last updated on 05/17/2025, 10:08 AM
        </div>
      </div>
      <div class="details-comments">
        <div class="details-label">Comments</div>
        <div class="comment-box">
          <input type="text" placeholder="Write a comment..." />
          <button pButton icon="pi pi-send" class="p-button-sm"></button>
        </div>
        <div class="comment-list">
          <div class="comment-item"><span class="avatar">🧑‍💼</span> Jun Ren <span class="comment-time">10:08 AM</span><br/><span class="comment-text">Created work order</span></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.workorder-details-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(6,11,40,0.08); padding: 2rem; color: #232b4d; max-width: 700px; margin: 0 auto; }`,
    `.details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }`,
    `.details-title { font-size: 1.3rem; font-weight: 600; color: #232b4d; }`,
    `.details-link { color: #1a6cff; margin-left: 0.5rem; font-size: 1.1rem; text-decoration: none; }`,
    `.details-actions button { margin-left: 0.5rem; }`,
    `.details-status-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }`,
    `.status-btn { background: #f7faff; color: #1a6cff; border: 1px solid #e5eaf2; }`,
    `.status-btn.active, .status-btn:hover { background: #1a6cff; color: #fff; }`,
    `.details-share { margin-left: auto; color: #1a6cff; text-decoration: none; font-size: 0.98rem; }`,
    `.details-grid { display: flex; gap: 2rem; margin-bottom: 1.2rem; }`,
    `.details-col { flex: 1; }`,
    `.details-label { color: #7b8ca6; font-size: 0.95rem; margin-bottom: 0.2rem; }`,
    `.details-value { font-size: 1.05rem; font-weight: 500; color: #232b4d; }`,
    `.overdue { color: #e53935; font-weight: 600; }`,
    `.overdue-icon { margin-right: 0.2rem; font-size: 1.1rem; }`,
    `.avatar { background: #dbeafe; color: #1a6cff; border-radius: 50%; padding: 0.2rem 0.5rem; margin-right: 0.5rem; font-size: 1.1rem; }`,
    `.asset-status.online { color: #43c463; font-weight: 600; margin-left: 0.5rem; font-size: 0.95rem; }`,
    `.location-icon { color: #67b8c5; margin-right: 0.2rem; }`,
    `.category-tag { background: #fffbe6; color: #e6b800; border-radius: 4px; padding: 0.2rem 0.7rem; font-size: 0.95rem; font-weight: 500; }`,
    `.details-comments { margin-top: 2rem; }`,
    `.comment-box { display: flex; gap: 0.5rem; margin-bottom: 1rem; }`,
    `.comment-box input { flex: 1; padding: 0.5rem 1rem; border: 1px solid #e5eaf2; border-radius: 4px; font-size: 1rem; }`,
    `.comment-list { }`,
    `.comment-item { background: #f7faff; border-radius: 4px; padding: 0.7rem 1rem; margin-bottom: 0.5rem; color: #232b4d; }`,
    `.comment-time { color: #7b8ca6; font-size: 0.9rem; margin-left: 0.5rem; }`,
    `.comment-text { display: block; margin-top: 0.2rem; }`,
    `.details-section.schedule-conditions { margin: 2rem 0 1.5rem 0; }`,
    `.details-section.schedule-conditions .details-label { font-weight: 600; color: #232b4d; margin-bottom: 0.2rem; }`,
    `.details-section.schedule-conditions .details-value { color: #232b4d; font-size: 1rem; margin-bottom: 0.3rem; }`,
    `.details-repeat { color: #232b4d; font-size: 0.98rem; display: flex; align-items: center; margin-bottom: 0.5rem; }`,
    `.repeat-icon { color: #1a6cff; margin-right: 0.4rem; font-size: 1.1rem; }`,
    `.details-divider { border: none; border-top: 1px solid #e5eaf2; margin: 1.5rem 0; }`,
    `.details-meta { color: #232b4d; font-size: 0.98rem; margin-bottom: 1.5rem; }`,
    `.details-meta-row { margin-bottom: 0.2rem; }`
  ]
})
export class WorkorderDetailsComponent {} 