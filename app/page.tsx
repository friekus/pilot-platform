"use client";
import { useEffect, useRef, useState } from "react";

/* ── Fade-in on scroll ── */
function Fade({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (<div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s` }}>{children}</div>);
}

/* ── Email capture form ── */
function EmailForm({ id, dark = false }: { id: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!email.includes("@")) return; setDone(true); };
  if (done) return (<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 10, background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)", color: "#00D4AA", fontWeight: 500, fontSize: 15 }}>✓ You&apos;re on the list. We&apos;ll be in touch before launch.</div>);
  return (<form onSubmit={submit} className="email-form"><input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} style={{ flex: "1 1 240px", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #1E3352", background: dark ? "rgba(255,255,255,0.1)" : "#162A42", color: "#F0F4F8", fontSize: 15, fontFamily: "'DM Sans',sans-serif", outline: "none", minWidth: 0 }} /><button type="submit" className="email-btn">Get early access</button></form>);
}

/* ── Logo SVG ── */
function Logo({ size = 40 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

/* ── Feature card ── */
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (<Fade><div className="feature-card" style={{ background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,212,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div><h3 style={{ fontSize: 17, fontWeight: 600, color: "#FFF", lineHeight: 1.3, margin: 0, fontFamily: "'Space Grotesk',sans-serif" }}>{title}</h3><p style={{ fontSize: 14.5, color: "#8899AA", lineHeight: 1.7, margin: 0 }}>{desc}</p></div></Fade>);
}

/* ── Compare row ── */
function CRow({ f, o }: { f: string; o: "n" | "~" }) {
  return (<div className="compare-row"><span style={{ color: "#C0CDD8", fontWeight: 500 }}>{f}</span><span style={{ textAlign: "center", color: "#00D4AA", fontWeight: 700, fontSize: 17 }}>✓</span><span style={{ textAlign: "center", color: o === "~" ? "#8899AA" : "#4A5568", fontSize: 17 }}>{o === "~" ? "~" : "✗"}</span></div>);
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function Home() {
  return (<>
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
    <div className="page-root">

      {/* NAV */}
      <nav className="nav-bar">
        <div className="container nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={40} />
            <span className="logo-text">Vectored</span>
          </div>
          <div className="nav-badge">Coming soon</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/img-hero.jpg" alt="Light aircraft on runway" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
          <div className="hero-overlay" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-content">
            <Fade><div className="pill">Australian student pilot platform — launching 2026</div></Fade>
            <Fade delay={0.1}><h1 className="hero-h1">Get vectored to your<br /><span style={{ color: "#00D4AA" }}>flying career</span></h1></Fade>
            <Fade delay={0.2}><p className="hero-p">The study platform built for Australian student pilots. Adaptive practice exams from your RPL all the way through to the 7 CPL subjects and IREX, progress tracking that finds your weak areas, and a career hub to help you network and land your first job.</p></Fade>
            <Fade delay={0.3}><EmailForm id="hero" /></Fade>
            <Fade delay={0.35}><p style={{ fontSize: 13, color: "#4A5568", marginTop: 14 }}>Join the waitlist — no spam, just launch updates.</p></Fade>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container section-pad">
        <Fade><div className="stats-grid">
          {[["350+", "Practice questions"], ["7", "CASA subjects + IREX"], ["50+", "Charter operators"], ["RPL→IREX", "Licence levels"]].map(([v, l], i) => (<div key={i} style={{ textAlign: "center" }}><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>))}
        </div></Fade>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="container section-pad">
        <Fade><div className="problem-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <div className="tag-coral">The problem</div>
              <h2 className="section-h2">38% of student pilots fail their first CASA exam</h2>
              <p className="section-p">That&apos;s a $217 resit fee, weeks of lost momentum, and a serious knock to your confidence. Existing study tools are outdated textbooks or random question banks with no way to track what you actually need to work on.</p>
            </div>
            <div>
              <div className="tag-teal">The solution</div>
              <h2 className="section-h2">A platform that knows what you don&apos;t know</h2>
              <p className="section-p">Vectored tracks every question you answer. It finds your weak subjects, targets your gaps, and focuses your study time where it matters most. Plus a career hub showing you exactly which operators hire low-hour pilots and how to reach them.</p>
            </div>
          </div>
          <div className="problem-img">
            <img src="/img-cockpit.jpg" alt="Student pilot and instructor in cockpit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div></Fade>
      </section>

      {/* FEATURES */}
      <section className="container section-pad">
        <Fade><div style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="tag-teal" style={{ marginBottom: 12 }}>Features</div>
          <h2 className="features-h2">Everything you need to pass and get hired</h2>
        </div></Fade>
        <div className="features-grid">
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={4} /><circle cx={12} cy={12} r={1} /></svg>} title="Adaptive practice exams" desc="Hundreds of questions covering your RPL exam through all 7 CPL subjects and the IREX. The system identifies your weak areas and serves more questions on the topics you're struggling with." />
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>} title="Progress analytics" desc="See exactly where you stand in each subject. Track improvement over time. Know when you're ready to sit the real exam — not guess." />
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><rect x={3} y={3} width={18} height={18} rx={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} /></svg>} title="Visual explanations" desc="Every question comes with a detailed explanation and educational diagrams — aerofoils, circuit patterns, weather systems — concepts you can see, not just read." />
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>} title="Operator database" desc="50+ Australian charter operators mapped across every state. Fleet types, minimum hours, contact details — find the operators who hire fresh CPL holders." />
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>} title="Interactive career map" desc="See where the jobs are on an interactive map of Australia. Click any operator to see their fleet, base, and key contacts — helping you network and get your foot in the door." />
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>} title="Built by a student pilot" desc="Vectored is built by someone going through it right now — not a corporation. Every feature exists because a real student pilot needed it." />
        </div>
      </section>

      {/* IMAGE BREAK */}
      <section className="container section-pad">
        <Fade><div className="quote-break">
          <img src="/img-outback.jpg" alt="Pilot on approach to a regional airstrip" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} />
          <div className="quote-grad" />
          <div className="quote-overlay" />
          <div className="quote-text">
            &ldquo;I spent hours reading the same textbook pages and still couldn&apos;t get the concepts to stick. I needed something that showed me exactly where my gaps were — not just more practice questions.&rdquo;
            <span className="quote-attr">— The frustration every student pilot knows</span>
          </div>
        </div></Fade>
      </section>

      {/* COMPARE */}
      <section className="compare-section">
        <Fade><h2 className="compare-h2">How Vectored compares</h2></Fade>
        <Fade delay={0.1}><div className="compare-table">
          <div className="compare-header"><span></span><span style={{ textAlign: "center", color: "#00D4AA" }}>Vectored</span><span style={{ textAlign: "center" }}>Others</span></div>
          <CRow f="Adaptive weak-area targeting" o="n" />
          <CRow f="All 7 CASA subjects + IREX" o="~" />
          <CRow f="Detailed explanations" o="~" />
          <CRow f="Progress analytics dashboard" o="n" />
          <CRow f="Visual diagrams & illustrations" o="n" />
          <CRow f="Career / operator database" o="n" />
          <CRow f="Interactive job map" o="n" />
          <CRow f="Mobile-first design" o="n" />
          <CRow f="Built for Australian students" o="~" />
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#4A5568" }}>✓ Yes &nbsp;&nbsp; ~ Partial &nbsp;&nbsp; ✗ No</div>
        </Fade>
      </section>

      {/* BOTTOM CTA */}
      <section className="cta-section">
        <Fade><div className="cta-box">
          <div className="cta-glow" />
          <h2 className="cta-h2">Ready to get vectored?</h2>
          <p className="cta-p">Join the waitlist for early access. Be the first to study smarter when we launch.</p>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}><EmailForm id="bottom" dark /></div>
        </div></Fade>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Logo size={28} /><span style={{ fontSize: 15, fontWeight: 600, color: "#8899AA", fontFamily: "'Space Grotesk',sans-serif" }}>Vectored</span></div>
          <div style={{ fontSize: 12, color: "#4A5568" }}>© 2026 Vectored. Built in Australia for Australian pilots.</div>
          <div style={{ display: "flex", gap: 16 }}>{[["Instagram", "https://instagram.com/vectoredau"], ["Facebook", "https://facebook.com/vectoredau"], ["TikTok", "https://tiktok.com/@vectoredau"]].map(([n, u]) => (<a key={n} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#8899AA", textDecoration: "none" }}>{n}</a>))}</div>
        </div>
      </footer>
    </div>
  </>);
}
