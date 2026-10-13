import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService, GenerateTweetParams } from '../services/api';
import { TweetSuggestion } from '../types';
import {
  Sparkles,
  Zap,
  Flame,
  Clock,
  Send,
  PlusCircle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Wand2,
  TrendingUp,
  Tag,
  Share2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

const presetTopics = [
  { topic: 'Autonomous AI agents replacing manual dev pipelines', industry: 'Tech & AI' },
  { topic: 'Why 90% of SaaS founders fail at audience distribution', industry: 'SaaS & Startups' },
  { topic: 'Vibe coding vs traditional software engineering in 2026', industry: 'Tech & AI' },
  { topic: 'How to gain 10k engaged X followers without engagement pods', industry: 'Marketing & Growth' },
  { topic: 'On-chain AI agents with autonomous crypto wallets', industry: 'Web3 & Crypto' },
];

const toneOptions = [
  { id: 'thought_leader', label: 'Thought Leader', icon: '🚀', desc: 'Authoritative, forward-looking' },
  { id: 'spicy_contrarian', label: 'Spicy / Contrarian', icon: '🔥', desc: 'Challenging consensus beliefs' },
  { id: 'actionable_framework', label: 'Actionable Framework', icon: '📚', desc: 'Step-by-step numbered breakdown' },
  { id: 'data_case_study', label: 'Data & Case Study', icon: '📊', desc: 'Numbers, metrics, percentages' },
  { id: 'minimalist', label: 'Minimalist Punchy', icon: '⚡', desc: 'Under 180 chars, hard-hitting' },
  { id: 'reply_magnet', label: 'Reply Magnet', icon: '💬', desc: 'Questions that demand responses' },
];

const industryOptions = [
  'Tech & AI',
  'SaaS & Startups',
  'Web3 & Crypto',
  'Marketing & Growth',
  'Design & UX',
  'Finance & Investing',
];

export const AiSuggestionEngine: React.FC = () => {
  const { addPostToQueue, openComposer, publishPostNow, addToast } = useApp();

  const [topic, setTopic] = useState('Autonomous AI agents replacing manual dev pipelines');
  const [industry, setIndustry] = useState('Tech & AI');
  const [tone, setTone] = useState('thought_leader');
  const [customKeywords, setCustomKeywords] = useState('agentic workflows, speed, leverage');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TweetSuggestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [engineSource, setEngineSource] = useState<string>('gemini-3.8-flash');

  // Initial load
  useEffect(() => {
    handleGenerateSuggestions();
  }, []);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getTweetSuggestions({
        topic,
        industry,
        tone,
        customKeywords,
        count: 4,
      });

      setSuggestions(res.suggestions);
      setEngineSource(res.source);

      if (res.suggestions.length > 0) {
        addToast({
          type: 'success',
          title: 'New Suggestions Generated',
          message: `Created 4 trend-aligned tweets tailored for ${industry}.`,
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Generation Error',
        message: err.message || 'Could not generate suggestions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Tweet ready to paste anywhere.',
    });
  };

  const handleRefine = async (
    suggestionId: string,
    currentText: string,
    instruction: 'make_punchier' | 'add_hook' | 'make_contrarian' | 'shorten_under_200' | 'add_cta'
  ) => {
    setRefiningId(suggestionId);
    try {
      const res = await apiService.refineTweet({
        tweetText: currentText,
        instruction,
      });

      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestionId
            ? {
                ...s,
                text: res.refinedText,
                hook: `Refined (${instruction.replace(/_/g, ' ')})`,
                viralityScore: Math.min(99, s.viralityScore + 3),
              }
            : s
        )
      );

      addToast({
        type: 'success',
        title: 'Tweet Refined with AI ✨',
        message: res.explanation || 'Updated text for higher viral potential.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Refinement Failed',
        message: 'Could not refine text at this moment.',
      });
    } finally {
      setRefiningId(null);
    }
  };

  const handleAddToSchedule = (item: TweetSuggestion) => {
    addPostToQueue({
      content: item.text,
      hashtags: item.hashtags,
      category: item.category,
      viralityScore: item.viralityScore,
      scheduledFor: '', // automatically allocated next interval slot
    });
  };

  const handleOpenInXIntent = (item: TweetSuggestion) => {
    const fullText = `${item.text}\n\n${item.hashtags.join(' ')}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-zinc-900 to-zinc-900 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-sky-500/20 text-sky-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
                AI Content Engine • Powered by Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trend-Driven Tweet Drafting Engine
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1">
              Give PulseX your focus topics and industry trends. The engine synthesizes psychological hooks,
              optimal time windows, and engagement tags to draft scroll-stopping tweets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Model: {engineSource}
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel: Topics, Industry & Tone */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Topic or Thesis
          </label>
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors resize-none shadow-inner"
              placeholder="e.g. How we replaced 10 hours of manual QA with autonomous AI agents..."
            />
            <div className="absolute right-3 bottom-3 text-[11px] text-zinc-500">
              {topic.length} chars
            </div>
          </div>
        </div>

        {/* Quick presets pills */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1 mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Trending Industry Prompts (1-Click Fill):
          </span>
          <div className="flex flex-wrap gap-2">
            {presetTopics.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(preset.topic);
                  setIndustry(preset.industry);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all text-left truncate max-w-xs"
              >
                {preset.topic}
              </button>
            ))}
          </div>
        </div>

        {/* Industry & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Industry Vertical
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
            >
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Keywords to Weave In (Optional)
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="e.g. leverage, 10x, automation, ROI"
            />
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Desired Tone & Psychological Hook
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {toneOptions.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-white shadow-md shadow-sky-500/10'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-base mb-1">{t.icon}</div>
                  <div className="text-xs font-bold leading-tight">{t.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-zinc-500 hidden sm:block">
            Gemini creates 4 distinct angles with predicted engagement ratings.
          </p>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isLoading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 active:scale-95 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing with Gemini...' : 'Generate 4 Tweet Concepts'}</span>
          </button>
        </div>
      </div>

      {/* Output Suggestions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Generated Tweet Concepts</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {suggestions.length} Drafts Ready
            </span>
          </h3>
          <span className="text-xs text-zinc-400">Click &quot;Add to Auto-Schedule&quot; to queue onto cadence</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-zinc-800 rounded w-28" />
                  <div className="h-4 bg-zinc-800 rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-zinc-800 rounded w-full" />
                  <div className="h-3.5 bg-zinc-800 rounded w-5/6" />
                  <div className="h-3.5 bg-zinc-800 rounded w-4/6" />
                </div>
                <div className="h-8 bg-zinc-800/80 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((item) => {
              const charCount = item.text.length;
              const isOver = charCount > 280;
              const isRefining = refiningId === item.id;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-zinc-900/90 hover:border-zinc-700 transition-all p-5 shadow-lg"
                >
                  {/* Top Bar: Hook & Virality Score */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 truncate max-w-[200px]">
                        {item.hook}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{item.viralityScore}/100</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {charCount}/280
                        </span>
                      </div>
                    </div>

                    {/* Tweet Text Content */}
                    <div className="relative mb-4">
                      {isRefining ? (
                        <div className="py-8 text-center text-xs text-sky-400 flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Polishing draft with Gemini...
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-100 whitespace-pre-line leading-relaxed font-normal selection:bg-sky-500 selection:text-white">
                          {item.text}
                        </p>
                      )}
                    </div>

                    {/* Hashtags Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.hashtags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-500/5 px-2 py-0.5 rounded-md border border-sky-500/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Smart Scheduling Advice */}
                    <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 mb-4 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>Best Window:</span>
                        <span className="text-zinc-200">{item.bestTimeToPost}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400 text-[10px]">
                        <span>Est. Impressions: {item.estimatedImpressionsRange}</span>
                        <span className="text-emerald-400 font-medium">{item.engagementAngle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    {/* AI Quick Refine Buttons */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-sky-400" />
                        Refine:
                      </span>
                      <button
                        onClick={() => handleRefine(item.id, item.text, 'make_punchier')}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
                      >
                        ⚡ Punchier
                      </button>
                      <button
                        onClick={() => handleRefine(item.id, item.text, 'add_hook')}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
                      >
                        🪝 Stronger Hook
                      </button>
                      <button
                        onClick={() => handleRefine(item.id, item.text, 'make_contrarian')}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
                      >
                        🔥 Contrarian
                      </button>
                      <button
                        onClick={() => handleRefine(item.id, item.text, 'add_cta')}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
                      >
                        💬 Add Reply CTA
                      </button>
                    </div>

                    {/* Primary Execution Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(item.text, item.id)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Copy tweet"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => openComposer(item.text, item.hashtags)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit in live composer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleOpenInXIntent(item)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
                          title="Open directly in X Web Intent"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>𝕏 Intent</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToSchedule(item)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 active:scale-95 shadow-md shadow-sky-500/20 rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add to Queue</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
