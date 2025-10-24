'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import TweetCard from '@/components/TweetCard';

interface Tweet {
  id: string;
  username: string;
  text: string;
  link: string;
  timestamp: string;
}

export default function CustomerFeed() {
  const params = useParams();
  const experienceId = params.experienceId as string;

  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTweets();

    // Auto-refresh every 10 seconds for near-real-time updates
    const interval = setInterval(loadTweets, 10000);
    return () => clearInterval(interval);
  }, [experienceId]);

  const loadTweets = async () => {
    try {
      const response = await fetch(`/api/get-tweets?experienceId=${experienceId}`);

      if (!response.ok) {
        throw new Error('Failed to load tweets');
      }

      const data = await response.json();
      setTweets(data.tweets || []);
      setError('');
    } catch (err) {
      console.error('Failed to load tweets:', err);
      setError('Failed to load tweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Tweet Feed">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-dark/60">Loading tweets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Tweet Feed">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadTweets}
            className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Tweet Feed">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-dark/60">
          {tweets.length > 0
            ? `${tweets.length} tweet${tweets.length === 1 ? '' : 's'}`
            : 'No tweets yet'}
        </p>
        <button
          onClick={loadTweets}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dark/10 rounded-lg hover:border-accent/30 transition-colors text-sm font-medium text-dark"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {tweets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-dark/10 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">No tweets yet</h3>
          <p className="text-dark/60 max-w-md mx-auto">
            Your community admin needs to add Twitter accounts to monitor. Once they do,
            you'll see new tweets here automatically!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} {...tweet} />
          ))}
        </div>
      )}
    </Layout>
  );
}
