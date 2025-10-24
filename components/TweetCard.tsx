import { formatDistanceToNow } from 'date-fns';

interface TweetCardProps {
  id: string;
  username: string;
  text: string;
  link: string;
  timestamp: string;
}

export default function TweetCard({ username, text, link, timestamp }: TweetCardProps) {
  return (
    <div className="bg-white border-2 border-dark/10 rounded-lg p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="text-accent font-bold text-lg">
              {username[0].toUpperCase()}
            </span>
          </div>
          <div>
            <a
              href={`https://twitter.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-dark hover:text-accent transition-colors"
            >
              @{username}
            </a>
            <p className="text-xs text-dark/50">
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      <p className="text-dark mb-4 leading-relaxed whitespace-pre-wrap">{text}</p>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        View on X
      </a>
    </div>
  );
}
