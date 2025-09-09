import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subscription-layout">
      <div class="subscription-title">Subscription</div>
      <div class="subscription-cards-grid">
        <!-- Current Plan -->
        <div class="subscription-card plan-card">
          <div class="card-section">
            <div class="card-label">CURRENT PLAN</div>
            <div class="plan-row">
              <div class="plan-name">Premium Plan</div>
              <button class="upgrade-btn">Upgrade</button>
            </div>
            <div class="plan-next-invoice">Your next invoice is due on <b>June 17th</b>.</div>
          </div>
          <div class="plan-price-row">
            <span class="plan-price">$59</span>
            <span class="plan-price-desc">$59 × 1 license × 1 month</span>
          </div>
        </div>
        <!-- Billing Period -->
        <div class="subscription-card billing-card">
          <div class="card-label">BILLING PERIOD</div>
          <div class="billing-type">Monthly Billing</div>
          <div class="billing-desc">Your plan can be billed either annually or monthly.</div>
          <button class="switch-btn">Switch to Annual</button>
        </div>
        <!-- Licenses -->
        <div class="subscription-card licenses-card">
          <div class="card-label">LICENSES</div>
          <div class="licenses-row">
            <span class="licenses-count">1 License</span>
            <span class="licenses-bar-bg"><span class="licenses-bar-fill" style="width:100%"></span></span>
          </div>
          <div class="licenses-desc">1 of 1 seat used</div>
          <a class="manage-link" href="#">Manage</a>
        </div>
        <!-- Payment Method -->
        <div class="subscription-card payment-card">
          <div class="card-label">PAYMENT METHOD</div>
          <div class="payment-row">
            <span class="payment-label">Billing Email</span>
            <a class="edit-link" href="#">Edit</a>
          </div>
          <div class="payment-method">
            <span class="visa-badge">VISA</span>
            <span class="card-digits">**** 1821</span>
          </div>
          <div class="billing-email">jun.ren.nz&#64;gmail.com</div>
          <div class="next-billing">Next billing on June 17th.</div>
        </div>
        <!-- Invoices -->
        <div class="subscription-card invoices-card">
          <div class="card-label">INVOICES</div>
          <div class="invoices-row">
            <span class="invoice-date">05/17/2025</span>
            <span class="invoice-amount">$59.00</span>
            <span class="invoice-status paid">PAID</span>
            <a class="invoice-download" href="#" title="Download Invoice">&#128229;</a>
          </div>
          <div class="invoices-footer">
            <span class="invoices-currency">All prices are in USD</span>
            <a class="view-all-link" href="#">View All</a>
          </div>
        </div>
      </div>
      <div class="subscription-footer">
        <div class="enterprise-upgrade">
          Have more than one facility? Upgrade to Enterprise! <a href="#">Learn More</a>
        </div>
        <button class="contact-sales-btn">Contact Sales</button>
      </div>
      <a class="cancel-link" href="#">Cancel Subscription</a>
    </div>
  `,
  styles: [
    `.subscription-layout { max-width: 1100px; margin: 0 auto; padding: 2.5rem 0 1.5rem 0; }`,
    `.subscription-title { font-size: 2.2rem; font-weight: 700; color: #232b4d; margin-bottom: 2rem; }`,
    `.subscription-cards-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2.2rem; }`,
    `.subscription-card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(6,11,40,0.06); padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 0.7rem; border: 1px solid #e5eaf2; min-width: 0; }`,
    `.plan-card { grid-column: 1 / 4; display: flex; flex-direction: column; gap: 0.7rem; }`,
    `.card-label { color: #7b8ca6; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: 0.03em; }`,
    `.plan-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem; }`,
    `.plan-name { font-size: 1.3rem; font-weight: 700; color: #232b4d; }`,
    `.upgrade-btn { background: #1a6cff; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.3rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }`,
    `.plan-next-invoice { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.5rem; }`,
    `.plan-price-row { display: flex; align-items: flex-end; gap: 1.2rem; margin-top: 0.5rem; }`,
    `.plan-price { font-size: 2.1rem; font-weight: 700; color: #232b4d; }`,
    `.plan-price-desc { color: #7b8ca6; font-size: 1.05rem; }`,
    `.billing-card, .licenses-card, .payment-card, .invoices-card { min-width: 0; }`,
    `.billing-type { font-size: 1.15rem; font-weight: 600; color: #232b4d; margin-bottom: 0.2rem; }`,
    `.billing-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.7rem; }`,
    `.switch-btn { background: #fff; color: #1a6cff; border: 1.5px solid #1a6cff; border-radius: 6px; padding: 0.4rem 1.1rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; margin-top: 0.2rem; }`,
    `.licenses-row { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 0.5rem; }`,
    `.licenses-count { font-size: 1.15rem; font-weight: 600; color: #232b4d; }`,
    `.licenses-bar-bg { background: #eaf3ff; border-radius: 6px; width: 120px; height: 7px; display: inline-block; position: relative; }`,
    `.licenses-bar-fill { background: #1a6cff; border-radius: 6px; height: 7px; display: block; position: absolute; left: 0; top: 0; }`,
    `.licenses-desc { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.5rem; }`,
    `.manage-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; margin-top: 0.2rem; display: inline-block; }`,
    `.manage-link:hover { text-decoration: underline; }`,
    `.payment-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem; }`,
    `.payment-label { font-size: 1.1rem; font-weight: 600; color: #232b4d; }`,
    `.edit-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; cursor: pointer; }`,
    `.edit-link:hover { text-decoration: underline; }`,
    `.payment-method { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.2rem; }`,
    `.visa-badge { background: #eaf3ff; color: #1a6cff; border-radius: 4px; padding: 0.2rem 0.7rem; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.1em; }`,
    `.card-digits { color: #232b4d; font-size: 1.05rem; font-weight: 600; }`,
    `.billing-email { color: #232b4d; font-size: 1.05rem; margin-bottom: 0.2rem; }`,
    `.next-billing { color: #7b8ca6; font-size: 1.05rem; margin-bottom: 0.2rem; }`,
    `.invoices-row { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 0.5rem; }`,
    `.invoice-date { color: #232b4d; font-size: 1.05rem; font-weight: 500; }`,
    `.invoice-amount { color: #232b4d; font-size: 1.05rem; font-weight: 600; }`,
    `.invoice-status { font-size: 1.05rem; font-weight: 600; border-radius: 4px; padding: 0.1rem 0.7rem; }`,
    `.invoice-status.paid { background: #eaf3ff; color: #1a6cff; }`,
    `.invoice-download { color: #1a6cff; font-size: 1.2rem; text-decoration: none; cursor: pointer; }`,
    `.invoices-footer { display: flex; align-items: center; justify-content: space-between; color: #7b8ca6; font-size: 0.98rem; }`,
    `.view-all-link { color: #1a6cff; font-weight: 500; text-decoration: none; font-size: 1.05rem; margin-left: 1.2rem; }`,
    `.view-all-link:hover { text-decoration: underline; }`,
    `.subscription-footer { display: flex; align-items: center; justify-content: space-between; background: #0a2342; color: #fff; border-radius: 7px; padding: 1.1rem 2rem; margin-top: 2.2rem; margin-bottom: 1.2rem; }`,
    `.enterprise-upgrade { font-size: 1.08rem; font-weight: 500; }`,
    `.enterprise-upgrade a { color: #fff; text-decoration: underline; font-weight: 600; }`,
    `.contact-sales-btn { background: #fff; color: #0a2342; border: 1.5px solid #fff; border-radius: 6px; padding: 0.5rem 1.3rem; font-size: 1.05rem; font-weight: 600; cursor: pointer; }`,
    `.cancel-link { color: #7b8ca6; font-size: 1.05rem; font-weight: 500; text-decoration: none; margin-top: 1.2rem; display: inline-block; cursor: pointer; }`,
    `.cancel-link:hover { text-decoration: underline; }`,
    `@media (max-width: 900px) { .subscription-cards-grid { grid-template-columns: 1fr; } .plan-card { grid-column: 1 / 2; } }`
  ]
})
export class SubscriptionSettingsPageComponent {} 