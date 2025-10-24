import Parser from 'rss-parser';
import { Tweet } from './types';

const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net',
  'https://nitter.unixfox.eu',
  'https://nitter.privacytools.io',
];

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded'],
  },
});

export class TwitterMonitor {
  private currentInstanceIndex = 0;

  private getNextInstance(): string {
    const instance = NITTER_INSTANCES[this.currentInstanceIndex];
    this.currentInstanceIndex =
      (this.currentInstanceIndex + 1) % NITTER_INSTANCES.length;
    return instance;
  }

  /**
   * Check for new tweets from a user
   * Returns only tweets newer than lastTweetId
   */
  async checkForNewTweets(
    username: string,
    lastTweetId?: string
  ): Promise<Tweet[]> {
    // Try multiple Nitter instances for reliability
    for (let attempt = 0; attempt < NITTER_INSTANCES.length; attempt++) {
      try {
        const instance = this.getNextInstance();
        const rssUrl = `${instance}/${username}/rss`;

        console.log(`[Twitter Monitor] Checking @${username} via ${instance}...`);

        const feed = await parser.parseURL(rssUrl);

        if (!feed.items || feed.items.length === 0) {
          console.log(`[Twitter Monitor] No tweets found for @${username}`);
          return [];
        }

        const tweets: Tweet[] = feed.items
          .map((item) => {
            const tweetId = this.extractTweetId(item.link || '');
            if (!tweetId) return null;

            return {
              id: tweetId,
              text: this.cleanText(item.contentSnippet || item.title || ''),
              author: username,
              timestamp: new Date(item.pubDate || Date.now()),
              link: `https://twitter.com/${username}/status/${tweetId}`,
            };
          })
          .filter((tweet): tweet is Tweet => tweet !== null);

        // Filter for new tweets only
        if (lastTweetId) {
          const newTweets = tweets.filter((tweet) => {
            // Compare as numbers for proper ordering
            try {
              return BigInt(tweet.id) > BigInt(lastTweetId);
            } catch {
              return tweet.id > lastTweetId;
            }
          });

          if (newTweets.length > 0) {
            console.log(`[Twitter Monitor] ✅ Found ${newTweets.length} new tweets from @${username}`);
          }

          // Sort oldest first
          return newTweets.sort((a, b) => {
            try {
              return Number(BigInt(a.id) - BigInt(b.id));
            } catch {
              return a.id.localeCompare(b.id);
            }
          });
        }

        return tweets;
      } catch (error) {
        console.error(`[Twitter Monitor] Attempt ${attempt + 1} failed:`, error);

        if (attempt === NITTER_INSTANCES.length - 1) {
          throw new Error(
            `All ${NITTER_INSTANCES.length} Nitter instances failed for @${username}`
          );
        }

        // Wait a bit before next attempt
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return [];
  }

  private extractTweetId(link: string): string {
    // Extract ID from: https://nitter.net/elonmusk/status/1234567890
    const match = link.match(/\/status\/(\d+)/);
    return match ? match[1] : '';
  }

  private cleanText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n\n+/g, '\n')
      .trim();
  }
}
