import { XAccount, PostItem, FollowerDataPoint, AutoPostIntervalConfig, AutomationLog, TrendingHashtag } from '../types';

export const initialAccount: XAccount = {
  id: 'x-acc-001',
  username: 'tumininu_tech',
  displayName: 'Tumininu Aiyegbusi ⚡️',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  bio: 'Building autonomous software systems & sharing high-leverage frameworks. Scaling audience via data & consistency. 🚀',
  isVerified: true,
  followerCount: 14890,
  followingCount: 642,
  totalTweets: 1248,
  monthlyImpressions: 482500,
  avgEngagementRate: 4.82,
  isConnected: true,
  connectedAt: '2026-09-01T10:00:00Z',
  tier: 'Premium',
  apiStatus: 'active',
  autoPilotEnabled: true,
};

export const initialIntervalConfig: AutoPostIntervalConfig = {
  intervalHours: 3,
  intervalMinutes: 0,
  postingWindowStart: '08:30',
  postingWindowEnd: '22:30',
  timezone: 'EST (UTC-5)',
  autoHashtagInjection: true,
  maxDailyPosts: 5,
  smartPeakTimeAdjustment: true,
  daysActive: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const initialQueue: PostItem[] = [
  {
    id: 'post-q-1',
    content: 'The biggest lie in developer productivity is "just work faster".\n\nThe real leverage is building autonomous pipelines that handle execution while you focus purely on decision-making.\n\nAutomate the repetitive. Compound the unique.',
    hashtags: ['#Automation', '#BuildInPublic', '#DevProductivity'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * 42).toISOString(), // in 42 mins
    status: 'scheduled',
    category: 'Engineering & Leverage',
    viralityScore: 94,
  },
  {
    id: 'post-q-2',
    content: 'Why micro-trends beat broad industry topics on X:\n\nBroad topic: "AI is the future" (0.4% CTR)\nMicro-trend: "How we replaced 3 Zapier zaps with 1 local agentic script" (6.8% CTR)\n\nSpecificity builds authority. Generalities build noise.',
    hashtags: ['#AgenticWorkflows', '#TechTrends', '#XGrowth'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * (42 + 180)).toISOString(), // in 3h 42m
    status: 'scheduled',
    category: 'Content Strategy',
    viralityScore: 89,
  },
  {
    id: 'post-q-3',
    content: '3 non-negotiables for high-engagement posting cadence:\n\n1. Post at high-velocity commuter & lunch windows\n2. Hook in the first 7 words before the fold\n3. Reply to every quote tweet in the first 20 minutes\n\nWhat is your #1 growth lever right now?',
    hashtags: ['#SocialStrategy', '#TwitterGrowth', '#SaaS'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * (42 + 360)).toISOString(), // in 6h 42m
    status: 'scheduled',
    category: 'Engagement Playbook',
    viralityScore: 87,
  },
  {
    id: 'post-q-4',
    content: 'Unpopular truth:\n\nMost founders spend 40 hours building a feature and 4 minutes writing the launch post.\n\nFlip the ratio. Distribution isn\'t the aftermath; it is the product.',
    hashtags: ['#IndieHackers', '#FounderLessons', '#BuildInPublic'],
    scheduledFor: new Date(Date.now() + 1000 * 60 * (42 + 540)).toISOString(), // in 9h 42m
    status: 'scheduled',
    category: 'Founder Insights',
    viralityScore: 96,
  },
];

export const initialPublishedPosts: PostItem[] = [
  {
    id: 'pub-101',
    content: 'We ran an A/B test on 100 automated tweets.\n\nTweets scheduled at fixed 3-hour intervals with trending micro-tags had:\n• +184% more impressions\n• 3.2x higher bookmark rate\n• 42% lower unfollow rate\n\nCadence > sporadic bursts every time.',
    hashtags: ['#DataDriven', '#GrowthHacking', '#BuildInPublic'],
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'published',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    category: 'A/B Testing',
    viralityScore: 97,
    metrics: {
      impressions: 48920,
      likes: 1240,
      retweets: 382,
      replies: 164,
      bookmarks: 840,
      profileClicks: 512,
      engagementRate: 6.38,
    },
  },
  {
    id: 'pub-102',
    content: 'The most underrated skill in 2026: Being able to distill complex technical architecture into an irresistible 240-character insight.\n\nClear writing is clear thinking.',
    hashtags: ['#Engineering', '#Writing', '#Clarity'],
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    status: 'published',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    category: 'Thought Leadership',
    viralityScore: 92,
    metrics: {
      impressions: 31400,
      likes: 890,
      retweets: 210,
      replies: 89,
      bookmarks: 410,
      profileClicks: 320,
      engagementRate: 5.15,
    },
  },
  {
    id: 'pub-103',
    content: 'Framework for high-converting X threads:\n\n1. Hook: Agitate the hidden cost\n2. Context: Why traditional advice fails\n3. Playbook: Step 1 to Step 4\n4. Summary checklist\n5. Bookmark reminder\n\nBookmark this for your next draft 📌',
    hashtags: ['#Threads', '#ContentCreation', '#GrowthPlaybook'],
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    status: 'published',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    category: 'Frameworks',
    viralityScore: 95,
    metrics: {
      impressions: 62100,
      likes: 1840,
      retweets: 540,
      replies: 230,
      bookmarks: 1420,
      profileClicks: 740,
      engagementRate: 7.68,
    },
  },
  {
    id: 'pub-104',
    content: 'If you are building an audience from 0 to 10K:\n\nStop posting into the void. Instead, reply with genuine value under 10 high-traffic accounts in your niche every morning.\n\nBorrow distribution before you build distribution.',
    hashtags: ['#AudienceBuilding', '#TwitterGrowth', '#TechCommunity'],
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    status: 'published',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    category: 'Strategy',
    viralityScore: 88,
    metrics: {
      impressions: 22800,
      likes: 640,
      retweets: 140,
      replies: 62,
      bookmarks: 310,
      profileClicks: 195,
      engagementRate: 4.95,
    },
  },
  {
    id: 'pub-105',
    content: 'Automated our entire content pipeline using Gemini 3.8 Flash + interval scheduler.\n\nTime spent drafting: 15 mins/week.\nImpressions generated: 450K+.\n\nNever trade time for volume when machines do volume better.',
    hashtags: ['#AutonomousAI', '#Automation', '#BuildInPublic'],
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    status: 'published',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    category: 'Case Study',
    viralityScore: 93,
    metrics: {
      impressions: 54100,
      likes: 1520,
      retweets: 412,
      replies: 188,
      bookmarks: 960,
      profileClicks: 620,
      engagementRate: 6.84,
    },
  },
];

export const followerGrowthHistory: FollowerDataPoint[] = [
  { date: 'Sep 14', followers: 11200, netGain: 48, impressions: 14200, engagementScore: 4.1 },
  { date: 'Sep 17', followers: 11420, netGain: 72, impressions: 16800, engagementScore: 4.3 },
  { date: 'Sep 20', followers: 11690, netGain: 90, impressions: 21400, engagementScore: 4.5 },
  { date: 'Sep 23', followers: 12040, netGain: 115, impressions: 28900, engagementScore: 4.9 },
  { date: 'Sep 26', followers: 12450, netGain: 135, impressions: 32100, engagementScore: 5.1 },
  { date: 'Sep 29', followers: 12890, netGain: 146, impressions: 36400, engagementScore: 5.0 },
  { date: 'Oct 02', followers: 13380, netGain: 162, impressions: 41200, engagementScore: 5.4 },
  { date: 'Oct 05', followers: 13910, netGain: 178, impressions: 45600, engagementScore: 5.2 },
  { date: 'Oct 08', followers: 14350, netGain: 145, impressions: 42100, engagementScore: 4.9 },
  { date: 'Oct 11', followers: 14710, netGain: 120, impressions: 39800, engagementScore: 4.7 },
  { date: 'Oct 13', followers: 14890, netGain: 180, impressions: 48900, engagementScore: 5.6 },
];

export const initialAutomationLogs: AutomationLog[] = [
  {
    id: 'log-1',
    timestamp: '5 hours ago',
    action: 'auto_post_published',
    status: 'success',
    details: 'Automated post published on 3h interval trigger with trending tags #DataDriven #GrowthHacking',
    tweetPreview: 'We ran an A/B test on 100 automated tweets...',
    engagementEstimate: '48.9K impressions recorded',
  },
  {
    id: 'log-2',
    timestamp: '8 hours ago',
    action: 'trend_applied',
    status: 'success',
    details: 'Trending radar matched #AutonomousAI (+420%/hr velocity) and auto-injected into scheduled queue',
    engagementEstimate: 'Virality boost +35%',
  },
  {
    id: 'log-3',
    timestamp: '14 hours ago',
    action: 'auto_post_published',
    status: 'success',
    details: 'Automated post published on peak lunch engagement window',
    tweetPreview: 'The most underrated skill in 2026: Being able to distill...',
    engagementEstimate: '31.4K impressions recorded',
  },
  {
    id: 'log-4',
    timestamp: '1 day ago',
    action: 'queue_refilled',
    status: 'success',
    details: 'Gemini AI Suggestion Engine generated 4 top-tier drafts based on topic: Autonomous Systems',
    engagementEstimate: 'Queue buffered for 18h',
  },
];

export const trendingHashtagsByIndustry: Record<string, TrendingHashtag[]> = {
  'Tech & AI': [
    { tag: '#AutonomousAI', velocity: '+420%/hr', postCount: '194K', sentiment: 'Bullish', viralityTip: 'Pair with real workflow benchmark comparisons', industry: 'Tech & AI' },
    { tag: '#Claude4', velocity: '+310%/hr', postCount: '112K', sentiment: 'Curious', viralityTip: 'Contrast human developer hours vs agentic tool speeds', industry: 'Tech & AI' },
    { tag: '#BuildInPublic', velocity: '+180%/hr', postCount: '520K', sentiment: 'Supportive', viralityTip: 'MRR and conversion funnel transparency gets 3x saves', industry: 'Tech & AI' },
    { tag: '#VibeCoding', velocity: '+290%/hr', postCount: '145K', sentiment: 'Viral', viralityTip: 'Screenshots of rapid prototypes with concise takeaways', industry: 'Tech & AI' },
    { tag: '#AgenticWorkflows', velocity: '+240%/hr', postCount: '87K', sentiment: 'Bullish', viralityTip: 'Use a 3-step automation diagram or numbered sequence', industry: 'Tech & AI' },
  ],
  'SaaS & Startups': [
    { tag: '#SaaSGrowth', velocity: '+160%/hr', postCount: '78K', sentiment: 'Bullish', viralityTip: 'Highlight CAC reduction and organic referral loops', industry: 'SaaS & Startups' },
    { tag: '#MicroSaaS', velocity: '+210%/hr', postCount: '92K', sentiment: 'Supportive', viralityTip: 'Single-feature tools generating >$5k MRR inspire engagement', industry: 'SaaS & Startups' },
    { tag: '#Bootstrapped', velocity: '+130%/hr', postCount: '160K', sentiment: 'Supportive', viralityTip: 'Share hard lessons from early churn crises', industry: 'SaaS & Startups' },
    { tag: '#ProductLed', velocity: '+115%/hr', postCount: '41K', sentiment: 'Curious', viralityTip: 'Show onboarding screenshots that remove friction', industry: 'SaaS & Startups' },
  ],
  'Web3 & Crypto': [
    { tag: '#CryptoAI', velocity: '+380%/hr', postCount: '210K', sentiment: 'Bullish', viralityTip: 'Focus on on-chain AI agent wallets and settlement layers', industry: 'Web3 & Crypto' },
    { tag: '#DePIN', velocity: '+190%/hr', postCount: '65K', sentiment: 'Curious', viralityTip: 'Explain hardware yield vs traditional cloud compute', industry: 'Web3 & Crypto' },
    { tag: '#SolanaEcosystem', velocity: '+250%/hr', postCount: '340K', sentiment: 'Viral', viralityTip: 'Fast transaction speed analogies resonate well', industry: 'Web3 & Crypto' },
  ],
  'Marketing & Growth': [
    { tag: '#GrowthHacking', velocity: '+175%/hr', postCount: '310K', sentiment: 'Bullish', viralityTip: 'Include specific numbers: +184% vs +12%', industry: 'Marketing & Growth' },
    { tag: '#CopywritingTips', velocity: '+230%/hr', postCount: '140K', sentiment: 'Supportive', viralityTip: 'Before & After headline comparisons yield high bookmarking', industry: 'Marketing & Growth' },
    { tag: '#AudienceBuilding', velocity: '+195%/hr', postCount: '85K', sentiment: 'Curious', viralityTip: 'Share the exact reply strategy used to gain first 1,000 followers', industry: 'Marketing & Growth' },
  ]
};

// 7-day x 24-hour heatmap engagement values (0 - 100)
export const engagementHeatmap = [
  // Sunday
  [12, 8, 5, 4, 6, 15, 28, 42, 65, 78, 82, 84, 80, 75, 70, 68, 74, 85, 88, 86, 79, 64, 45, 25],
  // Monday
  [15, 9, 6, 5, 12, 35, 68, 88, 95, 92, 86, 89, 94, 88, 82, 79, 85, 96, 94, 88, 80, 62, 38, 20],
  // Tuesday
  [14, 8, 5, 4, 15, 40, 75, 94, 98, 96, 90, 92, 98, 91, 85, 84, 90, 99, 96, 89, 82, 65, 40, 22],
  // Wednesday
  [16, 9, 6, 5, 16, 42, 78, 96, 100, 98, 92, 94, 99, 93, 87, 85, 92, 98, 95, 90, 84, 68, 42, 24],
  // Thursday
  [15, 8, 5, 4, 14, 38, 74, 92, 97, 95, 89, 91, 96, 90, 84, 82, 89, 97, 94, 88, 81, 64, 39, 21],
  // Friday
  [14, 8, 5, 4, 12, 32, 65, 82, 88, 86, 82, 85, 88, 82, 76, 72, 78, 86, 84, 78, 72, 58, 36, 18],
  // Saturday
  [11, 7, 4, 3, 5, 12, 24, 38, 58, 72, 76, 79, 78, 74, 68, 65, 70, 80, 82, 80, 72, 55, 38, 20],
];
