'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, FlaskConical, Award, Building2, ShieldCheck, Truck, Layers, Stethoscope, Sparkles, AlertCircle, Loader2, Check } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import styles from './page.module.css';

export default function PartnersPage() {
  const [inquiryType, setInquiryType] = useState('business');
  const [partnershipType, setPartnershipType] = useState('');
  const formRef = useRef(null);

  function selectAndScroll(type, ptype = '') {
    setInquiryType(type);
    setPartnershipType(ptype);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', email: '', country: '', company: '', role: '',
    // business
    companySize: '', companyWebsite: '', goals: '', timeline: '',
    // creator
    platforms: [], handleUrl: '', followerRange: '', verticals: [], audienceMarkets: [],
    pastCollaborations: '', preferredCollabTypes: [], notes: '',
    // other
    subject: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [submitError, setSubmitError] = useState('');

  function setField(name, value) {
    setFormData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function toggleMulti(name, value) {
    setFormData((d) => {
      const cur = d[name] || [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...d, [name]: next };
    });
  }

  return (
    <div className={styles.page}>
      {/* ── Navbar (mirrors src/app/page.js structure) ── */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <span className={styles.navLogoGreen}>cofit</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/flex8" className={styles.navLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.navLink}>1-on-1 Consultation</Link>
          <Link href="/partners" className={`${styles.navLink} ${styles.navLinkActive}`}>Partners</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/consultation" className={styles.navCta}>Get Started</Link>
        </div>
        <button
          className={styles.navHamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen1 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen2 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen3 : ''}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/flex8" className={styles.mobileMenuLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.mobileMenuLink}>1-on-1 Consultation</Link>
          <Link href="/partners" className={styles.mobileMenuLink}>Partners</Link>
          <Link href="/consultation" className={styles.mobileMenuCta}>Get Started</Link>
        </div>
      )}

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.heroEyebrow}>PARTNERSHIPS</div>
          <h1 className={styles.heroTitle}>Partner with Cofit</h1>
          <p className={styles.heroLead}>
            Reach over a million people building healthier habits across Asia and the US.
            From corporate wellness to creator collaborations — let's talk.
          </p>
          <div className={styles.heroProof}>
            <div><strong>1M+</strong> users</div>
            <div><strong>1.03M</strong> YT subscribers</div>
            <div><strong>100+</strong> partners</div>
          </div>
        </motion.div>
      </section>

      {/* ── Why Partner ── */}
      <section className={styles.whySection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Why Cofit</h2>
          <div className={styles.whyGrid}>
            {[
              { Icon: Users, title: 'Real Reach', desc: '1M+ app users and 1.03M YouTube subscribers across TW, SG, MY, and US — primarily Asian-diaspora audiences.' },
              { Icon: FlaskConical, title: 'Science-Led', desc: 'Every program is built and delivered by certified clinical nutritionists. Evidence-based, never fad-driven.' },
              { Icon: Award, title: 'Trusted Brand', desc: '9 years operating with major media coverage, hospital partnerships, and a 4.8★ user rating.' },
            ].map((c, i) => (
              <motion.div
                key={i}
                className={styles.whyCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.whyIcon}><c.Icon size={22} strokeWidth={1.75} /></div>
                <h3 className={styles.whyTitle}>{c.title}</h3>
                <p className={styles.whyDesc}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership Types ── */}
      <section className={styles.typesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>WAYS TO WORK TOGETHER</div>
          <h2 className={styles.sectionTitle}>Pick what fits your business</h2>
          <p className={styles.sectionLead}>Click any card to jump straight to the form with the right inquiry type pre-selected.</p>
          <div className={styles.typesGrid}>
            {[
              { Icon: Building2, title: 'Corporate Wellness', desc: 'Group-class nutrition for employee benefits programs.', kind: 'business', sub: 'corporate-wellness' },
              { Icon: ShieldCheck, title: 'Insurance Partnership', desc: 'Add-on coverage, claims-driven preventive care.', kind: 'business', sub: 'insurance' },
              { Icon: Truck, title: 'Distribution / Reseller', desc: 'Local market partners across Asia and North America.', kind: 'business', sub: 'distribution' },
              { Icon: Layers, title: 'White-label / Licensing', desc: 'Power your hospital, clinic, or app with Cofit.', kind: 'business', sub: 'white-label' },
              { Icon: Stethoscope, title: 'Provider Referral', desc: 'Doctors, gyms, and pharmacies referring clients to us.', kind: 'business', sub: 'provider-referral' },
              { Icon: Sparkles, title: 'Creator Collaboration', desc: 'KOL partnerships, sponsored content, ambassador programs.', kind: 'creator', sub: '' },
            ].map((t, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => selectAndScroll(t.kind, t.sub)}
                className={styles.typeCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
              >
                <div className={styles.typeIcon}><t.Icon size={20} strokeWidth={1.75} /></div>
                <h3 className={styles.typeTitle}>{t.title}</h3>
                <p className={styles.typeDesc}>{t.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section ref={formRef} className={styles.formSection}>
        <div className={styles.formInner}>
          <div className={styles.sectionEyebrow} style={{ textAlign: 'center', display: 'block' }}>GET IN TOUCH</div>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Tell us about your project</h2>

          {submitState === 'success' ? (
            <SuccessCard firstName={formData.fullName.split(' ')[0]} />
          ) : (
            <form
              className={styles.form}
              onSubmit={(e) => { e.preventDefault(); /* handler added in Task 9 */ }}
              noValidate
            >
              {/* honeypot — bots will fill this; humans won't see it */}
              <input
                type="text" tabIndex={-1} autoComplete="off"
                name="website_url" value={formData.website_url || ''}
                onChange={(e) => setField('website_url', e.target.value)}
                className={styles.honeypot} aria-hidden="true"
              />

              {/* Inquiry Type pills */}
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>What brings you here?<span className={styles.req}>*</span></legend>
                <div role="radiogroup" aria-label="Inquiry type" className={styles.pillGroup}>
                  {[
                    { v: 'business', label: 'Business Partnership' },
                    { v: 'creator', label: 'Creator Collaboration' },
                    { v: 'other', label: 'Other' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      role="radio"
                      aria-checked={inquiryType === opt.v}
                      onClick={() => setInquiryType(opt.v)}
                      className={`${styles.pill} ${inquiryType === opt.v ? styles.pillActive : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Always-shown */}
              <div className={styles.formGrid}>
                <Field
                  label="Full Name" name="fullName" required
                  value={formData.fullName} onChange={setField} error={errors.fullName}
                />
                <Field
                  label="Work Email" name="email" type="email" required
                  value={formData.email} onChange={setField} error={errors.email}
                  help="A work email helps us route faster, but personal email works too."
                />
                <Field
                  label="Country / Region" name="country" type="select" required
                  options={[
                    { v: '', label: 'Select…' }, { v: 'SG', label: 'Singapore' },
                    { v: 'US', label: 'United States' }, { v: 'TW', label: 'Taiwan' },
                    { v: 'MY', label: 'Malaysia' }, { v: 'HK', label: 'Hong Kong' }, { v: 'OTHER', label: 'Other' },
                  ]}
                  value={formData.country} onChange={setField} error={errors.country}
                />
                <Field
                  label={inquiryType === 'creator' ? 'Brand / Channel name' : 'Company / Brand'} name="company" required
                  value={formData.company} onChange={setField} error={errors.company}
                />
                <Field
                  label="Role / Title" name="role"
                  value={formData.role} onChange={setField}
                />
              </div>

              {/* TODO Task 8: conditional sections (business / creator / other) here */}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitState === 'submitting'}
                aria-busy={submitState === 'submitting'}
              >
                {submitState === 'submitting' ? (
                  <><Loader2 size={18} className={styles.spinIcon} /> Sending…</>
                ) : (
                  <>Send inquiry →</>
                )}
              </button>
              {submitState === 'error' && (
                <p className={styles.submitError}><AlertCircle size={16} /> {submitError || 'Something went wrong. Please email hello@cofit.me directly.'}</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* TODO: Testimonial section — added in later tasks */}

      {/* ── Footer (placeholder; replaced in Task 10) ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}><span className={styles.navLogoGreen}>cofit</span></span>
          <span className={styles.footerCopy}>© Cofit Healthcare</span>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, name, type = 'text', required, value, onChange, error, help, options }) {
  const id = `f-${name}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}{required && <span className={styles.req}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id} name={name} value={value} onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
          rows={4} className={styles.fieldInput}
        />
      ) : type === 'select' ? (
        <select
          id={id} name={name} value={value} onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} className={styles.fieldInput}
        >
          {options?.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      ) : (
        <input
          id={id} type={type} name={name} value={value}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
          className={styles.fieldInput}
        />
      )}
      {help && !error && <small id={`${id}-help`} className={styles.fieldHelp}>{help}</small>}
      {error && <small id={`${id}-err`} className={styles.fieldError}><AlertCircle size={12} /> {error}</small>}
    </div>
  );
}

function SuccessCard({ firstName }) {
  return (
    <motion.div
      className={styles.successCard}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.successCheck}><Check size={28} strokeWidth={2.5} /></div>
      <h3 className={styles.successTitle}>Thanks{firstName ? `, ${firstName}` : ''}!</h3>
      <p className={styles.successDesc}>We received your inquiry and will get back within 2 business days.</p>
      <Link href="/" className={styles.successLink}>Browse our programs →</Link>
    </motion.div>
  );
}
