import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/app/lib/contact-schema';
import { createRateLimiter, formatInquiryHtml } from '@/app/lib/contact-helpers';

// TODO(engineer): in-memory rate limit only works per serverless instance.
//   Production should use Upstash Redis or similar for cross-region consistency.
//   See docs/handoff/partners-page.md item #3.
const rate = createRateLimiter({ windowMs: 30_000 });

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — if non-empty, return 200 to disguise rejection from bots.
  if (body?.website_url) {
    return NextResponse.json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const limited = rate.check(ip);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfterMs: limited.retryAfterMs },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[/api/contact] RESEND_API_KEY missing');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const data = parsed.data;
  const subjectMap = {
    business: `[Partners] Business – ${data.company}`,
    creator: `[Partners] Creator – ${data.company}`,
    other: `[Partners] Other – ${data.subject || data.company}`,
  };

  // TODO(engineer): swap CONTACT_FROM_EMAIL to verified domain
  //   (e.g. "Cofit Partners <noreply@send.cofit.me>") after DNS setup.
  //   See docs/handoff/partners-page.md item #1.
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const to = process.env.CONTACT_TO_EMAIL || 'hello@cofit.me';

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: subjectMap[data.inquiryType],
      html: formatInquiryHtml(data),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/contact] Resend send failed:', err);
    return NextResponse.json({ error: 'Send failed' }, { status: 502 });
  }
}
