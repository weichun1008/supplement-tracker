'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, animate, useInView } from 'framer-motion';
import { Apple, Play, Star, ArrowRight, Smartphone } from 'lucide-react';
import { Instagram, Facebook, Youtube } from './components/BrandIcons';
import styles from './home.module.css';

function CountUp({ to, decimals = 0, suffix = '', prefix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return prefix + n.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
  });
  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return () => controls.stop();
    }
  }, [inView, to, count, duration]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

function TiltCard({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 8);
    rx.set(-y * 8);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

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
    url: "/partners",
    img: "https://images.pexels.com/photos/4173250/pexels-photo-4173250.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
  {
    label: "For Strategic Partners",
    title: "Scalable metabolic health at population level",
    desc: "Co-develop preventive health programs, population risk reduction initiatives, and digital engagement solutions for your organization.",
    cta: "Explore partnerships",
    url: "/partners",
    img: "https://images.pexels.com/photos/5256820/pexels-photo-5256820.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  },
];

export default function HomePage() {
  const expertRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
          <Link href="/partners" className={styles.navLink}>Partners</Link>
        </div>
        <div className={styles.navActions}>
          <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>Get Started</a>
        </div>
        <button
          className={styles.navHamburger}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen1 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen2 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen3 : ''}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className={styles.mobileMenu} onClick={() => setMenuOpen(false)}>
          <Link href="/flex8" className={styles.mobileMenuLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.mobileMenuLink}>1-on-1 Consultation</Link>
          <Link href="/partners" className={styles.mobileMenuLink}>Partners</Link>
          <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.mobileMenuCta}>Get Started</a>
        </div>
      )}

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
            <Link href="/partners" className={styles.btnSecondary}>Explore partnerships →</Link>
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
      <motion.div
        className={styles.proofBar}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.proofItem}><span className={styles.proofNum}><CountUp to={40000} suffix="+" /></span><span className={styles.proofLabel}>Clients Served</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}><CountUp to={100} suffix="+" /></span><span className={styles.proofLabel}>Certified Dietitians</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}><CountUp to={9} /></span><span className={styles.proofLabel}>Clinics in TW & HK</span></div>
        <div className={styles.proofDivider} />
        <div className={styles.proofItem}><span className={styles.proofNum}><CountUp to={4.8} decimals={1} suffix="★" /></span><span className={styles.proofLabel}>App Store · 1M+ Downloads</span></div>
      </motion.div>

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
            <div className={styles.stackWrap}>
              {[
                {
                  num: "01",
                  title: "Engagement Layer",
                  desc: "Where users meet Cofit every day",
                  items: ["Mobile App", "AI Coach", "Behavior Nudges", "Daily Logging"],
                  variant: "top",
                },
                {
                  num: "02",
                  title: "Care Layer",
                  desc: "Human expertise, personalized",
                  items: ["Certified Dietitian", "1:1 Coaching", "Custom Meal Plan", "Progress Review"],
                  variant: "mid",
                },
                {
                  num: "03",
                  title: "Clinical Layer",
                  desc: "Integrated with healthcare",
                  items: ["Clinic Network", "Lab Data", "Medical Follow-up", "Outcome Tracking"],
                  variant: "base",
                },
              ].map((layer, i) => (
                <TiltCard key={i} className={`${styles.stackCard} ${styles[`stack_${layer.variant}`]}`} delay={i * 0.12}>
                  <div className={styles.stackHeader}>
                    <span className={styles.stackNum}>{layer.num}</span>
                    <div>
                      <div className={styles.stackTitle}>{layer.title}</div>
                      <div className={styles.stackDesc}>{layer.desc}</div>
                    </div>
                  </div>
                  <div className={styles.stackPills}>
                    {layer.items.map((item, j) => (
                      <span key={j} className={styles.stackPill}>{item}</span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Community & App ── */}
      <section className={styles.communitySection}>
        <div className={styles.communityInner}>
          <div className={styles.sectionLabel} style={{ textAlign: 'center' }}>Community & Tools</div>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Trusted by millions, every day</h2>
          <p className={styles.expertsDesc}>Our app and YouTube channel reach over a million people building healthier habits.</p>

          <div className={styles.communityGrid}>
            {/* YouTube Card */}
            <motion.a
              href="https://www.youtube.com/@Cofit211"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.communityCard} ${styles.communityYT}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.communityBadge}>
                <Youtube size={28} strokeWidth={2} />
              </div>
              <div className={styles.communityStat}>
                <span className={styles.communityNum}><CountUp to={1030000} suffix="+" /></span>
                <span className={styles.communitySubtle}>subscribers</span>
              </div>
              <h3 className={styles.communityTitle}>Taiwan's #1 nutrition channel</h3>
              <p className={styles.communityDesc}>
                Science-backed nutrition, hormone health, and metabolic wellness — new episodes every week, entirely free.
              </p>
              <div className={styles.communityMeta}>
                <span>@Cofit211</span>
                <span className={styles.communityCta}>Subscribe <ArrowRight size={16} /></span>
              </div>
            </motion.a>

            {/* App Download Card */}
            <motion.div
              className={`${styles.communityCard} ${styles.communityApp}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.communityBadge} style={{ background: 'rgba(0,79,81,0.1)', color: 'var(--teal)' }}>
                <Smartphone size={28} strokeWidth={2} />
              </div>
              <div className={styles.communityStat}>
                <span className={styles.communityNum}><CountUp to={1000000} suffix="+" /></span>
                <span className={styles.communitySubtle}>downloads</span>
              </div>
              <h3 className={styles.communityTitle}>Your nutritionist in your pocket</h3>
              <p className={styles.communityDesc}>
                Log meals, track habits, message your dietitian, and get AI-powered nudges — all in one app. 4.8★ rated.
              </p>
              <div className={styles.storeBadges}>
                <a href="#" className={styles.storeBadge} aria-label="Download on the App Store">
                  <Apple size={22} strokeWidth={1.75} />
                  <div className={styles.storeBadgeText}>
                    <span className={styles.storeBadgeSmall}>Download on the</span>
                    <span className={styles.storeBadgeBig}>App Store</span>
                  </div>
                </a>
                <a href="#" className={styles.storeBadge} aria-label="Get it on Google Play">
                  <Play size={22} strokeWidth={1.75} fill="currentColor" />
                  <div className={styles.storeBadgeText}>
                    <span className={styles.storeBadgeSmall}>GET IT ON</span>
                    <span className={styles.storeBadgeBig}>Google Play</span>
                  </div>
                </a>
              </div>
            </motion.div>
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
              From corporate wellness to creator collaborations — let's talk.
            </p>
            <p className={styles.partnerDesc}>Areas of interest: metabolic health · obesity · diabetes prevention · hypertension · nutrition education · kidney and cardiometabolic health</p>
            <Link href="/partners" className={styles.btnPrimary} style={{ display: 'inline-block', marginTop: 24 }}>Explore partnerships →</Link>
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
                <a href="https://www.instagram.com/hicofit" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><Instagram size={16} strokeWidth={1.75} /></a>
                <a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><Facebook size={16} strokeWidth={1.75} /></a>
                <a href="https://www.youtube.com/@Cofit211" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><Youtube size={16} strokeWidth={1.75} /></a>
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
                <li><Link href="/partners">Partners</Link></li>
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
