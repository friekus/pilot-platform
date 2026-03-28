"use client";
import "../quiz.css";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

type Question = {
  id: number; subject: string; level: string; subtopic: string;
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string; explanation: string; reference: string;
};

type AnswerRecord = {
  question: Question;
  selected: string;
  correct: boolean;
};

const slugToSubject: Record<string, string> = {
  "aerodynamics": "Aerodynamics",
  "air-law": "Air Law",
  "meteorology": "Meteorology",
  "human-factors": "Human Factors",
  "navigation": "Navigation",
  "performance": "Performance",
  "systems": "Systems",
};

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function QuizSubjectPage() {
  const params = useParams();
  const slug = typeof params.subject === "string" ? params.subject : "";
  const subjectName = slugToSubject[slug] || slug;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const QUIZ_LENGTH = 10;

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/questions?subject=eq.${encodeURIComponent(subjectName)}&level=eq.RPL&select=*`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
      );
      if (!res.ok) throw new Error("Failed to load questions");
      const data: Question[] = await res.json();
      if (data.length === 0) {
        setError(`No questions found for ${subjectName}. This subject may not be available yet.`);
        setLoading(false);
        return;
      }
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH);
      setQuestions(shuffled);
    } catch {
      setError("Could not load questions. Please try again.");
    }
    setLoading(false);
  }, [subjectName]);

  useEffect(() => { if (subjectName) fetchQuestions(); }, [fetchQuestions, subjectName]);

  const handleSelect = (letter: string) => {
    if (showResult) return;
    setSelected(letter);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setShowResult(true);
    const isCorrect = selected === questions[current].correct_answer;
    setAnswers(prev => [...prev, { question: questions[current], selected, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setAnswers([]);
    setQuizComplete(false);
    setReviewMode(false);
    setReviewIndex(0);
    fetchQuestions();
  };

  const q = questions[current];
  const options = q ? [
    { letter: "A", text: q.option_a },
    { letter: "B", text: q.option_b },
    { letter: "C", text: q.option_c },
    { letter: "D", text: q.option_d },
  ] : [];

  const score = answers.filter(a => a.correct).length;
  const answered = answers.length;
  const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;

  const getTopicBreakdown = () => {
    const topics: Record<string, { correct: number; total: number }> = {};
    answers.forEach(a => {
      const t = a.question.subtopic || "General";
      if (!topics[t]) topics[t] = { correct: 0, total: 0 };
      topics[t].total++;
      if (a.correct) topics[t].correct++;
    });
    return Object.entries(topics)
      .map(([name, data]) => ({ name, ...data, pct: Math.round((data.correct / data.total) * 100) }))
      .sort((a, b) => a.pct - b.pct);
  };

  if (reviewMode) {
    const ra = answers[reviewIndex];
    const rq = ra.question;
    const rOpts = [
      { letter: "A", text: rq.option_a },
      { letter: "B", text: rq.option_b },
      { letter: "C", text: rq.option_c },
      { letter: "D", text: rq.option_d },
    ];
    return (
      <div className="quiz-root">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <nav className="quiz-nav">
          <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
          <button onClick={() => setReviewMode(false)} className="quiz-score-pill" style={{ cursor: "pointer", border: "none" }}>Back to results</button>
        </nav>
        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${((reviewIndex + 1) / answers.length) * 100}%` }} /></div>
            <span className="quiz-progress-text">Reviewing {reviewIndex + 1} of {answers.length} — {ra.correct ? "You got this right" : "You got this wrong"}</span>
          </div>
          <div className="quiz-card">
            <div className="quiz-subtopic">{rq.subtopic}</div>
            <h2 className="quiz-question">{rq.question}</h2>
            <div className="quiz-options">
              {rOpts.map(opt => {
                let cls = "quiz-option";
                if (opt.letter === rq.correct_answer) cls += " correct";
                else if (opt.letter === ra.selected && !ra.correct) cls += " incorrect";
                else cls += " dimmed";
                return (
                  <div key={opt.letter} className={cls}>
                    <span className="quiz-option-letter">{opt.letter}</span>
                    <span className="quiz-option-text">{opt.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="quiz-explanation">
              <div className={`quiz-result-badge ${ra.correct ? "correct" : "incorrect"}`}>
                {ra.correct ? "You answered correctly" : `You answered ${ra.selected} — correct answer is ${rq.correct_answer}`}
              </div>
              <p className="quiz-explanation-text">{rq.explanation}</p>
              {rq.reference && <p className="quiz-reference">Ref: {rq.reference}</p>}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {reviewIndex > 0 && <button onClick={() => setReviewIndex(i => i - 1)} className="quiz-btn" style={{ flex: 1 }}>Previous</button>}
              {reviewIndex < answers.length - 1 && <button onClick={() => setReviewIndex(i => i + 1)} className="quiz-btn quiz-btn-primary" style={{ flex: 1 }}>Next</button>}
              {reviewIndex === answers.length - 1 && <button onClick={() => setReviewMode(false)} className="quiz-btn quiz-btn-primary" style={{ flex: 1 }}>Back to results</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <div className="quiz-score-pill">
          {answered > 0 && !quizComplete ? `${score}/${answered} (${pct}%)` : `RPL ${subjectName}`}
        </div>
      </nav>

      <div className="quiz-container">
        {loading && (
          <div className="quiz-loading">
            <div className="quiz-spinner" />
            <p>Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="quiz-error">
            <p>{error}</p>
            <a href="/quiz" className="quiz-btn" style={{ textDecoration: "none", display: "inline-block", marginTop: 12 }}>Back to subjects</a>
          </div>
        )}

        {quizComplete && (
          <div className="quiz-complete">
            <div className="quiz-complete-icon" style={{
              background: pct >= 70 ? "rgba(0,212,170,0.12)" : "rgba(255,107,74,0.1)",
              color: pct >= 70 ? "#00D4AA" : "#FF6B4A"
            }}>{pct >= 70 ? "\u2713" : "\u2717"}</div>
            <h2 className="quiz-complete-title">
              {pct >= 70 ? "Great work!" : "Keep studying"}
            </h2>
            <p className="quiz-complete-score">
              You scored {score} out of {answered} ({pct}%)
            </p>
            <p className="quiz-complete-msg">
              {pct >= 90 ? `Outstanding. You have a strong grasp of RPL ${subjectName}.` :
               pct >= 70 ? "Solid result. Review the explanations for the ones you missed." :
               pct >= 50 ? "You're getting there. Focus on the topics below marked in red." :
               "Don't worry \u2014 this is how you learn. Review the topic breakdown below and try again."}
            </p>

            <div className="quiz-breakdown">
              <h3 className="quiz-breakdown-title">Performance by topic</h3>
              {getTopicBreakdown().map(t => (
                <div key={t.name} className="quiz-topic-row">
                  <div className="quiz-topic-info">
                    <span className="quiz-topic-name">{t.name}</span>
                    <span className="quiz-topic-score">{t.correct}/{t.total}</span>
                  </div>
                  <div className="quiz-topic-bar">
                    <div className="quiz-topic-fill" style={{
                      width: `${t.pct}%`,
                      background: t.pct >= 70 ? "#00D4AA" : t.pct >= 50 ? "#EF9F27" : "#FF6B4A"
                    }} />
                  </div>
                  <span className="quiz-topic-pct" style={{
                    color: t.pct >= 70 ? "#00D4AA" : t.pct >= 50 ? "#EF9F27" : "#FF6B4A"
                  }}>{t.pct}%</span>
                </div>
              ))}
            </div>

            <div className="quiz-review-list">
              <h3 className="quiz-breakdown-title">Question review</h3>
              {answers.map((a, i) => (
                <button key={i} className={`quiz-review-item ${a.correct ? "correct" : "incorrect"}`}
                  onClick={() => { setReviewMode(true); setReviewIndex(i); }}>
                  <span className="quiz-review-num">{i + 1}</span>
                  <span className="quiz-review-q">{a.question.question.length > 60 ? a.question.question.slice(0, 60) + "..." : a.question.question}</span>
                  <span className="quiz-review-icon">{a.correct ? "\u2713" : "\u2717"}</span>
                </button>
              ))}
            </div>

            <div className="quiz-complete-actions">
              <button onClick={handleRestart} className="quiz-btn quiz-btn-primary">Try again with new questions</button>
              <a href="/quiz" className="quiz-btn" style={{ textDecoration: "none" }}>Choose another subject</a>
            </div>
          </div>
        )}

        {!loading && !error && !quizComplete && q && (
          <>
            <div className="quiz-progress">
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="quiz-progress-text">Question {current + 1} of {questions.length}</span>
            </div>

            <div className="quiz-card">
              <div className="quiz-subtopic">{q.subtopic}</div>
              <h2 className="quiz-question">{q.question}</h2>

              <div className="quiz-options">
                {options.map(opt => {
                  let cls = "quiz-option";
                  if (showResult) {
                    if (opt.letter === q.correct_answer) cls += " correct";
                    else if (opt.letter === selected) cls += " incorrect";
                    else cls += " dimmed";
                  } else if (opt.letter === selected) {
                    cls += " selected";
                  }
                  return (
                    <button key={opt.letter} className={cls} onClick={() => handleSelect(opt.letter)}>
                      <span className="quiz-option-letter">{opt.letter}</span>
                      <span className="quiz-option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {!showResult && (
                <button onClick={handleSubmit} className="quiz-btn quiz-btn-primary quiz-submit" disabled={!selected}>
                  Check answer
                </button>
              )}

              {showResult && (
                <div className="quiz-explanation">
                  <div className={`quiz-result-badge ${selected === q.correct_answer ? "correct" : "incorrect"}`}>
                    {selected === q.correct_answer ? "Correct!" : `Incorrect \u2014 the answer is ${q.correct_answer}`}
                  </div>
                  <p className="quiz-explanation-text">{q.explanation}</p>
                  {q.reference && <p className="quiz-reference">Ref: {q.reference}</p>}
                  <button onClick={handleNext} className="quiz-btn quiz-btn-primary quiz-next">
                    {current + 1 >= questions.length ? "See results" : "Next question"}
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#4A5568" }}>
                Vectored is a study aid only. Not affiliated with or endorsed by CASA.
                {" · "}<a href="/terms" style={{ color: "#4A5568" }}>Terms</a>
                {" · "}<a href="/privacy" style={{ color: "#4A5568" }}>Privacy</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
