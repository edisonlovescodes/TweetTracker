import { NextRequest, NextResponse } from 'next/server';
import { TwitterMonitor } from '@/lib/twitter-monitor';
import { getMonitorsCollection, getTweetsCollection } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify the request is from your cron job (security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Cron] Unauthorized attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] 🔍 Starting tweet check...');

    const monitor = new TwitterMonitor();
    const monitorsRef = getMonitorsCollection();
    const tweetsRef = getTweetsCollection();
    const snapshot = await monitorsRef.get();

    if (snapshot.empty) {
      console.log('[Cron] No accounts to monitor');
      return NextResponse.json({
        success: true,
        message: 'No accounts to monitor',
      });
    }

    const results = {
      checked: 0,
      newTweets: 0,
      errors: 0,
    };

    // Check each monitored account
    for (const doc of snapshot.docs) {
      try {
        const account = doc.data();
        results.checked++;

        console.log(`[Cron] Checking @${account.username}...`);

        const newTweets = await monitor.checkForNewTweets(
          account.username,
          account.lastTweetId
        );

        if (newTweets.length > 0) {
          console.log(
            `[Cron] 🎉 Found ${newTweets.length} new tweets from @${account.username}!`
          );

          // Save each new tweet
          for (const tweet of newTweets) {
            await tweetsRef.doc(tweet.id).set({
              id: tweet.id,
              username: tweet.author,
              text: tweet.text,
              link: tweet.link,
              timestamp: tweet.timestamp,
              whopId: account.whopId,
              experienceId: account.experienceId,
              notifiedAt: new Date(),
            });
            results.newTweets++;
          }

          // Update last tweet ID
          await doc.ref.update({
            lastTweetId: newTweets[newTweets.length - 1].id,
            lastChecked: new Date(),
          });
        } else {
          // Update last checked time even if no new tweets
          await doc.ref.update({
            lastChecked: new Date(),
          });
        }
      } catch (error) {
        console.error(`[Cron] Error checking @${doc.data().username}:`, error);
        results.errors++;
      }
    }

    console.log('[Cron] ✅ Check complete:', results);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('[Cron] Job failed:', error);
    return NextResponse.json(
      { error: 'Failed to check tweets' },
      { status: 500 }
    );
  }
}
