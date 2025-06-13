import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const tushareApiUrl = 'http://api.tushare.pro';
    const token = process.env.TUSHARE_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'Tushare token is not configured on the server.' }, { status: 500 });
    }

    // Add token to the request body sent to Tushare
    const body = {
      ...requestBody,
      token: token,
    };

    const tushareResponse = await fetch(tushareApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // body here refers to the modified body with token
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