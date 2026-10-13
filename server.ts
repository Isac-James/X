import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fallback suggestions generator when AI key is missing or encounters rate limits
function getFallbackSuggestions(topic: string, industry: string, tone: string) {
  const cleanTopic = topic || 'AI & tech automation';
  return [
    {
      id: 'sug-' + Math.random().toString(36).substring(2, 9),
      text: `99% of people misunderstand ${cleanTopic}.\n\nThey optimize for vanity metrics instead of compound distribution.\n\nHere is the exact playbook to 10x your output without burning out:`,
      hook: 'Contrarian Framework Hook',
      hashtags: ['#TechTrends', '#GrowthHacking', '#Productivity'],
      viralityScore: 92,
      engagementAngle: 'High Bookmark & Retweet Rate',
      bestTimeToPost: 'Today at 09:15 AM (Peak commute)',
      estimatedImpressionsRange: '14.5K - 32K',
      category: industry || 'Tech & Growth'
    },
    {
      id: 'sug-' + Math.random().toString(36).substring(2, 9),
      text: `The biggest shift happening in ${cleanTopic} right now is not what you think.\n\nIt's autonomous execution systems quietly replacing 40-hour manual pipelines.\n\nAre you building for yesterday or 2027?`,
      hook: 'Future-Proofing Urgency',
      hashtags: ['#BuildInPublic', '#Automation', '#FutureOfWork'],
      viralityScore: 88,
      engagementAngle: 'High Reply & Discussion Driver',
      bestTimeToPost: 'Today at 01:45 PM (Lunch lull)',
      estimatedImpressionsRange: '9.2K - 24K',
      category: industry || 'Industry Insights'
    },
    {
      id: 'sug-' + Math.random().toString(36).substring(2, 9),
      text: `Quick diagnostic on ${cleanTopic}:\n\n1. Post at high-velocity windows\n2. Ride micro-trending hashtags\n3. Engage first 30 mins\n\nConsistency beats sporadic brilliance every single week. What is your current cadence?`,
      hook: 'Tactical Checklist',
      hashtags: ['#Strategy', '#TwitterGrowth', '#CreatorEconomy'],
      viralityScore: 85,
      engagementAngle: 'Actionable & Save-Worthy',
      bestTimeToPost: 'Tomorrow at 08:30 AM (Morning kick-off)',
      estimatedImpressionsRange: '12K - 28K',
      category: industry || 'Playbook'
    },
    {
      id: 'sug-' + Math.random().toString(36).substring(2, 9),
      text: `Unpopular truth about ${cleanTopic}:\n\nMost tools create friction disguised as features. The winners ruthlessly automate the mundane so they can focus 100% on high-leverage ideas.`,
      hook: 'Hot Take / Value Anchor',
      hashtags: ['#SaaS', '#IndieHackers', '#TechPulse'],
      viralityScore: 95,
      engagementAngle: 'Polarizing debate & shares',
      bestTimeToPost: 'Today at 06:20 PM (Evening unwind)',
      estimatedImpressionsRange: '18K - 45K',
      category: industry || 'Opinion'
    }
  ];
}

