export function createRateLimiter({ windowMs, clock = Date.now }) {
  const lastSeen = new Map();
  return {
    check(ip) {
      const now = clock();
      const prev = lastSeen.get(ip);
      if (prev !== undefined && now - prev < windowMs) {
        return { allowed: false, retryAfterMs: windowMs - (now - prev) };
      }
      lastSeen.set(ip, now);
      return { allowed: true };
    },
  };
}

const LABELS = {
  'corporate-wellness': 'Corporate Wellness',
  'insurance': 'Insurance Partnership',
  'distribution': 'Distribution / Reseller',
  'white-label': 'White-label / Licensing',
  'provider-referral': 'Healthcare Provider Referral',
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
  'threads': 'Threads',
  'health': 'Health & Wellness',
  'fitness': 'Fitness',
  'food': 'Food',
  'parenting': 'Parenting',
  'lifestyle': 'Lifestyle',
  'beauty': 'Beauty',
  'sponsored': 'Sponsored content',
  'ambassador': 'Long-term ambassador',
  'affiliate': 'Affiliate / revenue share',
  'co-branded': 'Co-branded product',
  'asap': 'ASAP',
  '1-3mo': '1-3 months',
  '3-6mo': '3-6 months',
  'exploring': 'Just exploring',
  'other': 'Other',
};

function label(key) {
  return LABELS[key] || key;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderValue(v) {
  if (Array.isArray(v)) {
    return v.map((item) => (LABELS[item] ? LABELS[item] : escapeHtml(item))).join(', ');
  }
  return LABELS[v] ? LABELS[v] : escapeHtml(v);
}

function row(k, v) {
  if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return '';
  return `<tr><td style="padding:8px 16px;color:#666;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 16px;color:#111">${renderValue(v)}</td></tr>`;
}

export function formatInquiryHtml(d) {
  const rows = [];
  rows.push(row('Inquiry Type', d.inquiryType));
  rows.push(row('Name', d.fullName));
  rows.push(row('Email', d.email));
  rows.push(row('Country', d.country));
  rows.push(row(d.inquiryType === 'creator' ? 'Channel' : 'Company', d.company));
  rows.push(row('Role', d.role));

  if (d.inquiryType === 'business') {
    rows.push(row('Partnership Type', d.partnershipType));
    rows.push(row('Company Size', d.companySize));
    rows.push(row('Website', d.companyWebsite));
    rows.push(row('Goals', d.goals));
    rows.push(row('Timeline', d.timeline));
  } else if (d.inquiryType === 'creator') {
    rows.push(row('Platforms', d.platforms));
    rows.push(row('Handle / URL', d.handleUrl));
    rows.push(row('Followers', d.followerRange));
    rows.push(row('Verticals', d.verticals));
    rows.push(row('Audience Markets', d.audienceMarkets));
    rows.push(row('Past Collaborations', d.pastCollaborations));
    rows.push(row('Preferred Collab Types', d.preferredCollabTypes));
    rows.push(row('Notes', d.notes));
  } else {
    rows.push(row('Subject', d.subject));
    rows.push(row('Message', d.message));
  }

  return `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;background:#FCFCFA;padding:24px">
<h2 style="color:#004F51;margin:0 0 16px">New ${escapeHtml(label(d.inquiryType) || 'inquiry')}</h2>
<table style="border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
${rows.join('')}
</table>
<p style="color:#888;margin-top:16px;font-size:12px">Reply directly to this email to respond to ${escapeHtml(d.fullName || 'the sender')}.</p>
</body></html>`;
}
