import { z } from 'zod';

export const COUNTRIES = ['SG', 'US', 'TW', 'MY', 'HK', 'OTHER'];
export const PARTNERSHIP_TYPES = [
  'corporate-wellness',
  'insurance',
  'distribution',
  'white-label',
  'provider-referral',
  'other',
];
export const COMPANY_SIZES = ['<50', '50-500', '500-5000', '5000+'];
export const TIMELINES = ['asap', '1-3mo', '3-6mo', 'exploring'];
export const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'threads', 'other'];
export const FOLLOWER_RANGES = ['<10K', '10-50K', '50-100K', '100-500K', '500K-1M', '1M+'];
export const VERTICALS = ['health', 'fitness', 'food', 'parenting', 'lifestyle', 'beauty', 'other'];
export const AUDIENCE_MARKETS = ['TW', 'SG', 'MY', 'US', 'HK', 'OTHER'];
export const COLLAB_TYPES = ['sponsored', 'ambassador', 'affiliate', 'co-branded', 'other'];

const baseShape = {
  fullName: z.string().min(1),
  email: z.email(),
  country: z.enum(COUNTRIES),
  company: z.string().min(1),
  role: z.string().optional(),
  website_url: z.literal(''),
};

const businessSchema = z.object({
  inquiryType: z.literal('business'),
  ...baseShape,
  partnershipType: z.enum(PARTNERSHIP_TYPES),
  companySize: z.enum(COMPANY_SIZES).optional(),
  companyWebsite: z.union([z.url(), z.literal('')]).optional(),
  goals: z.string().min(50),
  timeline: z.enum(TIMELINES).optional(),
});

const creatorSchema = z.object({
  inquiryType: z.literal('creator'),
  ...baseShape,
  platforms: z.array(z.enum(PLATFORMS)).min(1),
  handleUrl: z.string().min(1),
  followerRange: z.enum(FOLLOWER_RANGES),
  verticals: z.array(z.enum(VERTICALS)).min(1),
  audienceMarkets: z.array(z.enum(AUDIENCE_MARKETS)).min(1),
  pastCollaborations: z.string().optional(),
  preferredCollabTypes: z.array(z.enum(COLLAB_TYPES)).optional(),
  notes: z.string().optional(),
});

const otherSchema = z.object({
  inquiryType: z.literal('other'),
  ...baseShape,
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const contactSchema = z.discriminatedUnion('inquiryType', [
  businessSchema,
  creatorSchema,
  otherSchema,
]);
