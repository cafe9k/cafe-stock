import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tushareApiUrl = 'http://api.tushare.pro';

    const tushareResponse = await fetch(tushareApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!tushareResponse.ok) {
      // Forward Tushare's error status and message if possible
      const errorText = await tushareResponse.text();
      return NextResponse.json(
        { error: `Tushare API request failed: ${errorText}` },
        { status: tushareResponse.status }
      );
    }

    const data = await tushareResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in Tushare proxy API route:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}