"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Video, Dna, Salad, MessageCircle } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import styles from '../flex8/page.module.css';

const EXPERTS = [
  { name: "張宜婷 Y.T. Chang", role: "Chief Dietitian · CTSSN Certified", quote: "With hundreds of lectures and online course development experience, I bring evidence-based nutrition science to help you achieve lasting, measurable results.", tags: ["Weight Loss", "PCOS", "Diabetes"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-8048654a-87ef-4f39-ab39-aae80ed29fae.png" },
  { name: "方晴誼 C.Y. Fang", role: "Head Nutritionist · Obesity Prevention", quote: "As former head nutritionist at Wanfang Hospital's obesity center, I focus on sustainable, lifelong approaches to weight and metabolic health.", tags: ["Gut Health", "Obesity"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-d98bc86d-38d0-445f-ae61-33178a4fe07b.png" },
  { name: "張益堯 Y.Y. Chang", role: "Family Health Consultant · 20yr Exp.", quote: "Certified olive oil sommelier and co-author of 'Eat for a Healthy Brain'. 20 years of metabolic health and weight management expertise.", tags: ["Metabolic", "Family"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-a0a1737a-a367-4348-a899-0bed3a07a145.png" },
  { name: "蓡宗真 C.C. Tsai", role: "Clinical Nutritionist", quote: "I specialize in creating personalized nutrition plans backed by clinical data, helping clients find the right balance for their unique body type.", tags: ["Clinical", "Weight Loss"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-75d8445a-46b5-4588-a5dc-9aedac6bcdb0.png" },
  { name: "黃靖淳 J.C. Huang", role: "Sports Dietitian", quote: "With deep expertise in sports nutrition and body composition, I help clients optimize their performance while achieving sustainable fat loss.", tags: ["Sports", "Body Comp"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-c2680653-6b41-4777-838d-d488acc3d092.png" },
  { name: "郭環棻 H.F. Kuo", role: "Hormone Health Specialist", quote: "I help women navigate hormonal challenges through nutrition science. My approach combines functional medicine with practical meal planning.", tags: ["PCOS", "Hormones"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-09404677-f5d5-4095-9124-9fd0bc5c152c.png" },
];

const FAQS = [
  { q: "How long is each consultation session?", a: "Each 1-on-1 consultation is approximately 30 minutes, conducted online via video call. You will receive a full hormone type assessment and personalized dietary guidance during the session." },
  { q: "What do I need to prepare before my session?", a: "Please have your self-measured body data ready: height, weight, and body fat percentage (if available). Having a recent record of your eating habits and any health concerns will help your nutritionist make the most of your time together." },
  { q: "What payment methods are accepted?", a: "We accept credit card and Apple Pay for international program participants. Installment payments are not available at this time." },
  { q: "Can I reschedule my appointment?", a: "Yes. Consultations must be booked at least 48 hours in advance. Rescheduling within 72 hours of your appointment incurs a USD $20 rescheduling fee. If you are more than 10 minutes late, the session will be marked as used." },
  { q: "What is the refund policy?", a: "Unused sessions can be refunded within 6 months from purchase. Sessions expire after 6 months if unused. For the Flex8 program: full refund before start; within 3 days of start = 100%; 4–7 days = 60%; after 8 days = no refund." },
  { q: "Who is not eligible for this program?", a: "This program is not suitable for pregnant women, individuals with a history of stroke, kidney disease, major cardiovascular disease, or cancer patients undergoing treatment. Those over 65 or under 18, or with a BMI under 18.5, should start with a 1-on-1 assessment first." },
  { q: "Are the nutritionists certified?", a: "All Cofit nutritionists are nationally certified professionals with valid licenses. Each goes through rigorous credential verification and an in-depth interview before joining the platform." },
];

const PACKAGES = [
  {
    name: "Flex8 Slim Program",
    badge: null,
    originalPrice: "$950",
    price: "$649",
    currency: "USD",
    sessions: 2,
    features: [
      "2 × 30-min video consultations",
      "Hormone type assessment",
      "Customized Flexi-Carb meal plan",
      "Daily nutritionist support (9AM–11PM TWN)",
      "Weekend diet analysis every Monday",
      "Online materials in English & Chinese",
    ],
    cta: "Get Started",
    ctaUrl: "https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3",
    accent: false,
  },
  {
    name: "Flex8 Slim Premium",
    badge: "Most Popular",
    originalPrice: "$1,100",
    price: "$729",
    currency: "USD",
    sessions: 3,
    features: [
      "3 × 30-min video consultations",
      "Hormone type assessment",
      "Customized Flexi-Carb meal plan",
      "Daily nutritionist support (9AM–11PM TWN)",
      "Weekend diet analysis every Monday",
      "Online materials in English & Chinese",
      "Priority scheduling",
    ],
    cta: "Get Premium",
    ctaUrl: "https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3",
    accent: true,
  },
];

export default function ConsultationPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const expertRef = useRef(null);
  const scroll = (ref, dir) => { if (ref.current) ref.current.scrollBy({ left: dir * 400, behavior: 'smooth' }); };

  return (
    <div className={styles.pageContainer}>

      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <Link href="/flex8" className={styles.navLogo}>
          <span style={{ color: '#00C300', fontWeight: 900 }}>cofit</span>{' '}
          <span className={styles.navLogoSpan}>Flex8</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#packages" className={styles.navLink}>Pricing</a>
          <a href="#nutritionists" className={styles.navLink}>Nutritionists</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
          <Link href="/partners" className={styles.navLink}>Partners</Link>
        </div>
        <div className={styles.navActions}>
          <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.btnGetStarted}>Book Now</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <span className={styles.sectionLabel}>1-on-1 Consultation</span>
        <h1 className={styles.heroTitle}>
          Your personal{' '}
          <span className={styles.heroTitleAccent}>nutritionist</span>,<br />
          one session away
        </h1>
        <p className={styles.heroSubtitle}>
          A 30-minute video consultation with a board-certified dietitian. Get your hormone type assessed and a personalized Flexi-Carb plan built around your life.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.btnGetStarted} style={{ padding: '16px 40px', fontSize: '1.0625rem' }}>
            Book a Consultation
          </a>
          <a href="#packages" className={styles.btnLogin} style={{ padding: '16px 32px', fontSize: '1.0625rem', border: '1px solid #EEEDEB' }}>
            View Packages →
          </a>
        </div>
        <div className={styles.tagScroller} style={{ marginTop: 40 }}>
          {["Weight Loss", "PCOS", "Gut Health", "Diabetes", "Hormones", "Sports Nutrition", "Pregnancy"].map((t, i) => (
            <span key={i} className={styles.tag}>{t}</span>
          ))}
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>40,000+</div>
          <div className={styles.statLabel}>Clients Served</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>93%</div>
          <div className={styles.statLabel}>Satisfaction Rate</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statStars}>★★★★★</div>
          <div className={styles.statNumber} style={{ fontSize: '1.5rem' }}>4.8</div>
          <div className={styles.statLabel}>App Store · 1M+ Downloads</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>Board-Certified Dietitians</div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <section className={styles.careSection} id="how-it-works">
        <div className={styles.careInner}>
          <div className={styles.careContent}>
            <span className={styles.sectionLabel}>How It Works</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>From booking to results in 3 steps</h2>
            <p style={{ color: '#52504C', marginBottom: 12 }}>Book your first session in under 3 minutes.</p>
            <div className={styles.stepList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepTextBlock}>
                  <h4>Choose Your Package</h4>
                  <p>Select the Standard (2 sessions) or Premium (3 sessions) plan. Pay securely by credit card or Apple Pay — available worldwide.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepTextBlock}>
                  <h4>Book Your Video Call</h4>
                  <p>Schedule your 30-minute consultation at least 48 hours in advance. Nutritionists are available 9 AM – 11 PM (Taiwan Time). Bring your height, weight, and body fat data.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepTextBlock}>
                  <h4>Get Your Personalized Plan</h4>
                  <p>Your nutritionist assesses your hormone type and builds a custom Flexi-Carb plan. Ongoing daily support and weekly diet adjustments are included.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.careImage}>
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=1000" alt="Nutritionist consultation" />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '100px 24px', background: '#FCFCFA' }} id="packages">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Pricing</span>
          <h2 className={styles.sectionTitle}>Choose your plan</h2>
          <p className={styles.sectionDesc}>All plans include personalized meal planning, daily support, and access to our full learning library.</p>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {PACKAGES.map((pkg, i) => (
            <div key={i} style={{
              flex: '1 1 360px', maxWidth: 420,
              background: pkg.accent ? '#004F51' : '#fff',
              color: pkg.accent ? '#fff' : '#24221F',
              borderRadius: 24, padding: '40px 36px',
              border: pkg.accent ? 'none' : '1px solid #EEEDEB',
              boxShadow: pkg.accent ? '0 20px 60px rgba(0,79,81,0.25)' : '0 4px 24px rgba(0,0,0,0.04)',
              position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              {pkg.badge && (
                <span style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: '#00C300', color: '#fff', padding: '4px 18px',
                  borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  {pkg.badge}
                </span>
              )}
              <p style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 8 }}>{pkg.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{pkg.price}</span>
                <span style={{ fontSize: '1rem', opacity: 0.6 }}>{pkg.currency}</span>
              </div>
              <p style={{ fontSize: '0.875rem', opacity: 0.5, textDecoration: 'line-through', marginBottom: 28 }}>
                Was {pkg.originalPrice}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {pkg.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9375rem', opacity: 0.9 }}>
                    <span style={{ color: pkg.accent ? '#00C300' : '#004F51', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={pkg.ctaUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', textAlign: 'center', padding: '14px 24px',
                borderRadius: 9999, fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
                background: pkg.accent ? '#fff' : '#004F51',
                color: pkg.accent ? '#004F51' : '#fff',
                transition: 'all 0.2s', marginTop: 'auto',
              }}>
                {pkg.cta} →
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, color: '#8A8884', fontSize: '0.875rem' }}>
          Full refund available if cancelled before the program starts. <a href="#faq" style={{ color: '#004F51' }}>See refund policy →</a>
        </p>
      </section>

      {/* ── Expert Carousel ── */}
      <section className={styles.carouselSection} id="nutritionists">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Your Nutritionists</span>
          <h2 className={styles.sectionTitle}>Meet the experts behind your plan</h2>
          <p className={styles.sectionDesc}>Every Cofit nutritionist is nationally certified, clinically experienced, and personally vetted.</p>
        </div>
        <div className={styles.carouselWrap}>
          <button className={`${styles.carouselNav} ${styles.carouselNavLeft}`} onClick={() => scroll(expertRef, -1)}>←</button>
          <div className={styles.carouselTrack} ref={expertRef}>
            {EXPERTS.map((expert, i) => (
              <div key={i} className={styles.expertCard}>
                <div className={styles.expertImageWrap}>
                  <img src={expert.img} alt={expert.name} />
                </div>
                <div className={styles.expertBody}>
                  <p className={styles.expertName}>{expert.name}</p>
                  <p className={styles.expertRole}>{expert.role}</p>
                  <p className={styles.expertQuote}>{expert.quote}</p>
                  <div className={styles.expertTags}>
                    {expert.tags.map((tag, j) => (
                      <span key={j} className={styles.expertTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={`${styles.carouselNav} ${styles.carouselNavRight}`} onClick={() => scroll(expertRef, 1)}>→</button>
        </div>
      </section>

      {/* ── Session Details ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What to Expect</span>
            <h2 className={styles.sectionTitle}>Your 30-minute session</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { Icon: Video, title: 'Video or Phone', desc: 'Conducted online via video call or phone. Available worldwide, no travel needed.' },
              { Icon: Dna, title: 'Hormone Type Assessment', desc: 'Your nutritionist identifies your fat-gain pattern from 6 clinical hormone types.' },
              { Icon: Salad, title: 'Customized Meal Plan', desc: 'A personalized Flexi-Carb plan tailored to your lifestyle, culture, and food preferences.' },
              { Icon: MessageCircle, title: 'Daily Support Included', desc: 'Message your nutritionist from 9 AM to 11 PM (Taiwan Time) for ongoing guidance.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#FCFCFA', borderRadius: 20, padding: '32px 28px',
                border: '1px solid #EEEDEB', display: 'flex', flexDirection: 'column', gap: 16,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}>
                <div style={{ background: '#E6F2F2', color: '#004F51', width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><item.Icon size={26} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{item.title}</h3>
                <p style={{ color: '#52504C', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.faqInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Support</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`${styles.accordionIcon} ${openFaq === i ? styles.accordionIconOpen : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className={styles.accordionContent}><p>{faq.a}</p></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner} id="book">
        <h2 className={styles.ctaTitle}>Ready to meet your nutritionist?</h2>
        <p style={{ color: '#52504C', fontSize: '1.125rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Book your first 30-minute session today. Full refund available before your program starts.
        </p>
        <a href="https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
          Book a Consultation Now
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}><span style={{ color: '#00C300' }}>cofit</span> Flex<span className={styles.footerLogoAccent}>8</span></span>
              <p className={styles.footerBrandDesc}>
                Connecting clients with registered dietitians to make personalized nutrition care easy to access and affordable. Powered by Cofit Healthcare.
              </p>
              <div className={styles.footerSocials}>
                <a href="https://www.instagram.com/hicofit" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><Instagram size={16} strokeWidth={1.75} /></a>
                <a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><Facebook size={16} strokeWidth={1.75} /></a>
                <a href="https://www.youtube.com/@Cofit211" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><Youtube size={16} strokeWidth={1.75} /></a>
              </div>
            </div>
            <div className={styles.footerColumn}>
              <h5>Consultation</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#packages">Pricing</a></li>
                <li><a href="#nutritionists">Our Nutritionists</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h5>Company</h5>
              <ul className={styles.footerLinks}>
                <li><Link href="/flex8">Flex8 Program</Link></li>
                <li><a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer">Contact via Facebook</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h5>Legal</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Refund Policy</a></li>
                <li><a href="#">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div>© 2026 Cofit Healthcare Inc. All Rights Reserved.</div>
            <div className={styles.footerBottomLinks}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
