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

    // Verify the Twitter account exists by fetching tweets
    try {
      const monitor = new TwitterMonitor();
      const tweets = await monitor.checkForNewTweets(cleanUsername);

      if (tweets.length === 0) {
        console.warn(`[Add Account] No tweets found for @${cleanUsername}, but continuing anyway`);
      }

      // Create the monitor
      const docRef = await monitorsRef.add({
        username: cleanUsername,
        whopId: whopId || experienceId,
        experienceId,
        addedBy: addedBy || 'system',
        addedAt: new Date(),
        lastChecked: new Date(),
        lastTweetId: tweets.length > 0 ? tweets[0].id : undefined,
      });

      console.log(`[Add Account] ✅ Now monitoring @${cleanUsername}`);

      return NextResponse.json({
        success: true,
        accountId: docRef.id,
        username: cleanUsername,
      });
    } catch (error) {
      console.error(`[Add Account] Failed to verify account:`, error);
      return NextResponse.json(
        { error: 'Could not verify Twitter account. Please check the username.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Add Account] Error:', error);
    return NextResponse.json(
      { error: 'Failed to add account' },
      { status: 500 }
    );
  }
}
