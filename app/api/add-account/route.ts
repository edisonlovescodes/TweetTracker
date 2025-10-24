import { NextRequest, NextResponse } from 'next/server';
import { getMonitorsCollection } from '@/lib/firebase';
import { TwitterMonitor } from '@/lib/twitter-monitor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, experienceId, whopId, addedBy } = body;

    if (!username || !experienceId) {
      return NextResponse.json(
        { error: 'Username and experienceId are required' },
        { status: 400 }
      );
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim().toLowerCase();

    if (!cleanUsername) {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      );
    }

    const monitorsRef = getMonitorsCollection();

    // Check if already monitoring this user for this experience
    const existing = await monitorsRef
      .where('username', '==', cleanUsername)
      .where('experienceId', '==', experienceId)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: 'Already monitoring this account' },
        { status: 400 }
      );
    }

    // Try to verify the Twitter account exists by fetching tweets
    // But don't fail if verification doesn't work - just add it anyway
    let lastTweetId: string | undefined;

    try {
      const monitor = new TwitterMonitor();
      const tweets = await monitor.checkForNewTweets(cleanUsername);

      if (tweets.length > 0) {
        lastTweetId = tweets[0].id;
        console.log(`[Add Account] Verified @${cleanUsername} - found ${tweets.length} tweets`);
      } else {
        console.warn(`[Add Account] No tweets found for @${cleanUsername}, but adding anyway`);
      }
    } catch (error) {
      console.warn(`[Add Account] Could not verify @${cleanUsername}, but adding anyway:`, error);
    }

    // Create the monitor regardless of verification
    const monitorData: any = {
      username: cleanUsername,
      whopId: whopId || experienceId,
      experienceId,
      addedBy: addedBy || 'system',
      addedAt: new Date(),
      lastChecked: new Date(),
    };

    // Only add lastTweetId if it exists (Firestore doesn't like undefined)
    if (lastTweetId) {
      monitorData.lastTweetId = lastTweetId;
    }

    const docRef = await monitorsRef.add(monitorData);

    console.log(`[Add Account] ✅ Now monitoring @${cleanUsername}`);

    return NextResponse.json({
      success: true,
      accountId: docRef.id,
      username: cleanUsername,
    });
  } catch (error) {
    console.error('[Add Account] Error:', error);
    return NextResponse.json(
      { error: 'Failed to add account' },
      { status: 500 }
    );
  }
}
