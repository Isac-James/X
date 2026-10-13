import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { TrendingHashtag } from '../types';
import { trendingHashtagsByIndustry } from '../data/mockData';
import {
  TrendingUp,
  Hash,
  Flame,
  Zap,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Plus,
  BarChart2,
  Bookmark,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const TrendingRadar: React.FC = () => {
  const { openComposer, setActiveTab, addToast } = useApp();

  const industries = ['Tech & AI', 'SaaS & Startups', 'Web3 & Crypto', 'Marketing & Growth'];
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Tech & AI');
  const [radarItems, setRadarItems] = useState<TrendingHashtag[]>(trendingHashtagsByIndustry['Tech & AI']);
  const [industryPulse, setIndustryPulse] = useState<string>(
    'Surging discussions around autonomous execution, prompt engineering maturity, and organic audience monetization.'
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRadarForIndustry(selectedIndustry);
  }, [selectedIndustry]);

  const fetchRadarForIndustry = async (industry: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.getTrendingRadar(industry);
      if (res.radar && res.radar.length > 0) {
        setRadarItems(res.radar);
      } else {
        setRadarItems(trendingHashtagsByIndustry[industry] || trendingHashtagsByIndustry['Tech & AI']);
      }
      setIndustryPulse(res.industryPulse);
    } catch {
      setRadarItems(trendingHashtagsByIndustry[industry] || trendingHashtagsByIndustry['Tech & AI']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseHashtagInComposer = (tag: string) => {
    openComposer('', [tag]);
    addToast({
      type: 'info',
      title: 'Hashtag Loaded into Composer',
      message: `${tag} added to draft.`,
    });
  };

  const handleGenerateAroundTrend = (tag: string, tip: string) => {
    setActiveTab('ai_engine');
    addToast({
      type: 'info',
      title: 'Trend Context Switched',
      message: `Navigating to AI Engine to draft around ${tag}.`,
    });
  };

  // Mock historical hashtag performance for user's account
  const hashtagPerformance = [
    { tag: '#AutonomousAI', usedCount: 8, impressions: 168400, engRate: 6.8, viralityRank: 'S-Tier' },
    { tag: '#BuildInPublic', usedCount: 14, impressions: 242000, engRate: 6.2, viralityRank: 'S-Tier' },
    { tag: '#DataDriven', usedCount: 5, impressions: 89000, engRate: 5.9, viralityRank: 'A-Tier' },
    { tag: '#TwitterGrowth', usedCount: 9, impressions: 112000, engRate: 4.8, viralityRank: 'B-Tier' },
    { tag: '#SaaS', usedCount: 12, impressions: 145000, engRate: 5.1, viralityRank: 'A-Tier' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-sky-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                Real-Time Engagement Radar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trending Hashtags & Industry Velocity
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1">
              Maximize algorithmic reach by attaching surging micro-topics before they saturate.
              PulseX monitors hourly volume spikes to give your posts immediate lift.
            </p>
          </div>

          <button
            onClick={() => fetchRadarForIndustry(selectedIndustry)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Radar
          </button>
        </div>

        {/* Industry pulse card */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs">
          <span className="font-bold text-sky-400 mr-2 uppercase tracking-wider text-[10px]">
            AI Pulse Analysis:
          </span>
          <span className="text-zinc-300">{industryPulse}</span>
        </div>
      </div>

      {/* Industry Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedIndustry === ind
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Live Surging Hashtags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {radarItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-base font-black text-white hover:text-sky-400 transition-colors font-mono">
                  {item.tag}
                </span>

                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {item.velocity}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                <span>Volume: <strong className="text-zinc-200">{item.postCount}</strong></span>
                <span>•</span>
                <span>Sentiment: <strong className="text-zinc-200">{item.sentiment}</strong></span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Virality Playbook:
                </span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">{item.viralityTip}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 gap-2">
              <button
                onClick={() => handleUseHashtagInComposer(item.tag)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Use Tag
              </button>

              <button
                onClick={() => handleGenerateAroundTrend(item.tag, item.viralityTip)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Draft with AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Hashtag Performance Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Your Top Performing Hashtags (Historical ROI)
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Based on past 30 days published tweets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-500 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Hashtag</th>
                <th className="py-3 px-4">Times Used</th>
                <th className="py-3 px-4">Total Impressions</th>
                <th className="py-3 px-4">Avg Engagement Rate</th>
                <th className="py-3 px-4">Virality Tier</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {hashtagPerformance.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-400">{row.tag}</td>
                  <td className="py-3 px-4 text-zinc-400 font-sans">{row.usedCount} posts</td>
                  <td className="py-3 px-4 text-white">{row.impressions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{row.engRate}%</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {row.viralityRank}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => handleUseHashtagInComposer(row.tag)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Draft Now →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
