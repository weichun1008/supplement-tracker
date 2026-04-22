"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const COFIT_LOGO = 'https://image.fevercdn.com/?bucket=picture-original.fevercdn.com&filepath=feversocial%2F35653%2F37772%2Fb705f7547aa16424ed6ddebc.png';

/* ========================================
   Data
   ======================================== */
const EXPERTS = [
  { name: "張宜婷 Y.T. Chang", role: "Chief Dietitian · CTSSN Certified", quote: "With hundreds of lectures and online course development experience, I bring evidence-based nutrition science to help you achieve lasting, measurable results.", tags: ["Weight Loss", "PCOS", "Diabetes"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-8048654a-87ef-4f39-ab39-aae80ed29fae.png" },
  { name: "方晴誼 C.Y. Fang", role: "Head Nutritionist · Obesity Prevention", quote: "As former head nutritionist at Wanfang Hospital's obesity center, I focus on sustainable, lifelong approaches to weight and metabolic health.", tags: ["Gut Health", "Obesity"], img: "https://picture-original.fevercdn.com/page-feversocial-202313-d98bc86d-38d0-445f-ae61-33178a4fe07b.png" },
  { name: "張益堯 Y.Y. Chang", role: "Family Health Consultant · 20yr Exp.", quote: "Certified olive oil sommelier and co-author of 'Eat for a Healthy Brain'. 20 years of metabolic health and weight management expertise.", tags: ["Metabolic", "Family"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-a0a1737a-a367-4348-a899-0bed3a07a145.png" },
  { name: "蓡宗真 C.C. Tsai", role: "Clinical Nutritionist", quote: "I specialize in creating personalized nutrition plans backed by clinical data, helping clients find the right balance for their unique body type.", tags: ["Clinical", "Weight Loss"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-75d8445a-46b5-4588-a5dc-9aedac6bcdb0.png" },
  { name: "黃靖淳 J.C. Huang", role: "Sports Dietitian", quote: "With deep expertise in sports nutrition and body composition, I help clients optimize their performance while achieving sustainable fat loss.", tags: ["Sports", "Body Comp"], img: "https://picture-original.fevercdn.com/page-feversocial-202381-c2680653-6b41-4777-838d-d488acc3d092.png" },
  { name: "郭環棻 H.F. Kuo", role: "Hormone Health Specialist", quote: "I help women navigate hormonal challenges through nutrition science. My approach combines functional medicine with practical meal planning.", tags: ["PCOS", "Hormones"], img: "https://picture-original.fevercdn.com/page-feversocial-2023927-09404677-f5d5-4095-9124-9fd0bc5c152c.png" },
];

const HORMONES = [
  { icon: "🧬", title: "Insulin Resistance", desc: "Difficulty processing carbohydrates, leading to belly fat storage and afternoon energy crashes. The most common type.", tips: ["Lower glycemic index carbs", "Time meals to activity levels", "Increase fiber intake"] },
  { icon: "⚡", title: "Cortisol Dominance", desc: "High stress levels signal your body to hold onto fat, especially around the midsection. Linked to poor sleep quality.", tips: ["Stress management techniques", "Sleep hygiene optimization", "Adaptogenic foods"] },
  { icon: "🦋", title: "Thyroid Imbalance", desc: "A sluggish thyroid slows your metabolism, making weight loss extremely difficult even when eating less.", tips: ["Selenium & iodine-rich foods", "Anti-inflammatory diet", "Regular metabolism check-ins"] },
  { icon: "🌙", title: "Estrogen Dominance", desc: "Often linked to PCOS, causing stubborn fat storage around the hips and thighs, along with mood swings.", tips: ["Cruciferous vegetables daily", "Reduce xenoestrogen exposure", "Balanced omega-3 intake"] },
  { icon: "🔥", title: "Leptin Resistance", desc: "Your brain doesn't receive the 'fullness' signal, leading to constant hunger and overeating despite sufficient intake.", tips: ["Protein-first meals", "Eliminate processed sugars", "Consistent meal timing"] },
  { icon: "🦠", title: "Gut Dysbiosis", desc: "Imbalanced gut bacteria disrupt digestion, nutrient absorption, and even your mood through the gut-brain axis.", tips: ["Probiotic-rich fermented foods", "Prebiotic fiber diversity", "Reduce artificial sweeteners"] }
];

const HELP_ITEMS = [
  { title: "Sustainable Weight Loss", desc: "Evidence-based strategies beyond calorie counting.", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600&h=400" },
  { title: "Hormone Balance", desc: "PCOS, thyroid, estrogen & cortisol management.", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600&h=400" },
  { title: "Heart & Metabolic Health", desc: "Manage cholesterol, blood pressure & diabetes.", img: "https://images.unsplash.com/photo-1505576399279-0d754687a2d8?auto=format&fit=crop&q=80&w=600&h=400" },
  { title: "Gut Health & Digestion", desc: "IBS, bloating, food sensitivities & microbiome.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600&h=400" },
  { title: "Sports Performance", desc: "Optimize fuel for training, recovery & competition.", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600&h=400" },
  { title: "Pregnancy & Postpartum", desc: "Nutritional support for every stage of motherhood.", img: "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=600&h=400" }
];

const BLOGS = [
  {
    tag: "Weight Loss",
    title: "Not losing weight on tirzepatide? Here's what to do about it",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    tag: "Announcement",
    title: "Flex8 Raises $50M Series B to Bring Total Funding to $75M",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    tag: "Meal Plan",
    title: "21-day anti-inflammatory diet: Meal plans for 3 weeks!",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600&h=400"
  }
];

const FAQS = [
  {
    q: "What is the Flex8 Slim Program?",
    a: "Flex8 is an 8-week personalized nutrition program that pairs you with a board-certified dietitian. Using our proprietary hormone-type assessment, we create a customized Flexi-Carb plan tailored to your unique metabolism. The program includes daily support and regular 1-on-1 consultations."
  },
  {
    q: "How does the hormone type assessment work?",
    a: "After clinical research conducted by our top-notch nutrition team, six major types for fat gain have been identified. During your initial consultation, your dietitian will analyze your health history, symptoms, and lifestyle to determine your primary hormone type and create a targeted plan."
  },
  {
    q: "Who is this program for?",
    a: "This program is designed for sub-healthy adults seeking sustainable change. Note: Pregnant women, individuals with a history of stroke, kidney disease, major cardiovascular diseases, cancer patients undergoing treatment, or those deemed unfit by a physician cannot participate. If you are over 65, under 18, or have a BMI less than 18.5, we recommend starting with a 1-on-1 assessment first."
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "You can get a full refund if you cancel before the program starts. Once it begins: within 3 days = 100% refund; within 4-7 days = 60% refund; after 8 days = no refund. If consultations have already been conducted, USD $65 per session will be deducted."
  },
  {
    q: "How do consultations work?",
    a: "Consultations are conducted via video or phone. They must be booked at least 48 hours in advance. Nutritionists are available online from 9:00 AM to 11:00 PM (Taiwan Time). If you are more than 10 minutes late, the session will be canceled and must be rescheduled."
  },
  {
    q: "Is this available in my location?",
    a: "The Flex8 program is an online service available worldwide. We also have in-person services launching in Hong Kong (Room C, 21/F, World Trust Tower, 50 Stanley Street, Central). All program materials, instructional videos, and group discussions are available in English and Chinese."
  }
];

/* ========================================
   Media & Research
   ======================================== */
const MEDIA = ["YAHOO!", "TVBS", "EBC東森", "Manager Today", "CommonHealth", "NOWnews", "Liberty Times"];

const RESEARCH = [
  { journal: "Nutrients (MDPI)", title: "Digital Nutrition Tracking App Enhances 211 Diet Weight Loss Under Dietitian Guidance: An 8-Week Retrospective Study in Taiwan", year: "2023", link: "https://www.mdpi.com/2877598", impact: "Participants lost an average of 8% body weight" },
  { journal: "PubMed", title: "Image-Based Dietary Assessment Tool for Adolescents: A Technology-Based Pilot Study", year: "2019", link: "https://pubmed.ncbi.nlm.nih.gov/31635141/", impact: "Validated AI-powered food recognition" },
  { journal: "PubMed", title: "High-Protein Diet with Exercise: Effect on Appetite and Muscle Function in Middle-Aged Obesity", year: "2023", link: "https://pubmed.ncbi.nlm.nih.gov/37935299/", impact: "Improved body composition outcomes" },
];

/* ========================================
   Component
   ======================================== */
export default function Flex8Page() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeHormone, setActiveHormone] = useState(0);
  const expertRef = useRef(null);
  const resultRef = useRef(null);
  const scroll = (ref, dir) => { if(ref.current) ref.current.scrollBy({ left: dir * 400, behavior: 'smooth' }); };

  return (
    <div className={styles.pageContainer}>

      {/* ── 1. Floating Navigation ── */}
      <nav className={styles.navbar}>
        <Link href="/flex8" className={styles.navLogo}>
          <span style={{color:'#00C300', fontWeight:900}}>cofit</span> <span className={styles.navLogoSpan}>Flex8</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#program" className={styles.navLink}>Program</a>
          <a href="#experts" className={styles.navLink}>Nutritionists</a>
          <a href="#results" className={styles.navLink}>Results</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.btnLogin}>Log in</Link>
          <a href="#join" className={styles.btnGetStarted}>Get started</a>
        </div>
      </nav>

      {/* ── 2. Hero Section ── */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Find board-certified dietitians for your{' '}
          <span className={styles.heroTitleAccent}>Flexi-Carb</span> journey
        </h1>
        <p className={styles.heroSubtitle}>
          Our network of expert nutritionists brings empathy and clinical expertise across weight management, hormone health, gut health, and more.
        </p>

        {/* Search Widget */}
        <div className={styles.searchWidget}>
          <div className={styles.searchField}>
            <span className={styles.searchFieldIcon}>📍</span>
            <span className={styles.searchFieldText}>City or region</span>
          </div>
          <div className={styles.searchDivider}></div>
          <div className={styles.searchField}>
            <span className={styles.searchFieldIcon}>🎯</span>
            <span className={styles.searchFieldText}>Specialties</span>
          </div>
          <div className={styles.searchDivider}></div>
          <button className={styles.searchBtn}>
            <span>🔍</span> Find a dietitian
          </button>
        </div>

        {/* Tag Scroller */}
        <div className={styles.tagScroller}>
          {["Weight Loss", "Diabetes", "High Cholesterol", "High Blood Pressure", "PCOS", "Gut Health", "Sports Nutrition"].map((t, i) => (
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
          <div className={styles.statNumber} style={{fontSize:'1.5rem'}}>4.8</div>
          <div className={styles.statLabel}>App Store · 1M+ Downloads</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>Board-Certified Dietitians</div>
        </div>
      </div>

      {/* ── Media Trust Bar ── */}
      <div style={{maxWidth:1100, margin:'32px auto 0', padding:'0 24px', textAlign:'center'}}>
        <p style={{color:'#8A8884', fontSize:'0.8125rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20}}>As featured in</p>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:40, flexWrap:'wrap', opacity:0.4}}>
          {MEDIA.map((m, i) => (
            <span key={i} style={{fontSize:'1.25rem', fontWeight:800, color:'#24221F', letterSpacing:'-0.01em'}}>{m}</span>
          ))}
        </div>
      </div>

      {/* ── 3. Expert Carousel ── */}
      <section className={styles.carouselSection} id="experts">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Our Experts</span>
          <h2 className={styles.sectionTitle}>Registered dietitians, ready to support you</h2>
          <p className={styles.sectionDesc}>
            Each dietitian goes through rigorous vetting, including credential verification and an in-depth interview.
          </p>
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

      {/* ── 4. Real People, Real Results ── */}
      <section className={styles.resultsSection} id="results">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Testimonials</span>
          <h2 className={styles.sectionTitle}>Real people, real results</h2>
          <p className={styles.sectionDesc}>Sessions, meals, and outcomes from Flex8 members</p>
        </div>
        <div className={styles.resultsGrid}>
          <div className={styles.resultCard}>
            <div className={styles.resultImageWrap}>
              <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600&h=500" alt="Healthy meal prep" />
              <span className={styles.resultBadge}>-5kg in 8 weeks</span>
            </div>
            <div className={styles.resultContent}>
              <div className={styles.resultStars}>★★★★★</div>
              <p className={styles.resultText}>"I finally understand why I couldn't lose weight. My nutritionist identified my cortisol issues and we adjusted my macros. Down 5kg in 8 weeks without feeling hungry!"</p>
              <div className={styles.resultMeta}>
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80" alt="Amanda" className={styles.resultAvatarSmall} />
                <div>
                  <p className={styles.resultAuthor}>Amanda C.</p>
                  <p className={styles.resultLocation}>Singapore</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.resultCard}>
            <div className={styles.resultImageWrap}>
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600&h=500" alt="Fresh cooking" />
              <span className={styles.resultBadge}>Food Freedom</span>
            </div>
            <div className={styles.resultContent}>
              <div className={styles.resultStars}>★★★★★</div>
              <p className={styles.resultText}>"The Flex8 program completely changed my relationship with food. No more guilt. The 1-on-1 support is unparalleled. I actually enjoy eating again."</p>
              <div className={styles.resultMeta}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" alt="Jason" className={styles.resultAvatarSmall} />
                <div>
                  <p className={styles.resultAuthor}>Jason L.</p>
                  <p className={styles.resultLocation}>Hong Kong</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.resultCard}>
            <div className={styles.resultImageWrap}>
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600&h=500" alt="Wellness lifestyle" />
              <span className={styles.resultBadge}>PCOS Managed</span>
            </div>
            <div className={styles.resultContent}>
              <div className={styles.resultStars}>★★★★★</div>
              <p className={styles.resultText}>"Managing my PCOS used to be a nightmare. This program taught me how to eat for my hormones. More energy, better sleep, and my skin cleared up!"</p>
              <div className={styles.resultMeta}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" alt="Michelle" className={styles.resultAvatarSmall} />
                <div>
                  <p className={styles.resultAuthor}>Michelle T.</p>
                  <p className={styles.resultLocation}>Los Angeles, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. What Can We Help You With ── */}
      <section className={styles.helpSection} id="program">
        <div className={styles.helpInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Specialties</span>
            <h2 className={styles.sectionTitle}>What can we help you with today?</h2>
          </div>
          <div className={styles.helpGrid}>
            {HELP_ITEMS.map((item, i) => (
              <div key={i} className={styles.helpCard}>
                <img src={item.img} alt={item.title} className={styles.helpCardBg} />
                <div className={styles.helpCardOverlay}></div>
                <div className={styles.helpCardContent}>
                  <h3 className={styles.helpCardTitle}>{item.title}</h3>
                  <p className={styles.helpCardDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. The Six Hormone Types (Interactive Tabs) ── */}
      <section className={styles.hormoneSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>The Science</span>
          <h2 className={styles.sectionTitle}>The Six Hormone Types for Fat Gain</h2>
          <p className={styles.sectionDesc}>Weight gain is not only caused by wrong diets. Our clinical research has identified six root causes.</p>
        </div>
        <div className={styles.hormoneTabs}>
          {HORMONES.map((h, i) => (
            <button key={i} className={`${styles.hormoneTab} ${activeHormone === i ? styles.hormoneTabActive : ''}`} onClick={() => setActiveHormone(i)}>
              {h.icon} {h.title}
            </button>
          ))}
        </div>
        <div className={styles.hormoneDetail}>
          <div className={styles.hormoneDetailIcon}>{HORMONES[activeHormone].icon}</div>
          <div className={styles.hormoneDetailContent}>
            <h3 className={styles.hormoneDetailTitle}>{HORMONES[activeHormone].title}</h3>
            <p className={styles.hormoneDetailDesc}>{HORMONES[activeHormone].desc}</p>
            <ul className={styles.hormoneDetailTips}>
              {HORMONES[activeHormone].tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Research & Evidence ── */}
      <section style={{padding:'80px 24px', maxWidth:1000, margin:'0 auto'}}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Clinical Evidence</span>
          <h2 className={styles.sectionTitle}>Published in peer-reviewed journals</h2>
          <p className={styles.sectionDesc}>Our methods are backed by rigorous academic research, not just marketing claims.</p>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {RESEARCH.map((r, i) => (
            <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" style={{
              display:'flex', gap:24, padding:'24px 28px', background:'white', borderRadius:16,
              border:'1px solid #EEEDEB', textDecoration:'none', color:'inherit',
              transition:'all 0.3s', alignItems:'center'
            }}>
              <div style={{flexShrink:0, width:56, height:56, background:'#E6F2F2', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem'}}>
                📄
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.75rem', fontWeight:700, color:'#004F51', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4}}>{r.journal} · {r.year}</div>
                <div style={{fontSize:'1rem', fontWeight:600, lineHeight:1.4, marginBottom:6}}>{r.title}</div>
                <div style={{fontSize:'0.8125rem', color:'#8A8884'}}>Key finding: {r.impact}</div>
              </div>
              <span style={{fontSize:'1.25rem', color:'#004F51', flexShrink:0}}>→</span>
            </a>
          ))}
        </div>
      </section>
      <section className={styles.careSection}>
        <div className={styles.careInner}>
          <div className={styles.careContent}>
            <span className={styles.sectionLabel}>How It Works</span>
            <h2 className={styles.sectionTitle} style={{textAlign: 'left'}}>Care that starts today</h2>
            <p style={{color: '#52504C', marginBottom: 12}}>Book an appointment in less than 3 minutes.</p>
            <div className={styles.stepList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepTextBlock}>
                  <h4>1-on-1 Consultation</h4>
                  <p>Begin with a comprehensive video or phone analysis by a certified nutritionist to understand your baseline and hormone type.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepTextBlock}>
                  <h4>Customized Flexi-Carb Plan</h4>
                  <p>Receive a tailored diet plan designed for your actual lifestyle, social events, and cultural food preferences.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepTextBlock}>
                  <h4>Daily Support & Adjustments</h4>
                  <p>Stay on track with online support from 9 AM to 11 PM. Weekend diet analyses and adjustments provided every Monday.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.careImage}>
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800&h=1000" alt="Healthy cooking" />
          </div>
        </div>
      </section>

      {/* ── 8. App Promo ── */}
      <div className={styles.appPromo}>
        <div className={styles.promoContent}>
          <h2 className={styles.promoTitle}>Improve nutrition, sleep, and movement — all in one app</h2>
          <p className={styles.promoDesc}>
            Download the Supplement Tracker app to log your meals, track your supplements, and message your nutritionist directly from your pocket.
          </p>
          <div className={styles.storeBtns}>
            <a href="#" className={styles.storeBtn}>
              <span className={styles.storeBtnIcon}>🍎</span> App Store
            </a>
            <a href="#" className={styles.storeBtn}>
              <span className={styles.storeBtnIcon}>▶️</span> Google Play
            </a>
          </div>
        </div>
        <div className={styles.promoPhone}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneScreen}>
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=800" alt="App screen" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 9. Blog Section ── */}
      <section className={styles.blogSection}>
        <div className={styles.blogInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>From Our Blog</span>
            <h2 className={styles.sectionTitle}>Check out our latest articles</h2>
          </div>
          <div className={styles.blogGrid}>
            {BLOGS.map((blog, i) => (
              <a key={i} href="#" className={styles.blogCard}>
                <img src={blog.img} alt={blog.title} className={styles.blogImage} />
                <div className={styles.blogContent}>
                  <span className={styles.blogTag}>{blog.tag}</span>
                  <h3 className={styles.blogTitle}>{blog.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
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
                <div className={styles.accordionContent}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. Final CTA ── */}
      <section className={styles.ctaBanner} id="join">
        <h2 className={styles.ctaTitle}>Ready to transform your health?</h2>
        <p style={{color: '#52504C', fontSize: '1.125rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px'}}>
          Take the first step today. REFUND is available within three days after the program is kicked off.
        </p>
        <a href="#" className={styles.ctaBtn}>Join the Program Now</a>
      </section>

      {/* ── 12. Mega Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}><span style={{color:'#00C300'}}>cofit</span> Flex<span className={styles.footerLogoAccent}>8</span></span>
              <p className={styles.footerBrandDesc}>
                Connecting clients with registered dietitians to make personalized nutrition care easy to access and affordable. Powered by Cofit Healthcare.
              </p>
              <div className={styles.footerSocials}>
                <a href="#" className={styles.socialIcon}>📸</a>
                <a href="#" className={styles.socialIcon}>💼</a>
                <a href="#" className={styles.socialIcon}>🎵</a>
                <a href="#" className={styles.socialIcon}>▶️</a>
              </div>
            </div>
            <div className={styles.footerColumn}>
              <h5>Program</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#">How it works</a></li>
                <li><a href="#">Hormone Types</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Success Stories</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h5>Company</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">For Dietitians</a></li>
                <li><a href="#">Partner with Us</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h5>Legal</h5>
              <ul className={styles.footerLinks}>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Refund Policy</a></li>
                <li><a href="#">Medical Disclaimer</a></li>
                <li><a href="#">Cookie Preferences</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div>© 2026 Cofit Healthcare Inc. All rights reserved.</div>
            <div className={styles.footerBottomLinks}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
