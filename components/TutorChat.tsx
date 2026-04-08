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
      // Only send user/assistant messages (not the initial local greeting)
      const apiMessages = allMessages
        .filter((_, i) => i > 0) // skip the first assistant greeting
        .concat([{ role: 'user' as const, content: userText }])
        .filter(m => m.content); // remove any empty

      // If this is the first real question, just send it alone
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
          marginTop: '16px',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4fd1c5, #38b2ac)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
          }}
        >
          🧠
        </div>
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
    );
  }

  // Chat panel
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #111d33 0%, #0d1525 100%)',
        border: '1px solid rgba(79,209,197,0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginTop: '16px',
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
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4fd1c5, #38b2ac)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
          }}
        >
          🧠
        </div>
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

      <style>{`
        @keyframes tutorPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
