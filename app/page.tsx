"use client";
import { useState, useEffect, useRef } from "react";

const BRAND = {
  navy: "#0F2A44",
  navyLight: "#1B3A5C",
  teal: "#0F6E56",
  tealLight: "#1D9E75",
  tealPale: "#E1F5EE",
  coral: "#D85A30",
  coralPale: "#FAECE7",
  cream: "#FAF8F5",
  white: "#FFFFFF",
  dark: "#1A1A1A",
  gray: "#6B7280",
  grayLight: "#E5E7EB",
  bluePale: "#E6F1FB",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(15,42,68,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L6 14l8 11 8-11L14 3z" fill={BRAND.tealLight} opacity="0.9"/>
            <path d="M14 8l-4 6 4 5.5 4-5.5-4-6z" fill={BRAND.white} opacity="0.3"/>
          </svg>
          <span style={{
            fontSize: 20, fontWeight: 700,
            color: BRAND.white, letterSpacing: "-0.02em",
          }}>
            Pilot Platform
          </span>
        </div>
        <a href="#waitlist" style={{
          fontSize: 13, fontWeight: 600,
          color: BRAND.navy, background: BRAND.tealLight, padding: "8px 20px",
          borderRadius: 6, textDecoration: "none", letterSpacing: "0.01em",
        }}>
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [licence, setLicence] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)",
        borderRadius: 12, padding: "20px 28px", maxWidth: 460, margin: "0 auto",
      }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: BRAND.tealLight, margin: "0 0 4px" }}>
          You&apos;re on the list!
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          We&apos;ll let you know when we launch. Early supporters get 30% off.
        </p>
      </div>
    );
  }

  return (
    <div id="waitlist" style={{ maxWidth: 460, margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "flex", gap: 8, marginBottom: 10,
          background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 4,
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: BRAND.white, fontSize: 15, padding: "12px 14px",
            }}
          />
          <button type="submit" style={{
            background: BRAND.tealLight, color: BRAND.navy, border: "none",
            borderRadius: 7, padding: "12px 22px",
            fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Join waitlist
          </button>
        </div>
      </form>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        {["RPL student", "PPL student", "CPL student", "Instructor"].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLicence(licence === l ? "" : l)}
            style={{
              background: licence === l ? "rgba(29,158,117,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${licence === l ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16, padding: "5px 12px", cursor: "pointer",
              fontSize: 12, fontWeight: 500,
              color: licence === l ? BRAND.tealLight : "rgba(255,255,255,0.4)",
              transition: "all 0.2s",
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section style={{
      background: `linear-gradient(165deg, ${BRAND.navy} 0%, #0A1E33 60%, #081828 100%)`,
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "100px 24px 80px",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 600px 400px at 70% 30%, rgba(29,158,117,0.12) 0%, transparent 70%), radial-gradient(ellipse 400px 500px at 20% 70%, rgba(15,110,86,0.08) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", top: "15%", right: "8%", width: 320, height: 320,
        border: "1px solid rgba(29,158,117,0.1)", borderRadius: "50%", opacity: 0.4,
      }} />

      <div style={{ maxWidth: 720, textAlign: "center", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(29,158,117,0.12)", border: "1px solid rgba(29,158,117,0.25)",
            borderRadius: 20, padding: "6px 16px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.tealLight }} />
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: BRAND.tealLight, letterSpacing: "0.04em", textTransform: "uppercase" as const,
            }}>
              Coming soon — Australia
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 400, color: BRAND.white, lineHeight: 1.1, margin: "0 0 20px",
            letterSpacing: "-0.02em", fontFamily: "Georgia, serif",
          }}>
            From first lesson<br />
            <span style={{ color: BRAND.tealLight }}>to first job.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{
            fontSize: "clamp(16px, 2.2vw, 19px)",
            color: "rgba(255,255,255,0.6)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto 40px",
          }}>
            The modern study platform for Australian student pilots.
            Adaptive quizzes, progress tracking, and career tools —
            built by a pilot who knows the grind.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <WaitlistForm />
        </FadeIn>

        <FadeIn delay={0.45}>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
            {[
              { num: "7", label: "CASA subjects" },
              { num: "3", label: "Licence levels" },
              { num: "650+", label: "Launch questions" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.tealLight }}>{s.num}</div>
                <div style={{
                  fontSize: 11, fontWeight: 500,
                  color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" as const,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    { icon: "📱", title: "Dated platforms", desc: "Existing study tools feel like 2010. Dual logins, broken forms, no mobile experience." },
    { icon: "🎯", title: "No adaptive learning", desc: "Static questions don't identify your weak spots. You need smart repetition." },
    { icon: "📊", title: "No progress tracking", desc: "How close are you to exam-ready? Right now, you're guessing." },
    { icon: "🤝", title: "The jobs black hole", desc: "After your CPL, you're told to 'network'. But where do you start?" },
  ];

  return (
    <section style={{ background: BRAND.cream, padding: "100px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <p style={{
            fontSize: 12, fontWeight: 700, color: BRAND.teal,
            letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12,
          }}>The problem</p>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "Georgia, serif",
            fontWeight: 400, color: BRAND.navy, lineHeight: 1.2, margin: "0 0 16px", maxWidth: 560,
          }}>
            Australian pilot training deserves better tools.
          </h2>
          <p style={{
            fontSize: 16, color: BRAND.gray, lineHeight: 1.65, maxWidth: 520, marginBottom: 48,
          }}>
            CASA&apos;s published fail rate sits around 34%. One in three students fail their theory
            exam — at $217 per resit. The study tools haven&apos;t kept up.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {problems.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                background: BRAND.white, borderRadius: 14, padding: "28px 24px",
                border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", height: "100%",
              }}>
                <div style={{ fontSize: 24, marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.navy, margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: BRAND.gray, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      tag: "Learn", color: BRAND.teal, bg: BRAND.tealPale,
      title: "Adaptive quiz engine",
      desc: "Spaced repetition that targets your weak areas. Questions you miss come back more often. Across all 7 CASA subjects, RPL through CPL.",
      details: ["Aerodynamics", "Air Law", "Navigation", "Performance", "Human Factors", "Meteorology", "Systems & AGK"],
    },
    {
      tag: "Track", color: BRAND.navyLight, bg: BRAND.bluePale,
      title: "Know when you're ready",
      desc: "Real-time progress dashboard showing mastery by subject and sub-topic. Estimated exam readiness score so you don't walk in guessing.",
      details: ["Mastery heat maps", "Score trends", "Exam readiness %", "Weak-area alerts"],
    },
    {
      tag: "Connect", color: BRAND.coral, bg: BRAND.coralPale,
      title: "From study to career",
      desc: "A searchable database of Australian charter operators, crowdsourced hiring data, and mentorship matching.",
      details: ["Operator database", "Hiring hour data", "Mentorship matching", "Job alerts"],
    },
  ];

  return (
    <section style={{ background: BRAND.white, padding: "100px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <p style={{
            fontSize: 12, fontWeight: 700, color: BRAND.teal,
            letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12,
          }}>What&apos;s coming</p>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "Georgia, serif",
            fontWeight: 400, color: BRAND.navy, lineHeight: 1.2, margin: "0 0 56px",
          }}>
            Built by a pilot, for pilots.
          </h2>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
                background: BRAND.white, borderRadius: 16, overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ padding: "36px 32px" }}>
                  <span style={{
                    display: "inline-block", fontSize: 11, fontWeight: 700, color: f.color,
                    background: f.bg, padding: "4px 10px", borderRadius: 4,
                    letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 14,
                  }}>{f.tag}</span>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: BRAND.navy, margin: "0 0 10px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: BRAND.gray, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
                <div style={{
                  background: f.bg, padding: "32px 28px",
                  display: "flex", flexWrap: "wrap", gap: 8, alignContent: "center",
                }}>
                  {f.details.map((d, j) => (
                    <span key={j} style={{
                      fontSize: 12, fontWeight: 600, color: f.color,
                      background: "rgba(255,255,255,0.7)", padding: "6px 12px", borderRadius: 6,
                    }}>{d}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    { feature: "Adaptive learning", us: true, others: false },
    { feature: "Mobile-first design", us: true, others: false },
    { feature: "Progress analytics", us: true, others: false },
    { feature: "All subjects, one price", us: true, others: false },
    { feature: "CASA-aligned content", us: true, others: true },
    { feature: "Practice exams", us: true, others: true },
    { feature: "Career tools & job board", us: true, others: false },
    { feature: "Mentorship matching", us: true, others: false },
  ];

  return (
    <section style={{ background: BRAND.cream, padding: "100px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <FadeIn>
          <p style={{
            fontSize: 12, fontWeight: 700, color: BRAND.teal,
            letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 12, textAlign: "center",
          }}>Why us</p>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 36px)", fontFamily: "Georgia, serif",
            fontWeight: 400, color: BRAND.navy, lineHeight: 1.2, margin: "0 0 40px", textAlign: "center",
          }}>
            Modern tools for modern pilots.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{
            background: BRAND.white, borderRadius: 14, overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "14px 24px", background: BRAND.navy,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const }}>Feature</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.tealLight, textTransform: "uppercase" as const, textAlign: "center" }}>Us</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, textAlign: "center" }}>Others</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "13px 24px",
                background: i % 2 === 0 ? BRAND.white : "rgba(0,0,0,0.015)",
                borderTop: "1px solid rgba(0,0,0,0.04)",
              }}>
                <span style={{ fontSize: 14, color: BRAND.dark }}>{r.feature}</span>
                <span style={{ textAlign: "center", fontSize: 16, color: BRAND.tealLight }}>✓</span>
                <span style={{ textAlign: "center", fontSize: 16, color: r.others ? BRAND.gray : "rgba(0,0,0,0.15)" }}>
                  {r.others ? "✓" : "—"}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      background: `linear-gradient(165deg, ${BRAND.navy} 0%, #0A1E33 100%)`,
      padding: "100px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <FadeIn>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontFamily: "Georgia, serif",
            fontWeight: 400, color: BRAND.white, lineHeight: 1.2, margin: "0 0 16px",
          }}>
            Ready to study smarter?
          </h2>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 36,
          }}>
            Join the waitlist and be first to access our platform when we launch.
            Early supporters get 30% off their first year.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <WaitlistForm />
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#060E17", padding: "40px 24px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L6 14l8 11 8-11L14 3z" fill={BRAND.tealLight} opacity="0.6"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
            Pilot Platform
          </span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          Built in Sydney, Australia. Made for student pilots everywhere.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <ComparisonSection />
      <CTASection />
      <Footer />
    </main>
  );
}
