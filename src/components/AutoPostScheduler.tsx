import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Zap,
  Play,
  Pause,
  Sliders,
  Calendar,
  CheckCircle2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Send,
  Sparkles,
  AlertCircle,
  Hash,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Plus,
} from 'lucide-react';

export const AutoPostScheduler: React.FC = () => {
  const {
    account,
    queue,
    intervalConfig,
    updateIntervalConfig,
    toggleAutoPilot,
    triggerAutoPilotIntervalSimulation,
    publishPostNow,
    removePostFromQueue,
    reorderQueue,
    openComposer,
    secondsUntilNextPost,
    nextScheduledPostDate,
    setActiveTab,
    addToast,
  } = useApp();

  const [selectedIntervalHours, setSelectedIntervalHours] = useState(intervalConfig.intervalHours);
  const [selectedIntervalMins, setSelectedIntervalMins] = useState(intervalConfig.intervalMinutes);
  const [autoInjectHashtags, setAutoInjectHashtags] = useState(intervalConfig.autoHashtagInjection);
  const [smartPeakAdjustment, setSmartPeakAdjustment] = useState(intervalConfig.smartPeakTimeAdjustment);
  const [windowStart, setWindowStart] = useState(intervalConfig.postingWindowStart);
  const [windowEnd, setWindowEnd] = useState(intervalConfig.postingWindowEnd);

  // Format countdown clock HH:MM:SS
  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const timer = formatCountdown(secondsUntilNextPost);

  const handleSaveCadence = () => {
    updateIntervalConfig({
      intervalHours: Number(selectedIntervalHours),
      intervalMinutes: Number(selectedIntervalMins),
      autoHashtagInjection: autoInjectHashtags,
      smartPeakTimeAdjustment: smartPeakAdjustment,
      postingWindowStart: windowStart,
      postingWindowEnd: windowEnd,
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newQueue = [...queue];
    const temp = newQueue[index - 1];
    newQueue[index - 1] = newQueue[index];
    newQueue[index] = temp;
    reorderQueue(newQueue);
  };

  const handleMoveDown = (index: number) => {
    if (index === queue.length - 1) return;
    const newQueue = [...queue];
    const temp = newQueue[index + 1];
    newQueue[index + 1] = newQueue[index];
    newQueue[index] = temp;
    reorderQueue(newQueue);
  };

  const intervalPresets = [
    { label: 'Every 1 Hour', hours: 1, mins: 0, tag: 'High Velocity' },
    { label: 'Every 2 Hours', hours: 2, mins: 0, tag: 'Standard Pro' },
    { label: 'Every 3 Hours', hours: 3, mins: 0, tag: 'Optimal Virality' },
    { label: 'Every 4 Hours', hours: 4, mins: 0, tag: 'Thought Leader' },
    { label: 'Every 6 Hours', hours: 6, mins: 0, tag: 'Consolidated' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cadence Command Monitor */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Status & Next Run */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-zinc-800/90 border-zinc-700 text-zinc-200">
                <span className={`w-2 h-2 rounded-full ${account.autoPilotEnabled ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`} />
                {account.autoPilotEnabled ? 'Auto-Cadence Running' : 'Auto-Cadence Paused'}
              </span>

              <span className="text-xs text-zinc-400">
                Cadence: Every <span className="text-sky-400 font-bold">{intervalConfig.intervalHours}h</span>
                {intervalConfig.intervalMinutes > 0 && ` ${intervalConfig.intervalMinutes}m`}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Automated Interval Cadence
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                PulseX spaces your queue according to algorithmic engagement windows, automatically
                pairing trending tags to maximize reach.
              </p>
            </div>

            {nextScheduledPostDate && (
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Next automated broadcast:</span>
                <span className="font-semibold text-white">
                  {nextScheduledPostDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({intervalConfig.timezone})
                </span>
              </div>
            )}
          </div>

          {/* Large Countdown Clock Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-5 shadow-inner">
            <div className="text-center sm:text-right pr-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
                Next Interval Post In
              </span>
              <div className="flex items-center justify-center sm:justify-end gap-1.5 font-mono text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                <span className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-sky-400">
                  {timer.hours}
                </span>
                <span className="text-zinc-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-sky-400">
                  {timer.minutes}
                </span>
                <span className="text-zinc-600">:</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  {timer.seconds}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">HH : MM : SS</span>
            </div>

            <div className="h-px sm:h-12 w-full sm:w-px bg-zinc-800" />

            {/* Quick Actions in Box */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={toggleAutoPilot}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  account.autoPilotEnabled
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {account.autoPilotEnabled ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Auto-Pilot
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Resume Auto-Pilot
                  </>
                )}
              </button>

              <button
                onClick={triggerAutoPilotIntervalSimulation}
                disabled={queue.length === 0}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Zap className="w-3.5 h-3.5" />
                Simulate Trigger Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cadence Settings & Intervals Config */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cadence & Automation Tuning
            </h3>
          </div>
          <button
            onClick={handleSaveCadence}
            className="px-4 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow-sm transition-all"
          >
            Save Cadence Changes
          </button>
        </div>

        {/* Interval Presets */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Interval Duration Between Automated Posts
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {intervalPresets.map((preset) => {
              const isSelected =
                selectedIntervalHours === preset.hours && selectedIntervalMins === preset.mins;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setSelectedIntervalHours(preset.hours);
                    setSelectedIntervalMins(preset.mins);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-white shadow-md shadow-sky-500/10'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">{preset.tag}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom interval sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Custom Interval (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={selectedIntervalHours}
              onChange={(e) => setSelectedIntervalHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Custom Interval (Minutes)
            </label>
            <input
              type="number"
              min={0}
              max={59}
              step={5}
              value={selectedIntervalMins}
              onChange={(e) => setSelectedIntervalMins(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Active Hours Start
            </label>
            <input
              type="time"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Active Hours End
            </label>
            <input
              type="time"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        {/* Smart Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => setAutoInjectHashtags(!autoInjectHashtags)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              autoInjectHashtags
                ? 'bg-sky-500/5 border-sky-500/30'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded-md ${autoInjectHashtags ? 'bg-sky-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
              <Hash className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Auto-Inject Trending Hashtags
                {autoInjectHashtags && <span className="text-[10px] text-sky-400 font-semibold">ON</span>}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Automatically scans live radar velocity and appends 2 top-surging industry tags to outgoing tweets.
              </p>
            </div>
          </div>

          <div
            onClick={() => setSmartPeakAdjustment(!smartPeakAdjustment)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              smartPeakAdjustment
                ? 'bg-sky-500/5 border-sky-500/30'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className={`mt-0.5 p-1 rounded-md ${smartPeakAdjustment ? 'bg-sky-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Algorithmic Peak Time Alignment
                {smartPeakAdjustment && <span className="text-[10px] text-sky-400 font-semibold">ON</span>}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Dynamically offsets schedule by +/- 8 minutes to target highest commuter and lunch feed activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Scheduled Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Scheduled Queue Pipeline ({queue.length} posts)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openComposer()}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Draft</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_engine')}
              className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Drafts</span>
            </button>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Your Scheduled Queue is Empty</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                Without queued drafts, auto-pilot cannot publish. Fill your pipeline using the Gemini AI Suggestion Engine or write a custom tweet.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ai_engine')}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Fill Queue with AI Suggestions</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item, index) => {
              const scheduledDate = new Date(item.scheduledFor);
              const isFirst = index === 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isFirst
                      ? 'bg-zinc-900/90 border-sky-500/30 shadow-md shadow-sky-500/5'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Left: Timing badge & content preview */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0 text-center p-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-sky-400">
                        {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] text-zinc-400">
                        {isFirst ? 'Next' : `+${(index) * intervalConfig.intervalHours}h`}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isFirst && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Up Next
                          </span>
                        )}
                        {item.category && (
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {item.category}
                          </span>
                        )}
                        {item.viralityScore && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            {item.viralityScore}/100
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.hashtags.map((h, hIdx) => (
                          <span key={hIdx} className="text-[10px] text-sky-400">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Queue Reordering & Quick Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                    {/* Move Up/Down */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move up in schedule"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === queue.length - 1}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Move down in schedule"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openComposer(item.content, item.hashtags, item.id)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Edit content"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removePostFromQueue(item.id)}
                      className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Post Now */}
                    <button
                      onClick={() => publishPostNow(item.id, false)}
                      className="ml-1 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/20 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Post Now
                    </button>
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
