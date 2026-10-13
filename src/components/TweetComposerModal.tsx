import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import {
  X,
  BadgeCheck,
  Sparkles,
  Wand2,
  Clock,
  Send,
  PlusCircle,
  ExternalLink,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  Hash,
  Smile,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';

export const TweetComposerModal: React.FC = () => {
  const {
    account,
    composerState,
    closeComposer,
    addPostToQueue,
    updatePostInQueue,
    publishPostNow,
    addToast,
  } = useApp();

  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  useEffect(() => {
    if (composerState.isOpen) {
      setContent(composerState.initialContent || '');
      setHashtags(composerState.initialHashtags || []);
    }
  }, [composerState]);

  if (!composerState.isOpen) return null;

  const fullText = `${content}${hashtags.length > 0 ? `\n\n${hashtags.join(' ')}` : ''}`;
  const charCount = fullText.length;
  const maxChars = 280;
  const charsRemaining = maxChars - charCount;
  const isOverLimit = charsRemaining < 0;

  // Calculate circular progress percentage
  const progressPercent = Math.min(100, Math.max(0, (charCount / maxChars) * 100));
  const strokeDashoffset = 100 - progressPercent;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#?/, '#');
      if (clean && !hashtags.includes(clean)) {
        setHashtags([...hashtags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleAiPolish = async (
    instruction: 'make_punchier' | 'add_hook' | 'make_contrarian' | 'shorten_under_200' | 'add_cta'
  ) => {
    if (!content.trim()) return;
    setIsPolishing(true);
    try {
      const res = await apiService.refineTweet({
        tweetText: content,
        instruction,
      });
      setContent(res.refinedText);
      addToast({
        type: 'success',
        title: 'Draft Refined by AI ✨',
        message: res.explanation || 'Applied high-converting copy polish.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Polish Failed',
        message: 'Could not connect to AI service.',
      });
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSaveToQueue = () => {
    if (composerState.editingPostId) {
      updatePostInQueue(composerState.editingPostId, {
        content,
        hashtags,
      });
    } else {
      addPostToQueue({
        content,
        hashtags,
        category: 'Custom Draft',
        scheduledFor: '',
      });
    }
    closeComposer();
  };

  const handlePublishInstant = () => {
    publishPostNow({
      id: `custom-pub-${Date.now()}`,
      content,
      hashtags,
      scheduledFor: new Date().toISOString(),
      status: 'scheduled',
    });
    closeComposer();
  };

  const handleOpenXIntent = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
              𝕏
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {composerState.editingPostId ? 'Edit Scheduled Tweet' : 'Live Tweet Composer & Simulator'}
              </h3>
              <p className="text-xs text-zinc-400">Targeting @{account.username} audience</p>
            </div>
          </div>

          <button
            onClick={closeComposer}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick AI Polish Bar */}
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash Polish Tools:
              </span>
              {isPolishing && (
                <span className="text-[11px] text-sky-300 animate-pulse font-mono">
                  Synthesizing copy...
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                disabled={isPolishing || !content.trim()}
                onClick={() => handleAiPolish('make_punchier')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                ⚡ Make Punchier
              </button>
              <button
                disabled={isPolishing || !content.trim()}
                onClick={() => handleAiPolish('add_hook')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                🪝 Add Scroll-Stopping Hook
              </button>
              <button
                disabled={isPolishing || !content.trim()}
                onClick={() => handleAiPolish('make_contrarian')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                🔥 Make Contrarian
              </button>
              <button
                disabled={isPolishing || !content.trim()}
                onClick={() => handleAiPolish('shorten_under_200')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                ✂️ Shorten under 200
              </button>
              <button
                disabled={isPolishing || !content.trim()}
                onClick={() => handleAiPolish('add_cta')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                💬 Add Reply CTA
              </button>
            </div>
          </div>

          {/* Text Editor Area */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="What's happening? Share high-converting frameworks, data, or hot takes..."
              className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Hashtags Input & Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Attached Trending Hashtags:
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-medium"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 p-0.5 rounded"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type #tag and press Enter..."
                className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none px-2 py-1"
              />
            </div>
          </div>

          {/* Live Realistic X Feed Preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Live Feed Preview (How it appears on X):
            </span>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white space-y-3 shadow-inner">
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
                      <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                    )}
                    <span className="text-xs text-zinc-400">@{account.username}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs text-zinc-400 font-mono">Just now</span>
                  </div>

                  <p className="text-sm text-zinc-100 mt-1 whitespace-pre-line leading-relaxed font-normal">
                    {content || (
                      <span className="text-zinc-600 italic">Tweet content will appear here...</span>
                    )}
                  </p>

                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {hashtags.map((h, i) => (
                        <span key={i} className="text-xs font-medium text-sky-400">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Simulated interaction bar */}
                  <div className="flex items-center justify-between text-zinc-500 text-xs pt-3 mt-2 border-t border-zinc-900 max-w-sm">
                    <span className="flex items-center gap-1.5 hover:text-sky-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      14
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-emerald-400">
                      <Repeat2 className="w-3.5 h-3.5" />
                      42
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-rose-400">
                      <Heart className="w-3.5 h-3.5" />
                      189
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-purple-400">
                      <Bookmark className="w-3.5 h-3.5" />
                      84
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-zinc-300">
                      <Share className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Character Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  className="text-zinc-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  className={isOverLimit ? 'text-rose-500' : charsRemaining < 20 ? 'text-amber-500' : 'text-sky-500'}
                  strokeWidth="2.5"
                  strokeDasharray="75.39"
                  strokeDashoffset={75.39 - (75.39 * progressPercent) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                isOverLimit ? 'text-rose-400' : charsRemaining < 20 ? 'text-amber-400' : 'text-zinc-400'
              }`}
            >
              {charsRemaining} chars remaining
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenXIntent}
              disabled={!content.trim() || isOverLimit}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sky-400 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
              title="Open directly in X Web Intent"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>𝕏 Web Intent</span>
            </button>

            <button
              onClick={handleSaveToQueue}
              disabled={!content.trim() || isOverLimit}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{composerState.editingPostId ? 'Save Changes' : 'Schedule on Next Interval'}</span>
            </button>

            <button
              onClick={handlePublishInstant}
              disabled={!content.trim() || isOverLimit}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
