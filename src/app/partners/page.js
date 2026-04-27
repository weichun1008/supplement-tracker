'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, FlaskConical, Award, Building2, ShieldCheck, Truck, Layers, Stethoscope, Sparkles } from 'lucide-react';
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

      {/* TODO: Form, Testimonial sections — added in later tasks */}

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
