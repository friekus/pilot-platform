"use client";
import "../quiz/quiz.css";
import { useEffect, useState, useCallback } from "react";

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

type Question = {
  id: number; subject: string; level: string; subtopic: string;
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string; explanation: string; reference: string;
};
type AnswerRecord = { question: Question; selected: string; correct: boolean; };

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

function ShareCard({ score, total, pct }: { score: number; total: number; pct: number }) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareText = `I just scored ${score}/${total} (${pct}%) on the Vectored RPL pilot quiz! Think you know your aviation theory? Try it:`;
  const shareUrl = "https://vectored.com.au/try";
  const fullText = `${shareText} ${shareUrl}`;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Vectored - Aviation Quiz", text: shareText, url: shareUrl }); } catch {}
    } else { setShowOptions(true); }
  };

  const handleWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank"); };
  const handleSMS = () => { window.open(`sms:?body=${encodeURIComponent(fullText)}`, "_blank"); };

  return (
    <div className="share-card">
      <div className="share-card-inner">
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#FFF", margin: "0 0 4px" }}>Challenge a mate</p>
          <p style={{ fontSize: 13, color: "#6B7B8D", margin: 0, lineHeight: 1.5 }}>Think your mates can beat {pct}%? Share the quiz and find out.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="share-btn share-btn-primary" onClick={handleNativeShare}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share score
          </button>
          <button className="share-btn" onClick={handleWhatsApp}>WhatsApp</button>
          <button className="share-btn" onClick={handleSMS}>Text</button>
          <button className="share-btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy link"}</button>
        </div>
        {showOptions && (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 12, color: "#6B7B8D", margin: "0 0 8px" }}>Copy this message and send it to a mate:</p>
            <p style={{ fontSize: 13, color: "#8899AA", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>{fullText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TryPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const QUIZ_LENGTH = 10;

  const fetchQuestions = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/questions?level=eq.RPL&select=*`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
      );
      if (!res.ok) throw new Error("Failed to load");
      const data: Question[] = await res.json();
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH);
      setQuestions(shuffled);
    } catch { setError("Could not load questions."); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSelect = (letter: string) => { if (!showResult) setSelected(letter); };
  const handleSubmit = () => {
    if (!selected) return;
    setShowResult(true);
    setAnswers(prev => [...prev, { question: questions[current], selected, correct: selected === questions[current].correct_answer }]);
  };
  const handleNext = () => {
    if (current + 1 >= questions.length) setQuizComplete(true);
    else { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
  };
  const handleRestart = () => {
    setCurrent(0); setSelected(null); setShowResult(false); setAnswers([]);
    setQuizComplete(false); fetchQuestions();
  };

  const q = questions[current];
  const options = q ? [{ letter: "A", text: q.option_a }, { letter: "B", text: q.option_b }, { letter: "C", text: q.option_c }, { letter: "D", text: q.option_d }] : [];
  const score = answers.filter(a => a.correct).length;
  const answered = answers.length;
  const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;

  const getTopicBreakdown = () => {
    const topics: Record<string, { correct: number; total: number }> = {};
    answers.forEach(a => {
      const t = a.question.subject;
      if (!topics[t]) topics[t] = { correct: 0, total: 0 };
      topics[t].total++;
      if (a.correct) topics[t].correct++;
    });
    return Object.entries(topics).map(([name, data]) => ({ name, ...data, pct: Math.round((data.correct / data.total) * 100) })).sort((a, b) => a.pct - b.pct);
  };

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/signup" className="quiz-score-pill" style={{ textDecoration: "none" }}>Sign up free</a>
      </nav>

      <div className="quiz-container">
        {loading && <div className="quiz-loading"><div className="quiz-spinner" /><p>Loading questions...</p></div>}
        {error && <div className="quiz-error"><p>{error}</p><button onClick={fetchQuestions} className="quiz-btn">Try again</button></div>}

        {quizComplete && (
          <div className="quiz-complete">
            <div className="quiz-complete-icon" style={{ background: pct >= 70 ? "rgba(0,212,170,0.12)" : "rgba(255,107,74,0.1)", color: pct >= 70 ? "#00D4AA" : "#FF6B4A" }}>{pct >= 70 ? "\u2713" : "\u2717"}</div>
            <h2 className="quiz-complete-title">{pct >= 70 ? "Nice work!" : "Room to improve"}</h2>
            <p className="quiz-complete-score">You scored {score} out of {answered} ({pct}%)</p>
            <p className="quiz-complete-msg">
              {pct >= 90 ? "Strong result across RPL subjects." :
               pct >= 70 ? "Good foundation. Create an account to practise by subject and track your progress." :
               pct >= 50 ? "You\u2019re on your way. Focus practice on your weakest subjects." :
               "Everyone starts somewhere. Focused practice makes the difference."}
            </p>

            {/* Share card */}
            <ShareCard score={score} total={answered} pct={pct} />

            <div className="quiz-breakdown">
              <h3 className="quiz-breakdown-title">Performance by subject</h3>
              {getTopicBreakdown().map(t => (
                <div key={t.name} className="quiz-topic-row">
                  <div className="quiz-topic-info"><span className="quiz-topic-name">{t.name}</span><span className="quiz-topic-score">{t.correct}/{t.total}</span></div>
                  <div className="quiz-topic-bar"><div className="quiz-topic-fill" style={{ width: `${t.pct}%`, background: t.pct >= 70 ? "#00D4AA" : t.pct >= 50 ? "#EF9F27" : "#FF6B4A" }} /></div>
                  <span className="quiz-topic-pct" style={{ color: t.pct >= 70 ? "#00D4AA" : t.pct >= 50 ? "#EF9F27" : "#FF6B4A" }}>{t.pct}%</span>
                </div>
              ))}
            </div>

            {/* CTA to sign up */}
            <div style={{ marginTop: 8, padding: 24, background: "#131F33", borderRadius: 16, border: "1px solid rgba(0,212,170,0.2)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Ready to study properly?</h3>
              <p style={{ fontSize: 14, color: "#8899AA", margin: "0 0 16px", lineHeight: 1.6 }}>
                Create a free account to practise by subject, track your weak areas, and study with questions aligned to the Part 61 MOS.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <a href="/signup" className="quiz-btn quiz-btn-primary" style={{ textDecoration: "none" }}>Create free account</a>
                <button onClick={handleRestart} className="quiz-btn">Try another 10 questions</button>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#4A5568" }}>
                <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a>
                {" \u00B7 "}
                <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy</a>
              </p>
            </div>
          </div>
        )}

        {!loading && !error && !quizComplete && q && (
          <>
            {current === 0 && !showResult && (
              <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(0,212,170,0.06)", borderRadius: 12, border: "1px solid rgba(0,212,170,0.12)" }}>
                <p style={{ fontSize: 13, color: "#00D4AA", margin: 0, lineHeight: 1.5 }}>
                  <strong>Free RPL sample quiz</strong> — 10 random questions from across all RPL subjects. See how you go.
                </p>
              </div>
            )}

            <div className="quiz-progress">
              <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
              <span className="quiz-progress-text">Question {current + 1} of {questions.length} — {q.subject}</span>
            </div>
            <div className="quiz-card">
              <div className="quiz-subtopic">{q.subject} — {q.subtopic}</div>
              <h2 className="quiz-question">{q.question}</h2>
              <div className="quiz-options">
                {options.map(opt => {
                  let cls = "quiz-option";
                  if (showResult) { if (opt.letter === q.correct_answer) cls += " correct"; else if (opt.letter === selected) cls += " incorrect"; else cls += " dimmed"; }
                  else if (opt.letter === selected) cls += " selected";
                  return (<button key={opt.letter} className={cls} onClick={() => handleSelect(opt.letter)}><span className="quiz-option-letter">{opt.letter}</span><span className="quiz-option-text">{opt.text}</span></button>);
                })}
              </div>
              {!showResult && <button onClick={handleSubmit} className="quiz-btn quiz-btn-primary quiz-submit" disabled={!selected}>Check answer</button>}
              {showResult && (
                <div className="quiz-explanation">
                  <div className={`quiz-result-badge ${selected === q.correct_answer ? "correct" : "incorrect"}`}>{selected === q.correct_answer ? "Correct!" : `Incorrect \u2014 the answer is ${q.correct_answer}`}</div>
                  <p className="quiz-explanation-text">{q.explanation}</p>
                  {q.reference && <p className="quiz-reference">Ref: {q.reference}</p>}
                  <button onClick={handleNext} className="quiz-btn quiz-btn-primary quiz-next">{current + 1 >= questions.length ? "See results" : "Next question"}</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
