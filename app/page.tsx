"use client";
import { useEffect, useRef, useState } from "react";

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

function EmailForm({ id, dark = false }: { id: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!email.includes("@")) return; setDone(true); };
  if (done) return (<div style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderRadius:10,background:"rgba(0,212,170,0.1)",border:"1px solid rgba(0,212,170,0.2)",color:"#00D4AA",fontWeight:500,fontSize:15 }}>✓ You&apos;re on the list. We&apos;ll be in touch before launch.</div>);
  return (<form onSubmit={submit} style={{ display:"flex",flexWrap:"wrap",gap:10,maxWidth:480 }}><input type="email" placeholder="Enter your email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ flex:"1 1 260px",padding:"13px 16px",borderRadius:10,border:"1.5px solid #1E3352",background:dark?"rgba(255,255,255,0.1)":"#162A42",color:"#F0F4F8",fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none",minWidth:200 }} /><button type="submit" style={{ padding:"13px 24px",borderRadius:10,border:"none",background:"#00D4AA",color:"#0B1120",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",whiteSpace:"nowrap" }}>Get early access</button></form>);
}

function Logo({ size=40 }: { size?: number }) {
  const s=size,cx=s/2,cy=s/2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s*0.25} fill="#0F1D2F"/><circle cx={cx} cy={cy} r={s*0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3}/><path d={`M${cx} ${s*0.2} L${s*0.775} ${s*0.725} L${cx} ${s*0.6} L${s*0.225} ${s*0.725} Z`} fill="#00D4AA"/></svg>);
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (<Fade><div style={{ background:"#131F33",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"28px 24px",display:"flex",flexDirection:"column",gap:14,transition:"border-color 0.25s,transform 0.25s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,212,170,0.3)";e.currentTarget.style.transform="translateY(-3px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)"}}><div style={{ width:44,height:44,borderRadius:12,background:"rgba(0,212,170,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>{icon}</div><h3 style={{ fontSize:17,fontWeight:600,color:"#FFF",lineHeight:1.3,margin:0,fontFamily:"'Space Grotesk',sans-serif" }}>{title}</h3><p style={{ fontSize:14.5,color:"#8899AA",lineHeight:1.7,margin:0 }}>{desc}</p></div></Fade>);
}

function CRow({ f, o }: { f: string; o: "n"|"~" }) {
  return (<div style={{ display:"grid",gridTemplateColumns:"1fr 90px 90px",padding:"13px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:14,alignItems:"center" }}><span style={{ color:"#C0CDD8",fontWeight:500 }}>{f}</span><span style={{ textAlign:"center",color:"#00D4AA",fontWeight:700,fontSize:17 }}>✓</span><span style={{ textAlign:"center",color:o==="~"?"#8899AA":"#4A5568",fontSize:17 }}>{o==="~"?"~":"✗"}</span></div>);
}

export default function Home() {
  return (<>
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet"/>
    <div style={{ background:"#0B1120",minHeight:"100vh",color:"#F0F4F8",fontFamily:"'DM Sans',system-ui,sans-serif",WebkitFontSmoothing:"antialiased",lineHeight:1.6 }}>

      <nav style={{ padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,0.06)" }}><div style={{ maxWidth:1120,margin:"0 auto",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center" }}><div style={{ display:"flex",alignItems:"center",gap:12 }}><Logo size={40}/><span style={{ fontSize:21,fontWeight:700,color:"#FFF",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:"-0.03em" }}>Vectored</span></div><div style={{ padding:"8px 18px",borderRadius:100,background:"rgba(0,212,170,0.1)",color:"#00D4AA",fontSize:13,fontWeight:600 }}>Coming soon</div></div></nav>

      <section style={{ position:"relative",overflow:"hidden",minHeight:540,display:"flex",alignItems:"center" }}>
        <div style={{ position:"absolute",inset:0,zIndex:0 }}><img src="/img-hero.jpg" alt="Light aircraft on runway" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%" }}/><div style={{ position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(11,17,32,0.92) 0%,rgba(11,17,32,0.8) 50%,rgba(11,17,32,0.4) 100%)" }}/></div>
        <div style={{ maxWidth:1120,margin:"0 auto",padding:"0 32px",position:"relative",zIndex:1 }}><div style={{ padding:"72px 0 64px",maxWidth:580 }}>
          <Fade><div style={{ display:"inline-block",padding:"7px 16px",borderRadius:100,background:"rgba(0,212,170,0.1)",border:"1px solid rgba(0,212,170,0.15)",color:"#00D4AA",fontSize:13,fontWeight:600,marginBottom:24 }}>Australian student pilot platform — launching 2026</div></Fade>
          <Fade delay={0.1}><h1 style={{ fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:"#FFF",letterSpacing:"-0.03em",marginBottom:20,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15 }}>Get vectored to your<br/><span style={{ color:"#00D4AA" }}>flying career</span></h1></Fade>
          <Fade delay={0.2}><p style={{ fontSize:18,color:"#8899AA",lineHeight:1.7,marginBottom:32 }}>The study platform built for Australian student pilots. Adaptive practice exams from your RPL all the way through to the 7 CPL subjects and IREX, progress tracking that finds your weak areas, and a career hub to help you network and land your first job.</p></Fade>
          <Fade delay={0.3}><EmailForm id="hero"/></Fade>
          <Fade delay={0.35}><p style={{ fontSize:13,color:"#4A5568",marginTop:14 }}>Join the waitlist — no spam, just launch updates.</p></Fade>
        </div></div>
      </section>

      <section style={{ maxWidth:1120,margin:"0 auto",padding:"40px 32px 56px" }}><Fade><div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:24,padding:"36px 28px",background:"#0F1D2F",borderRadius:20,border:"1px solid rgba(255,255,255,0.06)" }}>
        {[["350+","Practice questions"],["7","CASA subjects + IREX"],["50+","Charter operators"],["RPL→IREX","Licence levels"]].map(([v,l],i)=>(<div key={i} style={{ textAlign:"center" }}><div style={{ fontSize:36,fontWeight:700,color:"#00D4AA",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.1 }}>{v}</div><div style={{ fontSize:13,color:"#8899AA",marginTop:6,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:500 }}>{l}</div></div>))}
      </div></Fade></section>

      <section style={{ maxWidth:1120,margin:"0 auto",padding:"40px 32px 64px" }}><Fade><div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:40 }}>
          <div><div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#FF6B4A",marginBottom:10 }}>The problem</div><h2 style={{ fontSize:24,fontWeight:700,color:"#FFF",marginBottom:12,letterSpacing:"-0.02em",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15 }}>38% of student pilots fail their first CASA exam</h2><p style={{ fontSize:15,color:"#8899AA",lineHeight:1.75,margin:0 }}>That&apos;s a $217 resit fee, weeks of lost momentum, and a serious knock to your confidence. Existing study tools are outdated textbooks or random question banks with no way to track what you actually need to work on.</p></div>
          <div><div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#00D4AA",marginBottom:10 }}>The solution</div><h2 style={{ fontSize:24,fontWeight:700,color:"#FFF",marginBottom:12,letterSpacing:"-0.02em",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15 }}>A platform that knows what you don&apos;t know</h2><p style={{ fontSize:15,color:"#8899AA",lineHeight:1.75,margin:0 }}>Vectored tracks every question you answer. It finds your weak subjects, targets your gaps, and focuses your study time where it matters most. Plus a career hub showing you exactly which operators hire low-hour pilots and how to reach them.</p></div>
        </div>
        <div style={{ borderRadius:20,overflow:"hidden",aspectRatio:"4/3",position:"relative" }}><img src="/img-cockpit.jpg" alt="Student pilot and instructor in cockpit" style={{ width:"100%",height:"100%",objectFit:"cover" }}/><div style={{ position:"absolute",inset:0,borderRadius:20,border:"1px solid rgba(255,255,255,0.06)" }}/></div>
      </div></Fade></section>

      <section style={{ maxWidth:1120,margin:"0 auto",padding:"0 32px 64px" }}>
        <Fade><div style={{ textAlign:"center",marginBottom:44 }}><div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#00D4AA",marginBottom:12 }}>Features</div><h2 style={{ fontSize:32,fontWeight:700,color:"#FFF",letterSpacing:"-0.02em",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15,margin:0 }}>Everything you need to pass and get hired</h2></div></Fade>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16 }}>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><circle cx={12} cy={12} r={10}/><circle cx={12} cy={12} r={4}/><circle cx={12} cy={12} r={1}/></svg>} title="Adaptive practice exams" desc="Hundreds of questions covering your RPL exam through all 7 CPL subjects and the IREX. The system identifies your weak areas and serves more questions on the topics you're struggling with."/>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} title="Progress analytics" desc="See exactly where you stand in each subject. Track improvement over time. Know when you're ready to sit the real exam — not guess."/>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><rect x={3} y={3} width={18} height={18} rx={2}/><line x1={3} y1={9} x2={21} y2={9}/><line x1={9} y1={21} x2={9} y2={9}/></svg>} title="Visual explanations" desc="Every question comes with a detailed explanation and educational diagrams — aerofoils, circuit patterns, weather systems — concepts you can see, not just read."/>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx={12} cy={10} r={3}/></svg>} title="Operator database" desc="50+ Australian charter operators mapped across every state. Fleet types, minimum hours, contact details — find the operators who hire fresh CPL holders."/>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>} title="Interactive career map" desc="See where the jobs are on an interactive map of Australia. Click any operator to see their fleet, base, and key contacts — helping you network and get your foot in the door."/>
          <Feature icon={<svg viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={2} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg>} title="Built by a student pilot" desc="Vectored is built by someone going through it right now — not a corporation. Every feature exists because a real student pilot needed it."/>
        </div>
      </section>

      <section style={{ maxWidth:1120,margin:"0 auto",padding:"0 32px 64px" }}><Fade><div style={{ borderRadius:20,overflow:"hidden",position:"relative",height:280 }}>
        <img src="/img-outback.jpg" alt="Pilot on approach to a regional airstrip" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%" }}/>
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(0deg,#0B1120 0%,transparent 40%,transparent 60%,#0B1120 100%)" }}/>
        <div style={{ position:"absolute",inset:0,background:"rgba(11,17,32,0.55)",zIndex:1 }}/>
        <div style={{ position:"absolute",bottom:32,left:40,right:40,zIndex:2,fontSize:20,fontStyle:"italic",color:"#FFF",lineHeight:1.6,maxWidth:560,textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>&ldquo;I spent hours reading the same textbook pages and still couldn&apos;t get the concepts to stick. I needed something that showed me exactly where my gaps were — not just more practice questions.&rdquo;<span style={{ color:"#00D4AA",fontStyle:"normal",fontWeight:600,fontSize:14,display:"block",marginTop:8,textShadow:"none" }}>— The frustration every student pilot knows</span></div>
      </div></Fade></section>

      <section style={{ maxWidth:720,margin:"0 auto",padding:"0 32px 64px" }}>
        <Fade><h2 style={{ fontSize:28,fontWeight:700,color:"#FFF",letterSpacing:"-0.02em",textAlign:"center",marginBottom:36,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15 }}>How Vectored compares</h2></Fade>
        <Fade delay={0.1}><div style={{ background:"#0F1D2F",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)",overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 90px 90px",padding:"13px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"#4A5568",alignItems:"center" }}><span></span><span style={{ textAlign:"center",color:"#00D4AA" }}>Vectored</span><span style={{ textAlign:"center" }}>Others</span></div>
          <CRow f="Adaptive weak-area targeting" o="n"/>
          <CRow f="All 7 CASA subjects + IREX" o="~"/>
          <CRow f="Detailed explanations" o="~"/>
          <CRow f="Progress analytics dashboard" o="n"/>
          <CRow f="Visual diagrams & illustrations" o="n"/>
          <CRow f="Career / operator database" o="n"/>
          <CRow f="Interactive job map" o="n"/>
          <CRow f="Mobile-first design" o="n"/>
          <CRow f="Built for Australian students" o="~"/>
        </div></Fade>
      </section>

      <section style={{ maxWidth:720,margin:"0 auto",padding:"0 32px 80px" }}><Fade><div style={{ background:"#0F1D2F",borderRadius:24,padding:"56px 40px",textAlign:"center",position:"relative",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position:"absolute",top:-80,right:-60,width:250,height:250,background:"radial-gradient(circle,rgba(0,212,170,0.15) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <h2 style={{ fontSize:28,fontWeight:700,color:"#FFF",letterSpacing:"-0.02em",marginBottom:14,position:"relative",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.15 }}>Ready to get vectored?</h2>
        <p style={{ fontSize:16,color:"#8899AA",lineHeight:1.7,maxWidth:400,margin:"0 auto 28px",position:"relative" }}>Join the waitlist for early access. Be the first to study smarter when we launch.</p>
        <div style={{ display:"flex",justifyContent:"center",position:"relative" }}><EmailForm id="bottom" dark/></div>
      </div></Fade></section>

      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)",padding:"28px 0 36px" }}><div style={{ maxWidth:1120,margin:"0 auto",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}><Logo size={28}/><span style={{ fontSize:15,fontWeight:600,color:"#8899AA",fontFamily:"'Space Grotesk',sans-serif" }}>Vectored</span></div>
        <div style={{ fontSize:13,color:"#4A5568" }}>© 2026 Vectored. Built in Australia for Australian pilots.</div>
        <div style={{ display:"flex",gap:20 }}>{[["Instagram","https://instagram.com/vectoredau"],["Facebook","https://facebook.com/vectoredau"],["TikTok","https://tiktok.com/@vectoredau"]].map(([n,u])=>(<a key={n} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize:13,color:"#8899AA",textDecoration:"none" }}>{n}</a>))}</div>
      </div></footer>

    </div>
  </>);
}
