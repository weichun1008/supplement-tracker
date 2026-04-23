'use client';

import { useRef } from 'react';
import Link from 'next/link';
import styles from './home.module.css';

const EXPERTS = [
  { name: "張宜婷 Y.T. Chang", role: "Chief Dietitian · CTSSN Certified", tags: ["Weight Loss", "PCOS", "Diabetes"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-8048654a-87ef-4f39-ab39-aae80ed29fae.png" },
  { name: "方晴誼 C.Y. Fang", role: "Head Nutritionist · Obesity Prevention", tags: ["Gut Health", "Obesity"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-d98bc86d-38d0-445f-ae61-33178a4fe07b.png" },
  { name: "張益堯 Y.Y. Chang", role: "Family Health Consultant · 20yr Exp.", tags: ["Metabolic", "Family"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-a0a1737a-a367-4348-a899-0bed3a07a145.png" },
  { name: "蓡宗真 C.C. Tsai", role: "Clinical Nutritionist", tags: ["Clinical", "Weight Loss"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-75d8445a-46b5-4588-a5dc-9aedac6bcdb0.png" },
  { name: "黃靖淳 J.C. Huang", role: "Sports Dietitian", tags: ["Sports", "Body Comp"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-c2680653-6b41-4777-838d-d488acc3d092.png" },
  { name: "郭環棻 H.F. Kuo", role: "Hormone Health Specialist", tags: ["PCOS", "Hormones"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-09404677-f5d5-4095-9124-9fd0bc5c152c.png" },
];

const MEDIA = [
  {
    name: "Yahoo!",
    svg: (
      <svg height="24" viewBox="0 0 150 38" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <text x="2" y="30" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="32" fontStyle="italic" fill="currentColor">Yahoo!</text>
      </svg>
    ),
  },
  {
    name: "ELLE",
    svg: (
      <svg height="28" viewBox="0 0 110 38" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <text x="2" y="32" fontFamily="Times New Roman, Georgia, serif" fontWeight="900" fontSize="36" fontStyle="italic" fill="currentColor" letterSpacing="4">ELLE</text>
      </svg>
    ),
  },
  {
    name: "GQ",
    svg: (
      <svg height="28" viewBox="0 0 70 38" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <text x="2" y="32" fontFamily="Georgia, serif" fontWeight="700" fontSize="36" fill="currentColor">GQ</text>
      </svg>
    ),
  },
  {
    name: "TVBS",
    svg: (
      <svg height="22" viewBox="0 0 110 34" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <text x="2" y="28" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="28" fill="currentColor" letterSpacing="2">TVBS</text>
      </svg>
    ),
  },
  {
    name: "CommonHealth",
    svg: (
      <svg height="20" viewBox="0 0 240 30" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <text x="2" y="24" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="currentColor">CommonHealth</text>
      </svg>
    ),
  },
];

const SOLUTIONS = [
  {
    label: "For Individuals",
    title: "Your health, supported by science",
    desc: "Structured programs for weight management, blood sugar, hormone health, and long-term lifestyle change — led by certified dietitians.",
    cta: "Book a Consultation",
    url: "/consultation",
    img: "https://images.pexels.com/photos/7262931/pexels-photo-7262931.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    label: "For Healthcare Providers",
    title: "Extend your care with digital nutrition",
    desc: "Integrate Cofit into your clinic or care pathway. We support patient education, digital follow-up, and hybrid online-offline care models.",
    cta: "Explore Partnerships",
    url: "mailto:partner@cofit.me",
    img: "https://images.pexels.com/photos/4173250/pexels-photo-4173250.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    label: "For Strategic Partners",
    title: "Scalable metabolic health at population level",
    desc: "Co-develop preventive health programs, population risk reduction initiatives, and digital engagement solutions for your organization.",
    cta: "Partner with Us",
    url: "mailto:partner@cofit.me",
    img: "https://images.pexels.com/photos/5256820/pexels-photo-5256820.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
];

export default function HomePage() {
  const expertRef = useRef(null);
  const scroll = (ref, dir) => { if (ref.current) ref.current.scrollBy({ left: dir * 400, behavior: 'smooth' }); };

  return (
    <div className={styles.page}>

      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <span className={styles.navLogoGreen}>cofit</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/flex8" className={styles.navLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.navLink}>1-on-1 Consultation</Link>
          <a href="mailto:partner@cofit.me" className={styles.navLink}>Partner with Us</a>
        </div>
        <div className={styles.navActions}>
          <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>Get Started</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Digital Health · Nutrition Science · AI-Driven Care</span>
          <h1 className={styles.heroTitle}>
            Helping people build<br />
            <span className={styles.heroAccent}>lasting metabolic health</span>
          </h1>
          <p className={styles.heroSub}>
            Cofit combines nutrition science, behavior-change design, and professional care to support sustainable improvements in weight, blood sugar, and long-term metabolic health.
          </p>
          <p className={styles.heroBrand}>Change behavior, live better.</p>
          <div className={styles.heroCtas}>
            <Link href="/consultation" className={styles.btnPrimary}>Book a Consultation</Link>
            <a href="mailto:partner@cofit.me" className={styles.btnSecondary}>Partner with Us →</a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <img
            src="https://images.pexels.com/photos/21856849/pexels-photo-21856849.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop"
            alt="Healthy lifestyle"
            className={styles.heroImg}
          />
          <div className={styles.heroCard}>
            <div className={styles.heroCardStar}>★★★★★</div>
            <div className={styles.heroCardText}>"Down 6kg in 8 weeks.<br />Finally understood my hormones."</div>
            <div className={styles.heroCardAuthor}>— Sarah L., Singapore</div>
          </div>
        </div>
      </header>

      {/* ── Proof Bar ── */}
      <div className={styles.proofBar}>
        <div className={styles.proofItem}><span className={styles.proofNum}>40,000+</span><span className={styles.proofLabel}>Clients Served</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}>100+</span><span className={styles.proofLabel}>Certified Dietitians</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}>9</span><span className={styles.proofLabel}>Clinics in TW & HK</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}>4.8★</span><span className={styles.proofLabel}>App Store · 1M+ Downloads</span></div>
      </div>

      {/* ── Media ── */}
      <div className={styles.mediaBar}>
        <span className={styles.mediaLabel}>As featured in</span>
        <div className={styles.mediaLogos}>
          {MEDIA.map((m, i) => (
            <span key={i} className={styles.mediaLogo} title={m.name}>{m.svg}</span>
          ))}
        </div>
      </div>

      {/* ── Problem → Solution ── */}
      <section className={styles.problemSection}>
        <div className={styles.problemInner}>
          <div className={styles.sectionLabel}>Why Cofit</div>
          <h2 className={styles.sectionTitle}>Better health outcomes require<br />more than information</h2>
          <p className={styles.problemText}>
            Obesity, diabetes, and metabolic conditions continue to rise worldwide — despite unprecedented access to health information. The gap is not awareness. It is execution.
          </p>
          <p className={styles.problemText}>
            Most people struggle not because they don't know what matters, but because translating guidance into daily action is hard to sustain.
          </p>
          <p className={styles.problemCta}><strong>Cofit was built to close that gap.</strong></p>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className={styles.solutionsSection}>
        <div className={styles.solutionsInner}>
          <div className={styles.sectionLabel}>Solutions</div>
          <h2 className={styles.sectionTitle}>For individuals, providers, and partners</h2>
          <div className={styles.solutionsGrid}>
            {SOLUTIONS.map((s, i) => (
              <div key={i} className={styles.solutionCard}>
                <div className={styles.solutionImgWrap}>
                  <img src={s.img} alt={s.title} className={styles.solutionImg} />
                  <div className={styles.solutionImgOverlay} />
                  <span className={styles.solutionLabel}>{s.label}</span>
                </div>
                <div className={styles.solutionBody}>
                  <h3 className={styles.solutionTitle}>{s.title}</h3>
                  <p className={styles.solutionDesc}>{s.desc}</p>
                  <a href={s.url} className={styles.solutionCta}>{s.cta} →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DTx Vision ── */}
      <section className={styles.dtxSection}>
        <div className={styles.dtxInner}>
          <div className={styles.dtxContent}>
            <span className={styles.sectionLabel}>What's Next</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>AI-driven Digital Therapeutics</h2>
            <p className={styles.dtxText}>
              Beyond nutrition, Cofit is building a new generation of AI-powered digital therapeutics (DTx) to support a wider range of clinical contexts — from metabolic disease management to chronic condition support.
            </p>
            <p className={styles.dtxText}>
              Our model connects digital engagement with clinical touchpoints, enabling continuity of care that scales across populations while remaining deeply personal.
            </p>
            <div className={styles.dtxPillars}>
              {["Nutrition Science", "Behavior-Change Design", "Professional Care", "AI Engagement", "Clinical Extension"].map((p, i) => (
                <span key={i} className={styles.dtxPill}>{p}</span>
              ))}
            </div>
          </div>
          <div className={styles.dtxVisual}>
            <div className={styles.ecosystemDiagram}>
              {[
                { icon: "👤", label: "Patient" },
                { icon: "📱", label: "Digital Support" },
                { icon: "🥗", label: "Dietitian" },
                { icon: "🏥", label: "Clinic" },
                { icon: "🔄", label: "Follow-up" },
              ].map((step, i, arr) => (
                <div key={i} className={styles.ecoRow}>
                  <div className={styles.ecoStep}>
                    <div className={styles.ecoIcon}>{step.icon}</div>
                    <div className={styles.ecoLabel}>{step.label}</div>
                  </div>
                  {i < arr.length - 1 && <div className={styles.ecoArrow}>↓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nutritionists ── */}
      <section className={styles.expertsSection}>
        <div className={styles.sectionLabel} style={{ textAlign: 'center' }}>Our Nutritionists</div>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Board-certified dietitians, ready for you</h2>
        <p className={styles.expertsDesc}>Every Cofit nutritionist is nationally certified, clinically experienced, and personally vetted.</p>
        <div className={styles.carouselWrap}>
          <button className={styles.carouselNavLeft} onClick={() => scroll(expertRef, -1)}>←</button>
          <div className={styles.carouselTrack} ref={expertRef}>
            {EXPERTS.map((e, i) => (
              <div key={i} className={styles.expertCard}>
                <img src={e.img} alt={e.name} className={styles.expertImg} />
                <div className={styles.expertBody}>
                  <p className={styles.expertName}>{e.name}</p>
                  <p className={styles.expertRole}>{e.role}</p>
                  <div className={styles.expertTags}>
                    {e.tags.map((t, j) => <span key={j} className={styles.expertTag}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={styles.carouselNavRight} onClick={() => scroll(expertRef, 1)}>→</button>
        </div>
      </section>

      {/* ── Partner CTA ── */}
      <section className={styles.partnerSection}>
        <div className={styles.partnerInner}>
          <div className={styles.partnerContent}>
            <span className={styles.sectionLabel}>Partnerships</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>Let's build better metabolic health together</h2>
            <p className={styles.partnerDesc}>
              We welcome collaboration with clinics, hospitals, corporate wellness programs, and regional health organizations that share a commitment to prevention and sustainable behavior change.
            </p>
            <p className={styles.partnerDesc}>Areas of interest: metabolic health · obesity · diabetes prevention · hypertension · nutrition education · kidney and cardiometabolic health</p>
            <a href="mailto:partner@cofit.me" className={styles.btnPrimary} style={{ display: 'inline-block', marginTop: 24 }}>Contact Us →</a>
          </div>
          <div className={styles.partnerStats}>
            {[
              { num: "9", label: "Clinics across Taiwan & Hong Kong" },
              { num: "8+", label: "Years of clinical nutrition experience" },
              { num: "3", label: "Peer-reviewed research publications" },
            ].map((s, i) => (
              <div key={i} className={styles.partnerStat}>
                <div className={styles.partnerStatNum}>{s.num}</div>
                <div className={styles.partnerStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}><span className={styles.navLogoGreen}>cofit</span></span>
              <p className={styles.footerDesc}>Connecting people with registered dietitians to make personalized nutrition care easy to access and affordable. Powered by Cofit Healthcare.</p>
              <div className={styles.footerSocials}>
                <a href="https://www.instagram.com/hicofit" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>📸</a>
                <a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>💼</a>
              </div>
            </div>
            <div className={styles.footerCol}>
              <h5>Services</h5>
              <ul>
                <li><Link href="/flex8">Flex8 Program</Link></li>
                <li><Link href="/consultation">1-on-1 Consultation</Link></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>Company</h5>
              <ul>
                <li><a href="mailto:partner@cofit.me">Partner with Us</a></li>
                <li><a href="mailto:media@cofit.me">Media & Press</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Cofit Healthcare Inc. All Rights Reserved.</span>
            <span>Headquarters: Taiwan</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
