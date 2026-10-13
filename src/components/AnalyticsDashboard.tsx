import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostItem, FollowerDataPoint } from '../types';
import { engagementHeatmap } from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Zap,
  Calendar,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { account, publishedPosts, followerHistory, setSelectedPostForAnalytics } = useApp();

  const [sortField, setSortField] = useState<'impressions' | 'engagementRate' | 'retweets' | 'bookmarks'>('impressions');
  const [selectedPoint, setSelectedPoint] = useState<FollowerDataPoint | null>(null);

  // Calculate high-level aggregates
  const totalImpressions = publishedPosts.reduce((acc, p) => acc + (p.metrics?.impressions || 0), 0) + account.monthlyImpressions;
  const totalLikes = publishedPosts.reduce((acc, p) => acc + (p.metrics?.likes || 0), 0);
  const totalRetweets = publishedPosts.reduce((acc, p) => acc + (p.metrics?.retweets || 0), 0);
  const totalBookmarks = publishedPosts.reduce((acc, p) => acc + (p.metrics?.bookmarks || 0), 0);
  const avgEngagementRate = publishedPosts.length > 0
    ? Number((publishedPosts.reduce((acc, p) => acc + (p.metrics?.engagementRate || 0), 0) / publishedPosts.length).toFixed(2))
    : account.avgEngagementRate;

  // Sorted published posts
  const sortedPosts = [...publishedPosts].sort((a, b) => {
    const metricA = a.metrics?.[sortField] || 0;
    const metricB = b.metrics?.[sortField] || 0;
    return metricB - metricA;
  });

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 35;

  const minFollowers = Math.min(...followerHistory.map((p) => p.followers)) * 0.98;
  const maxFollowers = Math.max(...followerHistory.map((p) => p.followers)) * 1.02;

  const getX = (index: number) => {
    return padding + (index / (followerHistory.length - 1)) * (chartWidth - 2 * padding);
  };

  const getY = (val: number) => {
    return (
      chartHeight -
      padding -
      ((val - minFollowers) / (maxFollowers - minFollowers)) * (chartHeight - 2 * padding)
    );
  };

  // Build SVG path
  const points = followerHistory.map((p, idx) => `${getX(idx)},${getY(p.followers)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${getX(0)},${chartHeight - padding} L ${points.join(' L ')} L ${getX(
    followerHistory.length - 1
  )},${chartHeight - padding} Z`;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Audience Growth & Post Performance Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Follower Velocity & Post Analytics
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Real-time attribution connecting interval cadence and trending hashtags to audience gains.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
            30-Day Window • Updated Live
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Followers
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">+10.6%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {account.followerCount.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">+180 today</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Impressions
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">+24.8%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {(totalImpressions / 1000).toFixed(1)}K
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Cadence boosted</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Engagement
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">2.5x avg</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {avgEngagementRate}%
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Industry: 1.9%</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
              Bookmarks
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">+32%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {totalBookmarks.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">High save intent</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              Retweets
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">+18%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {totalRetweets.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Organic shares</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Likes
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">+21%</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {totalLikes.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Feed interactions</p>
        </div>
      </div>

      {/* Follower Growth Trajectory Chart */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Follower Growth Trajectory</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Velocity: +138 followers/day avg
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Net audience growth driven by automated post consistency & viral hook optimization.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            {selectedPoint ? (
              <span className="text-sky-400 font-bold">
                {selectedPoint.date}: {selectedPoint.followers.toLocaleString()} followers (+{selectedPoint.netGain})
              </span>
            ) : (
              <span>Hover chart points for daily breakdown</span>
            )}
          </div>
        </div>

        {/* SVG Curve Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-[220px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * (chartHeight - 2 * padding);
                const val = Math.round(maxFollowers - ratio * (maxFollowers - minFollowers));
                return (
                  <g key={idx}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="#27272a"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 6}
                      y={y + 3}
                      fill="#71717a"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Area & Line */}
              <path d={areaPath} fill="url(#followerGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {followerHistory.map((point, idx) => {
                const cx = getX(idx);
                const cy = getY(point.followers);
                const isSelected = selectedPoint?.date === point.date;

                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#38bdf8' : '#0284c7'}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:scale-125"
                      onMouseEnter={() => setSelectedPoint(point)}
                    />
                    <text
                      x={cx}
                      y={chartHeight - 12}
                      fill="#a1a1aa"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {point.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Milestone projection banner */}
        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-zinc-200">
              <strong>Milestone Target:</strong> At current 3-hour cadence, you are on track to cross{' '}
              <strong className="text-white">20,000 Followers</strong> by{' '}
              <span className="text-sky-400 font-bold">Nov 1st, 2026</span> (~19 days).
            </span>
          </div>
          <span className="text-[11px] font-semibold text-sky-400 hidden sm:block">94% Confidence</span>
        </div>
      </div>

      {/* Best Times to Post Heatmap (7 Days x 24 Hours) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Audience Activity & Best Times Heatmap</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Darker squares represent peak engagement windows when your followers are most active.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Low</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-zinc-800" />
              <span className="w-3 h-3 rounded bg-sky-950" />
              <span className="w-3 h-3 rounded bg-sky-700" />
              <span className="w-3 h-3 rounded bg-sky-500" />
              <span className="w-3 h-3 rounded bg-cyan-400" />
            </div>
            <span>Peak</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[680px]">
            {/* Hour headers */}
            <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-1 text-[9px] text-zinc-500 font-mono text-center">
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h}>{h % 3 === 0 ? `${h}h` : ''}</div>
              ))}
            </div>

            {/* Day rows */}
            {engagementHeatmap.map((dayHours, dIdx) => (
              <div key={dIdx} className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-1 items-center">
                <span className="text-[11px] font-semibold text-zinc-400">{daysOfWeek[dIdx]}</span>
                {dayHours.map((val, hIdx) => {
                  let bgClass = 'bg-zinc-900';
                  if (val > 85) bgClass = 'bg-cyan-400 text-black';
                  else if (val > 70) bgClass = 'bg-sky-500';
                  else if (val > 50) bgClass = 'bg-sky-700';
                  else if (val > 25) bgClass = 'bg-sky-950';

                  return (
                    <div
                      key={hIdx}
                      title={`${daysOfWeek[dIdx]} ${hIdx}:00 - Engagement Score: ${val}/100`}
                      className={`h-6 rounded-md ${bgClass} transition-transform hover:scale-110 cursor-pointer flex items-center justify-center`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Published Post Leaderboard */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Post Performance Leaderboard</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ranked breakdown of published tweets, virality scores, and engagement metrics.
            </p>
          </div>

          {/* Sort Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-500 uppercase px-2 font-bold">Sort:</span>
            <button
              onClick={() => setSortField('impressions')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                sortField === 'impressions' ? 'bg-sky-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Impressions
            </button>
            <button
              onClick={() => setSortField('engagementRate')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                sortField === 'engagementRate' ? 'bg-sky-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Eng Rate %
            </button>
            <button
              onClick={() => setSortField('bookmarks')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                sortField === 'bookmarks' ? 'bg-sky-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Bookmarks
            </button>
            <button
              onClick={() => setSortField('retweets')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                sortField === 'retweets' ? 'bg-sky-500 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Retweets
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-500 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Post & Angle</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Eng. Rate</th>
                <th className="py-3 px-4">Likes</th>
                <th className="py-3 px-4">Retweets</th>
                <th className="py-3 px-4">Bookmarks</th>
                <th className="py-3 px-4 text-right">Virality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sortedPosts.map((post) => {
                const m = post.metrics;
                return (
                  <tr
                    key={post.id}
                    onClick={() => setSelectedPostForAnalytics(post)}
                    className="hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p className="text-zinc-200 line-clamp-2 leading-relaxed font-normal">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-500">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <div className="flex gap-1">
                          {post.hashtags.slice(0, 2).map((h, i) => (
                            <span key={i} className="text-[10px] text-sky-400">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {m?.impressions.toLocaleString() || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {m?.engagementRate}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 whitespace-nowrap">
                      {m?.likes.toLocaleString() || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 whitespace-nowrap">
                      {m?.retweets.toLocaleString() || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-400 font-bold whitespace-nowrap">
                      {m?.bookmarks.toLocaleString() || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 whitespace-nowrap">
                      {post.viralityScore || 90}/100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
