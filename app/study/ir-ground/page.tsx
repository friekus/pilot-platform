"use client";
import "../../quiz/quiz.css";
import "./ir-ground.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { canAccessIrGround } from "./access";
import { groundItems, allQuestions, SOURCES_AS_OF, type GroundItem, type Question } from "./content";

type Mark = "got" | "shaky";
type Marks = Record<string, Mark>;
type View = { kind: "items" } | { kind: "item"; id: string } | { kind: "review" } | { kind: "mock" };

const STORAGE_KEY = "vectored.irGround.marks.v1";

function loadMarks(): Marks {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Marks) : {};
  } catch {
    return {};
  }
}

function saveMarks(m: Marks) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

function QuestionCard({ q, meta, mark, onMark }: { q: Question; meta?: string; mark?: Mark; onMark: (id: string, m: Mark | null) => void }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className={`irg-q ${mark ?? ""}`}>
      {meta && (
        <div className="irg-q-meta">
          <span>{meta}</span>
          {mark && <span style={{ color: mark === "got" ? "#00D4AA" : "#FF6B4A" }}>{mark === "got" ? "Got it" : "Shaky"}</span>}
        </div>
      )}
      <div className="irg-q-text">{q.q}</div>
      <div className="irg-q-actions">
        <button className="irg-btn-sm" onClick={() => setShowHint(v => !v)}>{showHint ? "Hide hint" : "Hint"}</button>
        <button className="irg-btn-sm primary" onClick={() => setShowAnswer(v => !v)}>{showAnswer ? "Hide answer" : "Show answer"}</button>
      </div>
      {showHint && <div className="irg-hint">{q.hint}</div>}
      {showAnswer && (
        <div className="irg-answer">
          <div className="irg-answer-text">{q.answer}</div>
          <div className="irg-ref">{q.ref}</div>
          <div className="irg-mark">
            <span className="irg-mark-label">How did you go?</span>
            <button className={`irg-btn-sm got ${mark === "got" ? "on" : ""}`} onClick={() => onMark(q.id, mark === "got" ? null : "got")}>Got it</button>
            <button className={`irg-btn-sm shaky ${mark === "shaky" ? "on" : ""}`} onClick={() => onMark(q.id, mark === "shaky" ? null : "shaky")}>Shaky</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemView({ item, marks, onMark }: { item: GroundItem; marks: Marks; onMark: (id: string, m: Mark | null) => void }) {
  return (
    <div>
      <div className="quiz-subtopic" style={{ marginBottom: 6 }}>Knowledge item {item.code}</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px", lineHeight: 1.25 }}>{item.title}</h1>
      <p style={{ fontSize: 15, color: "#8899AA", margin: "0 0 20px", lineHeight: 1.6 }}>{item.summary}</p>

      {item.note && <div className="irg-note">{item.note}</div>}

      <div className="irg-section-label">Reference card</div>
      <div className="quiz-card" style={{ padding: "22px 20px" }}>
        {item.facts.map(f => (
          <div key={f.label} className="irg-fact">
            <div className="irg-fact-label">{f.label}</div>
            <div className="irg-fact-text">{f.text}</div>
            <div className="irg-ref">{f.ref}</div>
          </div>
        ))}
      </div>

      {item.aids.length > 0 && (
        <>
          <div className="irg-section-label">Memory aids</div>
          {item.aids.map(a => (
            <div key={a.name} className="irg-aid">
              <div className="irg-aid-name">{a.name}</div>
              {a.lines.map(l => <div key={l} className="irg-aid-line">{l}</div>)}
            </div>
          ))}
        </>
      )}

      <div className="irg-section-label">Examiner questions</div>
      {item.questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} meta={`Question ${i + 1} of ${item.questions.length}`} mark={marks[q.id]} onMark={onMark} />
      ))}
    </div>
  );
}

