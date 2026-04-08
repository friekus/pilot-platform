import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an Australian aviation theory tutor for Vectored.com.au, helping student pilots studying for their RPL (Recreational Pilot Licence) exam.

Your role:
- Explain aviation concepts clearly and simply, as if talking to a student who is learning for the first time
- Reference Australian regulations (CASA, CASR, Part 61 MOS, VFRG) — never FAA regulations
- Use practical, real-world flying examples to illustrate concepts
- Be encouraging but accurate — never simplify to the point of being incorrect
- Keep responses concise (2-4 paragraphs max unless the student asks for more detail)
- If the student got the question wrong, gently explain why their answer was incorrect and why the correct answer is right
- Use Australian aviation terminology and units (feet, knots, hPa, NM)
- You are speaking to RPL-level students. Use simple language. Do not assume they know advanced aerodynamics or complex meteorology.

You have the context of the specific question the student just answered. Use it to give targeted, relevant explanations.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, questionContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!questionContext) {
      return NextResponse.json({ error: 'Question context is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set in environment variables');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Build the context message from the question data
    const letters: Record<string, string> = {
      A: questionContext.option_a,
      B: questionContext.option_b,
      C: questionContext.option_c,
      D: questionContext.option_d,
    };

    const contextBlock = `The student just answered this ${questionContext.subject} question about ${questionContext.subtopic}:

QUESTION: ${questionContext.question}
A) ${questionContext.option_a}
B) ${questionContext.option_b}
C) ${questionContext.option_c}
D) ${questionContext.option_d}

CORRECT ANSWER: ${questionContext.correct_answer}) ${letters[questionContext.correct_answer]}
STUDENT SELECTED: ${questionContext.selected_answer}) ${letters[questionContext.selected_answer]}
RESULT: ${questionContext.is_correct ? 'CORRECT' : 'INCORRECT'}

EXPLANATION: ${questionContext.explanation}
REFERENCE: ${questionContext.reference}`;

    // Build API messages: inject context into the first user message
    const apiMessages = messages.map((msg: { role: string; content: string }, index: number) => {
      if (index === 0 && msg.role === 'user') {
        return {
          role: 'user',
          content: contextBlock + '\n\nThe student asks: ' + msg.content,
        };
      }
      return { role: msg.role, content: msg.content };
    });

    // Ensure alternating roles
    const merged: { role: string; content: string }[] = [];
    for (const m of apiMessages) {
      if (merged.length > 0 && merged[merged.length - 1].role === m.role) {
        merged[merged.length - 1].content += '\n\n' + m.content;
      } else {
        merged.push({ ...m });
      }
    }

    // Ensure first message is from user
    if (merged.length > 0 && merged[0].role !== 'user') {
      merged.unshift({ role: 'user', content: 'Hello, I have a question about the topic.' });
    }

    console.log('Calling Anthropic API with', merged.length, 'messages');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: merged,
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Anthropic API error:', response.status, responseText);
      
      // If the model isn't available, try fallback
      if (response.status === 400 || response.status === 404) {
        console.log('Trying fallback model claude-3-5-sonnet-20241022...');
        const fallbackResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: merged,
          }),
        });

        const fallbackText = await fallbackResponse.text();
        
        if (!fallbackResponse.ok) {
          console.error('Fallback model also failed:', fallbackResponse.status, fallbackText);
          return NextResponse.json(
            { error: 'Failed to get response from tutor. Status: ' + fallbackResponse.status },
            { status: 500 }
          );
        }

        const fallbackData = JSON.parse(fallbackText);
        const fallbackReply = fallbackData.content
          ?.filter((b: { type: string }) => b.type === 'text')
          .map((b: { text: string }) => b.text)
          .join('') || 'I could not generate a response. Please try again.';

        return NextResponse.json({ reply: fallbackReply });
      }

      return NextResponse.json(
        { error: 'Failed to get response from tutor. Status: ' + response.status },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    const reply = data.content
      ?.filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('') || 'I could not generate a response. Please try again.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Tutor API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
