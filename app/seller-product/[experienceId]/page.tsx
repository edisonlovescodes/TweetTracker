'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';

interface MonitoredAccount {
  id: string;
  username: string;
  lastTweetId?: string;
  lastChecked?: string;
  addedAt: string;
}

export default function SellerSettings() {
  const params = useParams();
  const experienceId = params.experienceId as string;

  const [username, setUsername] = useState('');
  const [accounts, setAccounts] = useState<MonitoredAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [experienceId]);

  const loadAccounts = async () => {
    try {
      const response = await fetch(`/api/get-accounts?experienceId=${experienceId}`);
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    // Remove @ if user included it
    const cleanUsername = username.replace('@', '').trim();

    if (!cleanUsername) {
      setError('Please enter a username');
      return;
    }

    // For MVP, limit to 1 account
    if (accounts.length >= 1) {
      setError('You can only monitor 1 account in the MVP version');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/add-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          experienceId,
          whopId: experienceId,
          addedBy: 'seller',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsername('');
        setSuccess(`Successfully added @${cleanUsername}!`);
        await loadAccounts();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add account');
      }
    } catch (err) {
      setError('Failed to add account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (accountId: string, accountUsername: string) => {
    if (!confirm(`Remove @${accountUsername} from monitoring?`)) return;

    try {
      const response = await fetch('/api/remove-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      if (response.ok) {
        setSuccess(`Removed @${accountUsername}`);
        await loadAccounts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to remove account');
      }
    } catch (err) {
      setError('Failed to remove account');
    }
  };

  if (initialLoading) {
    return (
      <Layout title="Settings">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-dark/60">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Add Account Section */}
        <div className="bg-white border-2 border-dark/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Add Twitter Account</h2>

          <form onSubmit={addAccount} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark mb-2">
                Twitter Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="elonmusk"
                disabled={loading || accounts.length >= 1}
                className="w-full px-4 py-3 border-2 border-dark/10 rounded-lg focus:outline-none focus:border-accent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-dark/50">
                Enter without the @ symbol. Example: elonmusk
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || accounts.length >= 1}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : accounts.length >= 1 ? 'Limit Reached (1 Account)' : 'Add Account'}
            </button>
          </form>
        </div>

        {/* Monitored Accounts Section */}
        <div className="bg-white border-2 border-dark/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-dark mb-4">
            Monitored Accounts ({accounts.length}/1)
          </h2>

          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-dark/60">No accounts monitored yet. Add one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border-2 border-dark/10 rounded-lg hover:border-accent/30 transition-colors"
                >
                  <div>
                    <p className="font-bold text-lg text-dark">@{account.username}</p>
                    {account.lastChecked && (
                      <p className="text-sm text-dark/50">
                        Last checked: {new Date(account.lastChecked).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeAccount(account.id, account.username)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-6">
          <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            How it works
          </h3>
          <ul className="space-y-2 text-sm text-dark/70">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Checks for new tweets every 60 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Members see new tweets in their feed within 10-30 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Completely free - no Twitter API costs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>MVP version limited to 1 monitored account</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
