import { TweetSuggestion, TrendingHashtag } from '../types';

export interface GenerateTweetParams {
  topic: string;
  industry: string;
  tone: string;
  customKeywords?: string;
  count?: number;
}

export interface RefineTweetParams {
  tweetText: string;
  instruction: 'make_punchier' | 'add_hook' | 'make_contrarian' | 'shorten_under_200' | 'expand_thread_starter' | 'add_cta';
}

export const apiService = {
  async getTweetSuggestions(params: GenerateTweetParams): Promise<{
    suggestions: TweetSuggestion[];
    source: string;
    errorNotice?: string;
  }> {
    try {
      const response = await fetch('/api/suggest-tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        suggestions: data.suggestions || [],
        source: data.source || 'gemini-3.8-flash',
        errorNotice: data.errorNotice,
      };
    } catch (error: any) {
      console.warn('API fetch failed, falling back to local client generation:', error);
      return {
        suggestions: [
          {
            id: 'fallback-1',
            text: `Most builders in ${params.topic || 'tech'} overcomplicate distribution.\n\n3 things that actually move the needle:\n1. 1 hyper-relevant insight every 4 hours\n2. Riding surging hashtag velocity\n3. Ruthless iteration based on bookmark rate\n\nWhat is your biggest blocker today?`,
            hook: 'Simplification Playbook',
            hashtags: ['#BuildInPublic', '#TechTrends', '#CreatorEconomy'],
            viralityScore: 91,
            engagementAngle: 'High bookmark to like ratio',
            bestTimeToPost: 'Today at 09:30 AM',
            estimatedImpressionsRange: '12K - 28K',
            category: params.industry,
          },
          {
            id: 'fallback-2',
            text: `Contrarian take on ${params.topic || 'industry trends'}:\n\nIf your post doesn't make at least 15% of your industry disagree, you're not leading a conversation—you're just echoing it.`,
            hook: 'Spicy Contrarian Stance',
            hashtags: ['#ThoughtLeadership', '#Growth', '#Strategy'],
            viralityScore: 96,
            engagementAngle: 'High reply and quote tweet density',
            bestTimeToPost: 'Today at 01:15 PM',
            estimatedImpressionsRange: '20K - 55K',
            category: params.industry,
          },
        ],
        source: 'local_client_fallback',
        errorNotice: error.message,
      };
    }
  },

  async refineTweet(params: RefineTweetParams): Promise<{
    refinedText: string;
    explanation?: string;
    characterCount?: number;
  }> {
    try {
      const response = await fetch('/api/refine-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        refinedText: data.refinedText || params.tweetText,
        explanation: data.explanation,
        characterCount: data.characterCount,
      };
    } catch (error: any) {
      console.warn('Refine API failed:', error);
      let fallbackText = params.tweetText;
      if (params.instruction === 'make_punchier') {
        fallbackText = `⚡️ Quick takeaway:\n\n${params.tweetText.split('\n')[0]}\n\nExecute fast. Iterate faster.`;
      } else if (params.instruction === 'add_hook') {
        fallbackText = `Nobody in tech is talking about this yet:\n\n${params.tweetText}`;
      } else if (params.instruction === 'make_contrarian') {
        fallbackText = `Unpopular opinion:\n\n${params.tweetText}`;
      } else if (params.instruction === 'add_cta') {
        fallbackText = `${params.tweetText}\n\nAgree or disagree? Drop your take below 👇`;
      }
      return {
        refinedText: fallbackText,
        explanation: 'Local refinement applied',
        characterCount: fallbackText.length,
      };
    }
  },

  async getTrendingRadar(industry: string): Promise<{
    radar: TrendingHashtag[];
    industryPulse: string;
  }> {
    try {
      const response = await fetch('/api/trending-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        radar: data.radar || [],
        industryPulse: data.industryPulse || 'High engagement velocity detected in tech automation.',
      };
    } catch (error) {
      console.warn('Trending radar API failed:', error);
      return {
        radar: [
          { tag: '#AutonomousAI', velocity: '+420%/hr', postCount: '184K', sentiment: 'Bullish', viralityTip: 'Pair with live execution demonstrations', industry },
          { tag: '#Claude4', velocity: '+310%/hr', postCount: '98K', sentiment: 'Curious', viralityTip: 'Highlight real workflow speedups', industry },
          { tag: '#BuildInPublic', velocity: '+180%/hr', postCount: '520K', sentiment: 'Supportive', viralityTip: 'Metric transparency yields 3x more bookmarks', industry },
          { tag: '#NextGenSaaS', velocity: '+140%/hr', postCount: '45K', sentiment: 'Analytical', viralityTip: 'Focus on vertical autonomous systems', industry },
          { tag: '#VibeCoding', velocity: '+280%/hr', postCount: '112K', sentiment: 'Viral', viralityTip: 'Humorous screenshots and zero-code milestone posts', industry },
        ],
        industryPulse: 'Surging discussions around autonomous execution, prompt engineering maturity, and organic audience monetization.',
      };
    }
  },
};
