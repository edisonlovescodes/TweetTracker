export interface Tweet {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  link: string;
}

export interface MonitoredAccount {
  id: string;
  username: string;
  whopId: string;
  experienceId: string;
  lastTweetId?: string;
  lastChecked?: Date;
  addedAt: Date;
  addedBy: string;
}

export interface StoredTweet {
  id: string;
  username: string;
  text: string;
  link: string;
  timestamp: Date;
  whopId: string;
  experienceId: string;
  notifiedAt: Date;
}
