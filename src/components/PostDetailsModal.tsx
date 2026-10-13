import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  BadgeCheck,
  Eye,
  Heart,
  Repeat2,
  Bookmark,
  MessageCircle,
  Users,
  Zap,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const PostDetailsModal: React.FC = () => {
  const { account, selectedPostForAnalytics, setSelectedPostForAnalytics } = useApp();

  if (!selectedPostForAnalytics) return null;

  const post = selectedPostForAnalytics;
  const m = post.metrics;

  const handleOpenX = () => {
    const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Post Performance Deep-Dive</h3>
          </div>

          <button
            onClick={() => setSelectedPostForAnalytics(null)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tweet Card */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={account.avatarUrl}
                alt={account.displayName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-white">{account.displayName}</span>
                  {account.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-sky-400" />
                  )}
                  <span className="text-xs text-zinc-400">@{account.username}</span>
                </div>
                <p className="text-sm text-zinc-100 mt-2 whitespace-pre-line leading-relaxed font-normal">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {post.hashtags.map((h, i) => (
                    <span key={i} className="text-xs text-sky-400 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Virality and Impressions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                Total Impressions
              </span>
              <p className="text-2xl font-black text-white mt-1">
                {m?.impressions.toLocaleString() || '—'}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">+184% over average</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
              <span className="text-xs text-zinc-400 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Virality Rating
              </span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {post.viralityScore || 92}/100
              </p>
              <span className="text-[10px] text-zinc-400 font-medium">Top 5% quartile</span>
            </div>
          </div>

          {/* Detailed Metric Badges */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{m?.likes.toLocaleString() || '—'}</p>
              <span className="text-[10px] text-zinc-500">Likes</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <Repeat2 className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{m?.retweets.toLocaleString() || '—'}</p>
              <span className="text-[10px] text-zinc-500">Retweets</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <Bookmark className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{m?.bookmarks.toLocaleString() || '—'}</p>
              <span className="text-[10px] text-zinc-500">Bookmarks</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <MessageCircle className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{m?.replies.toLocaleString() || '—'}</p>
              <span className="text-[10px] text-zinc-500">Replies</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{m?.profileClicks.toLocaleString() || '—'}</p>
              <span className="text-[10px] text-zinc-500">Profile Clicks</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
              <Share2 className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-emerald-400 font-mono">{m?.engagementRate}%</p>
              <span className="text-[10px] text-zinc-500">Eng Rate</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/70 flex justify-between items-center">
          <span className="text-xs text-zinc-400">
            Published: {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'Recent'}
          </span>

          <button
            onClick={handleOpenX}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open on X</span>
          </button>
        </div>
      </div>
    </div>
  );
};
