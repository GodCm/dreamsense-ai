import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { checkContent } from '@/lib/content-filter';

// 强制动态渲染，避免构建时预渲染错误
export const dynamic = 'force-dynamic';

const DREAM_INTERPRETATION_PROMPT = `You are a dream interpretation expert combining Western psychology (Freud & Jung) and Eastern dream analysis (Zhou Gong).

CRITICAL: You MUST always respond in English, regardless of the user's input language or dream description. All your interpretations must be in English.

Provide a comprehensive and in-depth initial interpretation covering:

## 🧠 Western Psychology Analysis
Based on Freud's psychoanalysis and Jung's analytical psychology, deeply analyze:
- What does this dream reveal about your hidden desires or fears?
- How does it relate to your personal experiences and memories?
- What archetypes or universal symbols are present?
- What might the dream be trying to tell your conscious mind?

## 🏮 Eastern Dream Interpretation
Based on traditional Chinese dream interpretation (Zhou Gong), provide detailed analysis:
- How does this dream reflect your current psychological state?
- What does it suggest about your living environment and life situation?
- What future possibilities or warnings does it indicate?
- What traditional symbolism is present in the dream elements?

## 💡 Action Guidance
Provide practical, actionable advice:
- What should the user do in their daily life?
- What should they pay attention to?
- What positive changes could they make?

IMPORTANT: Be thorough and deep in your analysis. Try to cover as much as possible so the user may not need to ask follow-up questions. The user should feel they have received a complete interpretation.

Keep the tone warm, insightful, and supportive. Use emojis to make it engaging.`;

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Please login to interpret dreams' },
        { status: 401 }
      );
    }

    const { dreamText } = await request.json();

    if (!dreamText || dreamText.length < 10) {
      return NextResponse.json(
        { error: 'Please describe your dream in at least 10 characters' },
        { status: 400 }
      );
    }

    // 内容安全检查
    const filterResult = checkContent(dreamText);
    if (!filterResult.isValid) {
      return NextResponse.json(
        { error: filterResult.message || 'Your input contains inappropriate content.' },
        { status: 400 }
      );
    }

    // Get user to check free trial status
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { freeTrialUsed: true, isSubscribed: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user can use the feature
    const canInterpret = dbUser.isSubscribed || !dbUser.freeTrialUsed;
    
    if (!canInterpret) {
      return NextResponse.json(
        { error: 'Your free trial has been used. Please subscribe or pay per dream to continue.' },
        { status: 403 }
      );
    }

    // Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

    console.log('=== API Config ===');
    console.log('API Key exists:', !!apiKey);
    console.log('API URL:', apiUrl);
    console.log('Node env:', process.env.NODE_ENV);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: DREAM_INTERPRETATION_PROMPT },
          { role: 'user', content: `Here's my dream:\n\n${dreamText}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('=== DeepSeek Response ===');
    console.log('Status:', response.status);
    console.log('Status OK:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      throw new Error('Failed to get dream interpretation');
    }

    const data = await response.json();
    const interpretation = data.choices?.[0]?.message?.content || 'Sorry, I could not interpret your dream at this time.';

    // Save the dream
    const dream = await prisma.dream.create({
      data: {
        userId: user.id,
        dreamText,
        interpretation,
        isPaid: dbUser.isSubscribed,
      },
    });

    // Update free trial status if this was the first use
    if (!dbUser.freeTrialUsed && !dbUser.isSubscribed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { freeTrialUsed: true },
      });
    }

    return NextResponse.json({
      interpretation,
      dreamId: dream.id,
      conversationRounds: 0,
      maxRounds: dbUser.isSubscribed ? 20 : 5,
    });
  } catch (error) {
    console.error('=== Dream Interpretation Error ===');
    console.error('Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    // 在开发环境返回详细错误信息
    return NextResponse.json(
      { 
        error: 'Something went wrong. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? { message: errorMessage, stack: errorStack } : undefined
      },
      { status: 500 }
    );
  }
}