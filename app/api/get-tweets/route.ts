import { NextRequest, NextResponse } from 'next/server';
import { getTweetsCollection } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!experienceId) {
      return NextResponse.json(
        { error: 'experienceId is required' },
        { status: 400 }
      );
    }

    const tweetsRef = getTweetsCollection();
    const snapshot = await tweetsRef
      .where('experienceId', '==', experienceId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const tweets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        username: data.username,
        text: data.text,
        link: data.link,
        timestamp: data.timestamp?.toDate?.()?.toISOString(),
        notifiedAt: data.notifiedAt?.toDate?.()?.toISOString(),
      };
    });

    return NextResponse.json({
      tweets,
    });
  } catch (error) {
    console.error('[Get Tweets] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get tweets' },
      { status: 500 }
    );
  }
}
