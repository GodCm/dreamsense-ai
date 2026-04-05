import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 });
    }

    // 调用 Creem API 创建 checkout session
    // 注意：Creem API 使用 product_id 而不是 price_id
    const creemResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CREEM_API_KEY || '',
      },
      body: JSON.stringify({
        product_id: priceId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dreamsenseai.org'}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dreamsenseai.org'}/cancel`,
      }),
    });

    console.log('Creem API response status:', creemResponse.status);

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.error('Creem API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create checkout', details: errorText },
        { status: creemResponse.status }
      );
    }

    const data = await creemResponse.json();
    console.log('Checkout created:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
