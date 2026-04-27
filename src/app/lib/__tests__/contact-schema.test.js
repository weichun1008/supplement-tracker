import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact-schema.js';

describe('contactSchema — shared fields', () => {
  it('rejects missing fullName', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'not-an-email',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });

  it('rejects unsupported country', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'a@b.com',
      country: 'XX',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });
});

describe('contactSchema — business variant', () => {
  const valid = {
    inquiryType: 'business',
    fullName: 'Jane',
    email: 'jane@acme.com',
    country: 'US',
    company: 'Acme',
    partnershipType: 'corporate-wellness',
    goals: 'A'.repeat(60),
    website_url: '',
  };

  it('accepts valid business inquiry', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects goals shorter than 50 chars', () => {
    expect(contactSchema.safeParse({ ...valid, goals: 'too short' }).success).toBe(false);
  });

  it('rejects unknown partnershipType', () => {
    expect(contactSchema.safeParse({ ...valid, partnershipType: 'bogus' }).success).toBe(false);
  });
});

describe('contactSchema — creator variant', () => {
  const valid = {
    inquiryType: 'creator',
    fullName: 'Jane',
    email: 'jane@me.com',
    country: 'SG',
    company: '@janehealth',
    platforms: ['instagram'],
    handleUrl: 'https://instagram.com/janehealth',
    followerRange: '50-100K',
    verticals: ['health'],
    audienceMarkets: ['SG', 'MY'],
    website_url: '',
  };

  it('accepts valid creator inquiry', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty platforms array', () => {
    expect(contactSchema.safeParse({ ...valid, platforms: [] }).success).toBe(false);
  });

  it('rejects empty verticals array', () => {
    expect(contactSchema.safeParse({ ...valid, verticals: [] }).success).toBe(false);
  });

  it('rejects empty audienceMarkets array', () => {
    expect(contactSchema.safeParse({ ...valid, audienceMarkets: [] }).success).toBe(false);
  });
});

describe('contactSchema — honeypot', () => {
  it('rejects when website_url has any value', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello',
      website_url: 'http://spam.com',
    });
    expect(r.success).toBe(false);
  });
});
