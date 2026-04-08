'use client';

import { useState, useRef, useEffect } from 'react';

interface QuestionContext {
  subject: string;
  subtopic: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  selected_answer: string;
  is_correct: boolean;
  explanation: string;
  reference: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TutorChatProps {
  questionContext: QuestionContext;
}

function TutorIcon({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="42" height="42" rx="12" fill="url(#tutorGrad)" />
      {/* Compass rose / heading indicator */}
      <circle cx="21" cy="21" r="11" stroke="#0a1628" strokeWidth="1.5" opacity="0.3" />
      <circle cx="21" cy="21" r="8" stroke="#0a1628" strokeWidth="1" opacity="0.2" />
      {/* N arrow */}
      <path d="M21 10 L23.5 17 L21 15.5 L18.5 17 Z" fill="#0a1628" />
      {/* Cardinal ticks */}
      <line x1="21" y1="10" x2="21" y2="13" stroke="#0a1628" strokeWidth="1.5" opacity="0.5" />
      <line x1="21" y1="29" x2="21" y2="32" stroke="#0a1628" strokeWidth="1" opacity="0.3" />
      <line x1="10" y1="21" x2="13" y2="21" stroke="#0a1628" strokeWidth="1" opacity="0.3" />
      <line x1="29" y1="21" x2="32" y2="21" stroke="#0a1628" strokeWidth="1" opacity="0.3" />
      {/* Center dot */}
      <circle cx="21" cy="21" r="1.5" fill="#0a1628" opacity="0.4" />
      <defs>
        <linearGradient id="tutorGrad" x1="0" y1="0" x2="42" y2="42">
          <stop stopColor="#4fd1c5" />
          <stop offset="1" stopColor="#38b2ac" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TutorIconSmall() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="url(#tutorGradSm)" />
      <circle cx="18" cy="18" r="9" stroke="#0a1628" strokeWidth="1.2" opacity="0.3" />
      <circle cx="18" cy="18" r="6.5" stroke="#0a1628" strokeWidth="0.8" opacity="0.2" />
      <path d="M18 9 L20 14.5 L18 13.2 L16 14.5 Z" fill="#0a1628" />
      <line x1="18" y1="9" x2="18" y2="11.5" stroke="#0a1628" strokeWidth="1.2" opacity="0.5" />
      <line x1="18" y1="24.5" x2="18" y2="27" stroke="#0a1628" strokeWidth="0.8" opacity="0.3" />
      <line x1="9" y1="18" x2="11.5" y2="18" stroke="#0a1628" strokeWidth="0.8" opacity="0.3" />
      <line x1="24.5" y1="18" x2="27" y2="18" stroke="#0a1628" strokeWidth="0.8" opacity="0.3" />
      <circle cx="18" cy="18" r="1.2" fill="#0a1628" opacity="0.4" />
      <defs>
        <linearGradient id="tutorGradSm" x1="0" y1="0" x2="36" y2="36">
          <stop stopColor="#4fd1c5" />
          <stop offset="1" stopColor="#38b2ac" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TutorChat({ questionContext }: TutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const q = questionContext;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const callTutor = async (userText: string, allMessages: Message[]) => {
    setLoading(true);
    try {
      const apiMessages = allMessages
        .filter((_, i) => i > 0)
        .concat([{ role: 'user' as const, content: userText }])
        .filter(m => m.content);

      const messagesToSend = apiMessages.length === 1
        ? [{ role: 'user', content: userText }]
        : apiMessages;

      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend,
          questionContext: q,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to tutor');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Tutor error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had trouble connecting just then — please try asking again.',
        },
      ]);
    }
    setLoading(false);
  };

  const openTutor = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting = q.is_correct
        ? `Nice work getting that one right! I can help you understand ${q.subtopic.toLowerCase()} in more depth if you'd like. What would you like to know more about?`
        : `No worries — ${q.subtopic.toLowerCase()} is a tricky topic. You picked ${q.selected_answer}, but the correct answer was ${q.correct_answer}. Want me to explain why, or is there something specific you'd like me to break down?`;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    callTutor(userText, messages);
  };

  const handleSuggestion = (text: string) => {
    if (loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    callTutor(text, messages);
  };

  const suggestions = q.is_correct
    ? ['Explain this in more depth', 'Give me a real-world example', 'What related topics should I study?', 'What should I remember for the exam?']
    : ['Why is my answer wrong?', 'Explain this more simply', 'Give me a real-world example', 'What should I remember for the exam?'];

  // Not open yet — show the button
  if (!isOpen) {
    return (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={openTutor}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '14px',
            border: '1.5px solid rgba(79,209,197,0.25)',
            background: 'linear-gradient(135deg, rgba(79,209,197,0.08), rgba(79,209,197,0.03))',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
          }}
        >
          <TutorIcon size={42} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>
              Ask the AI Tutor
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Get a personalised explanation from your AI study partner.
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: '#4fd1c5', fontSize: '22px', flexShrink: 0 }}>
            →
          </div>
        </button>
      </div>
    );
  }

  // Chat panel
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #111d33 0%, #0d1525 100%)',
          border: '1px solid rgba(79,209,197,0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(79,209,197,0.08)',
            background: 'rgba(79,209,197,0.04)',
          }}
        >
          <TutorIconSmall />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
              Vectored AI Tutor
            </div>
            <div style={{ fontSize: '11.5px', color: '#4fd1c5', fontWeight: 500 }}>
              Helping you understand {q.subtopic}
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px rgba(34,197,94,0.5)',
            }}
          />
        </div>

        {/* Messages */}
        <div
          style={{
            padding: '20px 24px',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: 1.65,
                  ...(msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #4fd1c5, #38b2ac)',
                        color: '#0a1628',
                        fontWeight: 500,
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(79,209,197,0.08)',
                        color: '#cbd5e1',
                        borderBottomLeftRadius: '4px',
                      }),
                }}
              >
                {msg.content.split('\n\n').map((para, j) => (
                  <p key={j} style={{ marginBottom: j < msg.content.split('\n\n').length - 1 ? '12px' : '0' }}>
                    {para.split('\n').map((line, k) => (
                      <span key={k}>
                        {line}
                        {k < para.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(79,209,197,0.08)',
                  borderBottomLeftRadius: '4px',
                  display: 'flex',
                  gap: '4px',
                }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#4fd1c5',
                      animation: `tutorPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(79,209,197,0.15)',
                  background: 'rgba(79,209,197,0.04)',
                  color: '#4fd1c5',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(79,209,197,0.08)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about this question..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(79,209,197,0.15)',
              background: 'rgba(255,255,255,0.03)',
              color: '#e2e8f0',
              fontSize: '14px',
              fontFamily: 'inherit',
              opacity: loading ? 0.5 : 1,
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: input.trim() && !loading ? 'linear-gradient(135deg, #4fd1c5, #38b2ac)' : '#1a2744',
              color: input.trim() && !loading ? '#0a1628' : '#475569',
              fontWeight: 700,
              fontSize: '14px',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>

        {/* AI Disclaimer */}
        <div style={{
          padding: '10px 24px 14px',
          background: 'rgba(0,0,0,0.1)',
          borderTop: '1px solid rgba(255,255,255,0.03)',
        }}>
          <p style={{
            fontSize: '11px',
            color: '#4A5568',
            lineHeight: 1.5,
            margin: 0,
            textAlign: 'center',
          }}>
            AI explanations are for study purposes only. Always verify with official CASA publications.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes tutorPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
