export interface XAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  totalTweets: number;
  monthlyImpressions: number;
  avgEngagementRate: number;
  isConnected: boolean;
  connectedAt: string;
  tier: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  apiStatus: 'active' | 'rate_limited' | 'disconnected';
  autoPilotEnabled: boolean;
}

export interface PostItem {
  id: string;
  content: string;
  hashtags: string[];
  mediaUrl?: string;
  scheduledFor: string; // ISO date string
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  publishedAt?: string;
  category?: string;
  viralityScore?: number;
  // Performance metrics (for published posts)
  metrics?: {
    impressions: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
    profileClicks: number;
    engagementRate: number;
  };
}

export interface TweetSuggestion {
  id: string;
  text: string;
  hook: string;
  hashtags: string[];
  viralityScore: number;
  engagementAngle: string;
  bestTimeToPost: string;
  estimatedImpressionsRange: string;
  category: string;
}

export interface TrendingHashtag {
  tag: string;
  velocity: string; // e.g. "+340%/hr"
  postCount: string; // e.g. "184K"
  sentiment: 'Bullish' | 'Viral' | 'Curious' | 'Supportive' | 'Critical' | 'Analytical';
  viralityTip: string;
  industry: string;
}

export interface FollowerDataPoint {
  date: string;
  followers: number;
  netGain: number;
  impressions: number;
  engagementScore: number;
}

export interface AutoPostIntervalConfig {
  intervalHours: number; // e.g. 2, 4, 6
  intervalMinutes: number; // 0, 30, etc.
  postingWindowStart: string; // "08:00"
  postingWindowEnd: string; // "23:00"
  timezone: string;
  autoHashtagInjection: boolean;
  maxDailyPosts: number;
  smartPeakTimeAdjustment: boolean;
  daysActive: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  action: 'auto_post_published' | 'queue_refilled' | 'interval_triggered' | 'trend_applied';
  status: 'success' | 'warning' | 'error';
  details: string;
  tweetPreview?: string;
  engagementEstimate?: string;
}
