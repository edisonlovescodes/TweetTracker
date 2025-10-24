import { NextRequest, NextResponse } from 'next/server';
import { getMonitorsCollection } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');

    if (!experienceId) {
      return NextResponse.json(
        { error: 'experienceId is required' },
        { status: 400 }
      );
    }

    const monitorsRef = getMonitorsCollection();
    const snapshot = await monitorsRef
      .where('experienceId', '==', experienceId)
      .get();

    const accounts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        lastTweetId: data.lastTweetId,
        lastChecked: data.lastChecked?.toDate?.()?.toISOString(),
        addedAt: data.addedAt?.toDate?.()?.toISOString(),
      };
    });

    return NextResponse.json({
      accounts,
    });
  } catch (error) {
    console.error('[Get Accounts] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get accounts' },
      { status: 500 }
    );
  }
}