export default function IrGroundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState<Marks>({});
  const [view, setView] = useState<View>({ kind: "items" });
  const [mockOrder, setMockOrder] = useState<string[]>([]);
  const [mockIndex, setMockIndex] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      if (!canAccessIrGround(session.user.email)) { router.push("/dashboard"); return; }
      setMarks(loadMarks());
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const onMark = useCallback((id: string, m: Mark | null) => {
    setMarks(prev => {
      const next = { ...prev };
      if (m) next[id] = m; else delete next[id];
      saveMarks(next);
      return next;
    });
  }, []);

  const go = (v: View) => {
    setView(v);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const startMock = () => {
    setMockOrder(shuffle(allQuestions.map(q => q.id)));
    setMockIndex(0);
    go({ kind: "mock" });
  };

  const totals = useMemo(() => {
    const got = allQuestions.filter(q => marks[q.id] === "got").length;
    const shaky = allQuestions.filter(q => marks[q.id] === "shaky").length;
    return { got, shaky, total: allQuestions.length };
  }, [marks]);

  const shakyQuestions = useMemo(() => allQuestions.filter(q => marks[q.id] === "shaky"), [marks]);

  if (loading) {
    return (
      <div className="quiz-root">
        <div className="quiz-container"><div className="quiz-loading"><div className="quiz-spinner" /><p>Loading...</p></div></div>
      </div>
    );
  }

  const currentItem = view.kind === "item" ? groundItems.find(i => i.id === view.id) : undefined;
  const mockQ = view.kind === "mock" ? allQuestions.find(q => q.id === mockOrder[mockIndex]) : undefined;

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <span className="quiz-score-pill">IR ground prep</span>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}>
          {view.kind === "items"
            ? <a href="/dashboard" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>{"←"} Dashboard</a>
            : <button onClick={() => go({ kind: "items" })} style={{ fontSize: 13, color: "#4A5568", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{"←"} All items</button>}
        </div>

        {view.kind !== "item" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Instrument rating: ground component</h1>
              <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
                Every knowledge item from CASA form 61-1503, section 2. Each has a reference card, memory aids and examiner-style questions, set in the PA-44 Seminole with G1000.
              </p>
            </div>

            <div className="irg-stats">
              <div className="irg-stat"><div className="irg-stat-val" style={{ color: "#00D4AA" }}>{totals.got}</div><div className="irg-stat-label">Got it</div></div>
              <div className="irg-stat"><div className="irg-stat-val" style={{ color: "#FF6B4A" }}>{totals.shaky}</div><div className="irg-stat-label">Shaky</div></div>
              <div className="irg-stat"><div className="irg-stat-val" style={{ color: "#C0CDD8" }}>{totals.total - totals.got - totals.shaky}</div><div className="irg-stat-label">Not tried</div></div>
            </div>

            <div className="irg-tabs">
              <button className={`irg-tab ${view.kind === "items" ? "active" : ""}`} onClick={() => go({ kind: "items" })}>Knowledge items</button>
              <button className={`irg-tab ${view.kind === "review" ? "active" : ""}`} onClick={() => go({ kind: "review" })}>Weak spots ({totals.shaky})</button>
              <button className={`irg-tab ${view.kind === "mock" ? "active" : ""}`} onClick={startMock}>Mock oral</button>
            </div>
          </>
        )}

        {view.kind === "items" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {groundItems.map(it => {
              const done = it.questions.filter(q => marks[q.id] === "got").length;
              const shaky = it.questions.filter(q => marks[q.id] === "shaky").length;
              const pct = Math.round((done / it.questions.length) * 100);
              return (
                <button key={it.id} className="subject-card" onClick={() => go({ kind: "item", id: it.id })} style={{ textAlign: "left", width: "100%", fontFamily: "'DM Sans', sans-serif" }}>
                  <div className="subject-icon" style={{ background: "#00D4AA15", color: "#00D4AA", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>{it.code}</div>
                  <div className="subject-info">
                    <div className="subject-name">{it.title}</div>
                    <div className="subject-desc">
                      {done}/{it.questions.length} got it{shaky > 0 ? ` · ${shaky} shaky` : ""}
                    </div>
                    <div className="irg-item-progress"><div className="irg-item-progress-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                  <div className="subject-meta"><span className="subject-arrow">{"→"}</span></div>
                </button>
              );
            })}
          </div>
        )}

        {view.kind === "item" && currentItem && (
          <>
            <ItemView key={currentItem.id} item={currentItem} marks={marks} onMark={onMark} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 24 }}>
              {(() => {
                const idx = groundItems.findIndex(i => i.id === currentItem.id);
                const prev = groundItems[idx - 1];
                const next = groundItems[idx + 1];
                return (
                  <>
                    {prev ? <button className="quiz-btn" onClick={() => go({ kind: "item", id: prev.id })}>{"←"} {prev.code}</button> : <span />}
                    {next ? <button className="quiz-btn quiz-btn-primary" onClick={() => go({ kind: "item", id: next.id })}>{next.code} {"→"}</button> : <button className="quiz-btn quiz-btn-primary" onClick={startMock}>Mock oral {"→"}</button>}
                  </>
                );
              })()}
            </div>
          </>
        )}

        {view.kind === "review" && (
          shakyQuestions.length === 0
            ? <div className="irg-empty">Nothing marked shaky yet.<br />Mark questions as shaky after you check the answer and they will collect here.</div>
            : shakyQuestions.map(q => (
                <QuestionCard key={q.id} q={q} meta={`${q.itemCode} · ${q.itemTitle}`} mark={marks[q.id]} onMark={onMark} />
              ))
        )}

        {view.kind === "mock" && mockQ && (
          <>
            <div className="quiz-progress">
              <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${((mockIndex + 1) / mockOrder.length) * 100}%` }} /></div>
              <div className="quiz-progress-text">Question {mockIndex + 1} of {mockOrder.length}. Answer out loud first, then check.</div>
            </div>
            <QuestionCard key={mockQ.id} q={mockQ} meta={`${mockQ.itemCode} · ${mockQ.itemTitle}`} mark={marks[mockQ.id]} onMark={onMark} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 12 }}>
              <button className="quiz-btn" disabled={mockIndex === 0} onClick={() => setMockIndex(i => Math.max(0, i - 1))} style={{ opacity: mockIndex === 0 ? 0.4 : 1 }}>{"←"} Back</button>
              {mockIndex < mockOrder.length - 1
                ? <button className="quiz-btn quiz-btn-primary" onClick={() => setMockIndex(i => i + 1)}>Next question {"→"}</button>
                : <button className="quiz-btn quiz-btn-primary" onClick={startMock}>Reshuffle</button>}
            </div>
          </>
        )}

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            Sources: {SOURCES_AS_OF}.<br />
            Vectored is a study aid, not affiliated with CASA. Always use current documents for flight.
          </p>
        </div>
      </div>
    </div>
  );
}
