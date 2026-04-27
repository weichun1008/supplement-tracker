import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimiter, formatInquiryHtml } from '../contact-helpers.js';

describe('createRateLimiter', () => {
  let now;
  let rate;

  beforeEach(() => {
    now = 1000;
    rate = createRateLimiter({ windowMs: 30_000, clock: () => now });
  });

  it('allows first request from an IP', () => {
    expect(rate.check('1.1.1.1')).toEqual({ allowed: true });
  });

  it('blocks second request within window', () => {
    rate.check('1.1.1.1');
    now += 5_000;
    const r = rate.check('1.1.1.1');
    expect(r.allowed).toBe(false);
    expect(r.retryAfterMs).toBe(25_000);
  });

  it('allows again after window', () => {
    rate.check('1.1.1.1');
    now += 31_000;
    expect(rate.check('1.1.1.1').allowed).toBe(true);
  });

  it('tracks IPs independently', () => {
    rate.check('1.1.1.1');
    expect(rate.check('2.2.2.2').allowed).toBe(true);
  });
});

describe('formatInquiryHtml', () => {
  it('renders Business inquiry with all fields', () => {
    const html = formatInquiryHtml({
      inquiryType: 'business',
      fullName: 'Jane Doe',
      email: 'jane@acme.com',
      country: 'US',
      company: 'Acme Corp',
      role: 'VP People',
      partnershipType: 'corporate-wellness',
      companySize: '500-5000',
      companyWebsite: 'https://acme.com',
      goals: 'We want to roll out wellness benefits to 2,000 employees in Q3.',
      timeline: '1-3mo',
    });
    expect(html).toContain('Jane Doe');
    expect(html).toContain('jane@acme.com');
    expect(html).toContain('Corporate Wellness');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('1-3 months');
  });

  it('renders Creator inquiry with multi-value fields', () => {
    const html = formatInquiryHtml({
      inquiryType: 'creator',
      fullName: 'Jane',
      email: 'jane@me.com',
      country: 'SG',
      company: '@janehealth',
      platforms: ['instagram', 'tiktok'],
      handleUrl: 'https://instagram.com/janehealth',
      followerRange: '50-100K',
      verticals: ['health', 'fitness'],
      audienceMarkets: ['SG', 'MY'],
    });
    expect(html).toContain('Instagram, TikTok');
    expect(html).toContain('Health & Wellness, Fitness');
    expect(html).toContain('SG, MY');
  });

  it('escapes HTML in user input', () => {
    const html = formatInquiryHtml({
      inquiryType: 'other',
      fullName: '<script>alert(1)</script>',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
