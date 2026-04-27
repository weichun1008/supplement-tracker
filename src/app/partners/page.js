'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import styles from './page.module.css';

export default function PartnersPage() {
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

      {/* TODO: WhyPartner, PartnershipTypes, Form, Testimonial sections — added in later tasks */}

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
