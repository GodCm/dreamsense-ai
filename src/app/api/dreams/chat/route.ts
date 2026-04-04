import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// 强制动态渲染，避免构建时预渲染错误
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Please login to continue' },
        { status: 401 }
      );
    }

    const { dreamId, message, history } = await request.json();

    if (!dreamId || !message) {
      return NextResponse.json(
        { error: 'Dream ID and message are required' },
        { status: 400 }
      );
    }

    // Get the dream
    const dream = await prisma.dream.findUnique({
      where: { id: dreamId },
      include: { user: true },
    });

    if (!dream || dream.userId !== user.id) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }

    // Get user's subscription status
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isSubscribed: true },
    });

    const maxRounds = dbUser?.isSubscribed ? 20 : 5;
    const currentRounds = dream.conversationRounds || 0;

    // Check if exceeded limit
    if (currentRounds >= maxRounds) {
      const message = dbUser?.isSubscribed 
        ? "It seems you have a lot on your mind about this dream. Remember, while dreams are fascinating, living well in the real world matters most. Take care! 🌙"
        : "You've used your 5 free questions. To continue exploring your dream, please subscribe or purchase a dream interpretation.";
      
      return NextResponse.json({
        response: message,
        conversationRounds: currentRounds,
        maxRounds,
        ended: true,
      });
    }

    // Call DeepSeek API with conversation history
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Build messages array with history
    const messages = [
      {
        role: 'system',
        content: `You are a dream interpretation expert. The user is asking a follow-up question about their dream: "${dream.dreamText}"

Their initial interpretation was:
${dream.interpretation}

CRITICAL: You MUST always respond in English, regardless of the user's input language or question language. All your responses must be in English.

Please answer their question thoughtfully and helpfully. Keep the tone warm and supportive.`
      },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not respond at this time.';

    // Update conversation rounds
    await prisma.dream.update({
      where: { id: dreamId },
      data: { conversationRounds: currentRounds + 1 },
    });

    const newRounds = currentRounds + 1;
    const isEnded = newRounds >= maxRounds;

    return NextResponse.json({
      response: aiResponse,
      conversationRounds: newRounds,
      maxRounds,
      ended: isEnded,
      endMessage: isEnded ? (dbUser?.isSubscribed 
        ? "It seems you have a lot on your mind about this dream. Remember, while dreams are fascinating, living well in the real world matters most. Take care! 🌙"
        : "You've reached the limit of free questions. To continue exploring your dreams, subscribe or purchase a plan.") : null,
    });
  } catch (error) {
    console.error('Dream chat error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}