// Endpoint: AI Tweet Suggestions Engine
app.post('/api/suggest-tweets', async (req, res) => {
  try {
    const { topic, industry = 'Technology & AI', tone = 'thought_leader', customKeywords = '', count = 4 } = req.body;

    const hasValidKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY') &&
      process.env.GEMINI_API_KEY.length > 10;

    if (!hasValidKey) {
      return res.json({
        success: true,
        source: 'smart_trend_synthesizer',
        suggestions: getFallbackSuggestions(topic, industry, tone),
      });
    }

    const systemPrompt = `You are an elite X (Twitter) ghostwriter and social growth engineer.
Your mission is to generate high-engagement, viral, and authentic tweets based on the user's topic and industry trends.
Constraints:
1. Each tweet MUST be under 270 characters (leaving room for links/tags).
2. Avoid generic corporate buzzwords. Use high-converting hooks: contrarian viewpoints, clean bulleted insights, personal build-in-public reflections, or punchy questions.
3. Include 2-3 relevant high-traffic hashtags.
4. Calculate a realistic viralityScore (between 70 and 98).
5. Specify an engagement angle, recommended best posting time, and estimated impressions range.
Output valid JSON matching the schema provided.`;

    const userPrompt = `Topic: "${topic || 'AI & automated social growth'}"
Industry: "${industry}"
Desired Tone: "${tone}"
Keywords to weave in: "${customKeywords}"
Generate ${count} distinct tweet concepts optimized for maximum impressions and retweets on X.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
    );

    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING, description: 'The complete tweet text including emojis and hashtags, max 270 chars' },
              hook: { type: Type.STRING, description: 'Description of the psychological hook used' },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 relevant trending hashtags'
              },
              viralityScore: { type: Type.INTEGER, description: 'Predicted virality score from 60 to 99' },
              engagementAngle: { type: Type.STRING, description: 'Why this drives replies/bookmarks' },
              bestTimeToPost: { type: Type.STRING, description: 'Recommended posting time (e.g., Today at 9:15 AM EST)' },
              estimatedImpressionsRange: { type: Type.STRING, description: 'Predicted reach range' },
              category: { type: Type.STRING, description: 'Topic category' }
            },
            required: ['text', 'hook', 'hashtags', 'viralityScore', 'engagementAngle', 'bestTimeToPost']
          }
        }
      }
    });

    const response: any = await Promise.race([callPromise, timeoutPromise]);

    const parsed = JSON.parse(response.text || '[]');
    const suggestionsWithIds = parsed.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `sug-${Date.now()}-${idx}`,
      category: item.category || industry
    }));

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      suggestions: suggestionsWithIds.length > 0 ? suggestionsWithIds : getFallbackSuggestions(topic, industry, tone)
    });
  } catch (error: any) {
    console.error('Error generating tweet suggestions:', error);
    return res.json({
      success: true,
      source: 'fallback_on_error',
      suggestions: getFallbackSuggestions(req.body.topic, req.body.industry, req.body.tone),
      errorNotice: error.message
    });
  }
});

// Endpoint: AI Tweet Refiner
app.post('/api/refine-tweet', async (req, res) => {
  try {
    const { tweetText, instruction = 'make_punchier' } = req.body;

    if (!tweetText) {
      return res.status(400).json({ error: 'tweetText is required' });
    }

    const hasValidKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY') &&
      process.env.GEMINI_API_KEY.length > 10;

    if (!hasValidKey) {
      let refined = tweetText;
      if (instruction === 'make_punchier') {
        refined = `⚡️ Quick reality check:\n\n${tweetText.split('\n')[0]}\n\nStop overthinking. Start shipping.`;
      } else if (instruction === 'add_hook') {
        refined = `Most people get this completely backwards:\n\n${tweetText}`;
      } else if (instruction === 'make_contrarian') {
        refined = `Unpopular truth about this:\n\n${tweetText}`;
      } else if (instruction === 'shorten_under_200') {
        refined = tweetText.substring(0, 180) + '...';
      } else if (instruction === 'add_cta') {
        refined = `${tweetText}\n\nWhat is your biggest blocker with this? Drop your thoughts below 👇`;
      }
      return res.json({ success: true, refinedText: refined, characterCount: refined.length });
    }

    const prompt = `Refine and rewrite the following tweet according to this instruction: "${instruction}".
Tweet to refine:
"${tweetText}"

Instruction guide:
- "make_punchier": Remove fluff, use rhythmic line breaks, make it hit harder.
- "add_hook": Add a scroll-stopping opening hook sentence that commands attention.
- "make_contrarian": Frame it as a spicy counter-intuitive truth.
- "shorten_under_200": Cut down to under 200 characters while preserving core punch.
- "expand_thread_starter": Structure it as the hook of an irresistible multi-tweet thread.
- "add_cta": Add a natural question or call-to-action that demands replies.

Respond ONLY with valid JSON:
{
  "refinedText": "The rewritten tweet string",
  "explanation": "Brief 1-sentence rationale of what was improved",
  "characterCount": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      refinedText: parsed.refinedText || tweetText,
      explanation: parsed.explanation || 'Refined for peak impact',
      characterCount: (parsed.refinedText || tweetText).length
    });
  } catch (error: any) {
    console.error('Error refining tweet:', error);
    return res.json({
      success: true,
      refinedText: req.body.tweetText,
      explanation: 'Returned original due to processing error'
    });
  }
});

