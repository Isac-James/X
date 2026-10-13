import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Plus,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Send,
  Hash,
  Flame,
  BadgeCheck,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    account,
    queue,
    publishedPosts,
    intervalConfig,
    secondsUntilNextPost,
    toggleAutoPilot,
    triggerAutoPilotIntervalSimulation,
    openComposer,
    setActiveTab,
    setSelectedPostForAnalytics,
    publishPostNow,
  } = useApp();

  const [quickTopic, setQuickTopic] = useState('');

  const nextPost = queue[0];

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQuickDraft = () => {
    if (quickTopic.trim()) {
      openComposer(`🔥 Hot take on ${quickTopic}:\n\n`, ['#TechTrends', '#BuildInPublic']);
    } else {
      openComposer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Cockpit */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Zap className="w-3.5 h-3.5" />
                PulseX Command Center
              </span>
              <span className="text-xs text-zinc-400">
                Connected to <strong className="text-white">@{account.username}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Automated X Posting & Engagement Engine
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Your autonomous publishing cadence is active. PulseX optimizes time intervals, injects
              trending hashtags, and uses Gemini to maximize impressions and follower conversion.
            </p>
          </div>

          {/* Quick Metrics Tile */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-zinc-900/90 border border-zinc-800/90 p-4 rounded-2xl shadow-xl">
            <div className="p-3 text-center min-w-[110px]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                Followers
              </span>
              <span className="text-xl font-black text-white block mt-0.5">
                {account.followerCount.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-emerald-400">+180 today</span>
            </div>

            <div className="w-px h-10 bg-zinc-800 hidden sm:block" />

            <div className="p-3 text-center min-w-[110px]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                Interval Cadence
              </span>
              <span className="text-xl font-black text-sky-400 block mt-0.5">
                Every {intervalConfig.intervalHours}h
              </span>
              <span className="text-[10px] text-zinc-400">
                {queue.length} in queue
              </span>
            </div>

            <div className="w-px h-10 bg-zinc-800 hidden sm:block" />

            <div className="p-3 text-center min-w-[110px]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                Next Post
              </span>
              <span className="text-xl font-mono font-black text-cyan-400 block mt-0.5">
                {formatCountdown(secondsUntilNextPost)}
              </span>
              <button
                onClick={triggerAutoPilotIntervalSimulation}
                className="text-[10px] font-bold text-sky-400 hover:text-sky-300 underline"
              >
                Fire Now ⚡
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick AI Drafting Prompt Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-sky-400 shrink-0">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">
            Fast AI Draft:
          </span>
        </div>
        <input
          type="text"
          value={quickTopic}
          onChange={(e) => setQuickTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuickDraft()}
          placeholder="Enter a topic or trend (e.g. Autonomous AI workflows, $10k MRR bootstrapping, X algorithm shifts)..."
          className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleQuickDraft}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Draft</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_engine')}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all whitespace-nowrap"
          >
            Full AI Engine →
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Next Up vs Trending Radar Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Post in Queue (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Next Automated Post Scheduled</span>
            </h3>
            <button
              onClick={() => setActiveTab('scheduler')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              View Full Queue ({queue.length}) →
            </button>
          </div>

          {nextPost ? (
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-sky-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Slated for Broadcast
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {new Date(nextPost.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Virality: {nextPost.viralityScore || 92}/100
                </div>
              </div>

              <p className="text-sm text-zinc-100 whitespace-pre-line leading-relaxed font-normal">
                {nextPost.content}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {nextPost.hashtags.map((h, i) => (
                  <span key={i} className="text-xs font-medium text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded">
                    {h}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 gap-2">
                <span className="text-xs text-zinc-400">
                  Countdown: <strong className="text-white font-mono">{formatCountdown(secondsUntilNextPost)}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openComposer(nextPost.content, nextPost.hashtags, nextPost.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                  >
                    Edit Draft
                  </button>

                  <button
                    onClick={() => publishPostNow(nextPost.id, true)}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Publish Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-3">
              <p className="text-sm text-zinc-400">Queue is empty. Next auto-post cannot execute.</p>
              <button
                onClick={() => setActiveTab('ai_engine')}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Generate 4 Posts with AI
              </button>
            </div>
          )}

          {/* Recent Published Posts Spotlight */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Broadcast Performance
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                Detailed Analytics →
              </button>
            </div>

            <div className="space-y-2.5">
              {publishedPosts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPostForAnalytics(p)}
                  className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 truncate">{p.content}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Today'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{p.metrics?.engagementRate}% Eng Rate</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white block">
                      {p.metrics?.impressions.toLocaleString()} views
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">
                      {p.metrics?.bookmarks} saves
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Trending Hashtag Radar Preview & Quick Controls */}
        <div className="space-y-6">
          {/* Trending Spotlight */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Surging Hashtag Radar
              </h3>
              <button
                onClick={() => setActiveTab('trends')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                All Trends →
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { tag: '#AutonomousAI', velocity: '+420%/hr', vol: '194K' },
                { tag: '#Claude4', velocity: '+310%/hr', vol: '112K' },
                { tag: '#BuildInPublic', velocity: '+180%/hr', vol: '520K' },
                { tag: '#VibeCoding', velocity: '+290%/hr', vol: '145K' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white font-mono">{item.tag}</span>
                    <span className="text-[10px] text-zinc-500 block">{item.vol} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {item.velocity}
                    </span>
                    <button
                      onClick={() => openComposer('', [item.tag])}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      title="Draft with tag"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cadence Control Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              Interval Automation Control
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Auto-Pilot Status:</span>
                <span className={`font-bold ${account.autoPilotEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {account.autoPilotEnabled ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Current Cadence:</span>
                <span className="text-white font-mono font-bold">Every {intervalConfig.intervalHours} hours</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Hashtag Auto-Injection:</span>
                <span className="text-sky-400 font-bold">
                  {intervalConfig.autoHashtagInjection ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Timezone:</span>
                <span className="text-zinc-300">{intervalConfig.timezone}</span>
              </div>

              <button
                onClick={toggleAutoPilot}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  account.autoPilotEnabled
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {account.autoPilotEnabled ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Automation
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Resume Automation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
