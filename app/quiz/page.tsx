"use client";
import "./quiz.css";
import { useEffect, useState, useCallback } from "react";

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

type Question = {
  id: number; subject: string; level: string; subtopic: string;
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string; explanation: string; reference: string;
};

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const QUIZ_LENGTH = 10;

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/questions?subject=eq.Aerodynamics&level=eq.RPL&select=*`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
      );
      if (!res.ok) throw new Error("Failed to load questions");
      const data: Question[] = await res.json();
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH);
      setQuestions(shuffled);
    } catch {
      setError("Could not load questions. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSelect = (letter: string) => {
    if (showResult) return;
    setSelected(letter);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setShowResult(true);
    setAnswered(a => a + 1);
    if (selected === questions[current].correct_answer) {
      setScore(s => s + 1);
    }
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
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
    fetchQuestions();
  };

  const q = questions[current];
  const options = q ? [
    { letter: "A", text: q.option_a },
    { letter: "B", text: q.option_b },
    { letter: "C", text: q.option_c },
    { letter: "D", text: q.option_d },
  ] : [];

  const pct = answered > 0 ? Math.round((score / answered) * 100) : 0;

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <div className="quiz-score-pill">
          {answered > 0 ? `${score}/${answered} correct (${pct}%)` : "RPL Aerodynamics"}
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
            <button onClick={fetchQuestions} className="quiz-btn">Try again</button>
          </div>
        )}

        {quizComplete && (
          <div className="quiz-complete">
            <div className="quiz-complete-icon">{pct >= 70 ? "\u2713" : "\u2717"}</div>
            <h2 className="quiz-complete-title">
              {pct >= 70 ? "Great work!" : "Keep studying"}
            </h2>
            <p className="quiz-complete-score">
              You scored {score} out of {answered} ({pct}%)
            </p>
            <p className="quiz-complete-msg">
              {pct >= 90 ? "Outstanding. You have a strong grasp of RPL Aerodynamics." :
               pct >= 70 ? "Solid result. Review the explanations for the ones you missed." :
               pct >= 50 ? "You're getting there. Focus on the topics you found tricky." :
               "Don't worry — this is how you learn. Review the explanations and try again."}
            </p>
            <div className="quiz-complete-actions">
              <button onClick={handleRestart} className="quiz-btn quiz-btn-primary">Try again with new questions</button>
              <a href="/" className="quiz-btn">Back to home</a>
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
                    {selected === q.correct_answer ? "Correct!" : `Incorrect — the answer is ${q.correct_answer}`}
                  </div>
                  <p className="quiz-explanation-text">{q.explanation}</p>
                  {q.reference && <p className="quiz-reference">Ref: {q.reference}</p>}
                  <button onClick={handleNext} className="quiz-btn quiz-btn-primary quiz-next">
                    {current + 1 >= questions.length ? "See results" : "Next question"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
