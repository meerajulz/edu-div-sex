import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const errorLog = await request.json();

    // Log to console (visible in Vercel logs for free tier - last 24 hours)
    console.error('CLIENT ERROR:', {
      timestamp: errorLog.timestamp,
      type: errorLog.type,
      message: errorLog.message,
      url: errorLog.url,
      userAgent: errorLog.userAgent,
      details: errorLog.details,
      deviceInfo: errorLog.deviceInfo,
    });

    // In the future, you could:
    // 1. Send to external logging service (Sentry, LogRocket, etc.)
    // 2. Store in database for later analysis
    // 3. Send email alerts for critical errors

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log client error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