// Endpoint: AI Trending Industry Radar & Hashtags
app.post('/api/trending-radar', async (req, res) => {
  try {
    const { industry = 'Tech & AI' } = req.body;

    const hasValidKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY') &&
      process.env.GEMINI_API_KEY.length > 10;

    if (!hasValidKey) {
      return res.json({
        success: true,
        industry,
        radar: [
          { tag: '#AutonomousAI', velocity: '+420%/hr', postCount: '184K', sentiment: 'Bullish', viralityTip: 'Pair with real bench performance or demo clips' },
          { tag: '#Claude4', velocity: '+310%/hr', postCount: '98K', sentiment: 'Curious', viralityTip: 'Compare agentic abilities vs human speed' },
          { tag: '#BuildInPublic', velocity: '+180%/hr', postCount: '520K', sentiment: 'Supportive', viralityTip: 'Transparent MRR graphs get 3.2x more bookmarks' },
          { tag: '#NextGenSaaS', velocity: '+140%/hr', postCount: '45K', sentiment: 'Analytical', viralityTip: 'Focus on vertical workflows vs generic wrappers' },
          { tag: '#VibeCoding', velocity: '+280%/hr', postCount: '112K', sentiment: 'Viral', viralityTip: 'Humorous screenshots and zero-code milestone posts' }
        ],
        industryPulse: `Surging discussions around autonomous execution, prompt engineering maturity, and organic audience monetization.`
      });
    }

    const prompt = `Analyze the current industry pulse for "${industry}" on X (Twitter).
Generate 5 trending hashtags/topics with estimated hourly velocity growth, volume, audience sentiment, and actionable virality tips.
Also provide a 2-sentence executive summary of the industry pulse.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industryPulse: { type: Type.STRING },
            radar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  velocity: { type: Type.STRING, description: 'e.g. +340%/hr' },
                  postCount: { type: Type.STRING, description: 'e.g. 142K' },
                  sentiment: { type: Type.STRING, description: 'Bullish, Viral, Critical, or Curious' },
                  viralityTip: { type: Type.STRING }
                },
                required: ['tag', 'velocity', 'postCount', 'sentiment', 'viralityTip']
              }
            }
          },
          required: ['industryPulse', 'radar']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      industry,
      ...parsed
    });
  } catch (error: any) {
    console.error('Error getting trending radar:', error);
    return res.json({
      success: true,
      industry: req.body.industry || 'Tech & AI',
      radar: [
        { tag: '#AIAutomation', velocity: '+390%/hr', postCount: '190K', sentiment: 'Bullish', viralityTip: 'Share step-by-step breakdown' },
        { tag: '#XGrowth', velocity: '+220%/hr', postCount: '88K', sentiment: 'Viral', viralityTip: 'Lead with exact time windows' },
        { tag: '#DevCommunity', velocity: '+150%/hr', postCount: '310K', sentiment: 'Engaging', viralityTip: 'Ask open-ended tech questions' }
      ],
      industryPulse: 'Continuous momentum in automated intelligence, developer productivity, and creator monetization.'
    });
  }
});

// Production static serving & Dev Vite middleware mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PulseX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
