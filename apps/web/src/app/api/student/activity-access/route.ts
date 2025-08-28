import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { canUserAccessActivity } from '@/lib/activityAccess';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activitySlug, sceneSlug } = body;

    if (!activitySlug) {
      return NextResponse.json({ error: 'Activity slug is required' }, { status: 400 });
    }

    console.log(`🔒 API: Checking access for user ${session.user.id} to ${activitySlug}${sceneSlug ? `/${sceneSlug}` : ''}`);

    const accessResult = await canUserAccessActivity(
      session.user.id,
      activitySlug,
      sceneSlug
    );

    return NextResponse.json(accessResult);

  } catch (error) {
    console.error('Error in activity access API:', error);
    return NextResponse.json(
      { 
        canAccess: false, 
        redirectTo: '/home',
        error: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}