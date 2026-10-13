import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Plus,
  Radio,
  FileText,
  BadgeCheck,
  CheckCircle2,
  Play,
  Pause,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    account,
    activeTab,
    setActiveTab,
    secondsUntilNextPost,
    toggleAutoPilot,
    triggerAutoPilotIntervalSimulation,
    openComposer,
    setIsConnectModalOpen,
    setIsLogsModalOpen,
    queue,
  } = useApp();

  // Format seconds into HH:MM:SS
  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Zap },
    { id: 'ai_engine', label: 'AI Suggestion Engine', icon: Sparkles, badge: 'Gemini' },
    { id: 'scheduler', label: 'Auto-Cadence & Queue', icon: Clock, count: queue.length },
    { id: 'trends', label: 'Trending Radar', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics & Growth', icon: BarChart3 },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white shadow-lg shadow-sky-500/20">
              <span className="font-black text-lg tracking-wider">𝕏</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">PulseX</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  AUTO-PILOT
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">Automated Cadence & Trend Growth Engine</p>
            </div>
          </div>

          {/* Center: Live Cadence Ticker & AutoPilot Status */}
          <div className="hidden md:flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-1.5 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {account.autoPilotEnabled ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
                )}
              </span>
              <span className="text-xs font-medium text-zinc-300">
                {account.autoPilotEnabled ? 'Cadence Active' : 'Cadence Paused'}
              </span>
            </div>

            <div className="h-3.5 w-px bg-zinc-800" />

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Next auto-post:</span>
              <span className="font-mono font-bold text-white tracking-wider">
                {formatCountdown(secondsUntilNextPost)}
              </span>
            </div>

            {queue.length > 0 && (
              <button
                onClick={triggerAutoPilotIntervalSimulation}
                title="Trigger automated post right now (simulation)"
                className="ml-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-500/20 transition-all flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-sky-400" />
                Trigger Now
              </button>
            )}

            <button
              onClick={toggleAutoPilot}
              className={`p-1 rounded-full text-xs transition-colors ${
                account.autoPilotEnabled
                  ? 'text-emerald-400 hover:bg-emerald-500/10'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
              title={account.autoPilotEnabled ? 'Pause Auto-Pilot' : 'Resume Auto-Pilot'}
            >
              {account.autoPilotEnabled ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>

          {/* Right Action buttons & Account */}
          <div className="flex items-center gap-2.5">
            {/* View Logs Button */}
            <button
              onClick={() => setIsLogsModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
              title="View Automation Audit Logs"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Logs</span>
            </button>

            {/* Compose Tweet Button */}
            <button
              onClick={() => openComposer()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 active:scale-95 shadow-md shadow-sky-500/25 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </button>

            {/* Connected Account Chip */}
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className={`flex items-center gap-2 p-1.5 pl-2 rounded-xl border transition-all ${
                account.isConnected
                  ? 'bg-zinc-900 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
                  : 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-800/40 text-rose-300'
              }`}
            >
              <div className="relative">
                <img
                  src={account.avatarUrl}
                  alt={account.displayName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                />
                {account.isVerified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-400 absolute -bottom-1 -right-1 bg-zinc-950 rounded-full" />
                )}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-zinc-200 truncate max-w-[100px]">
                    @{account.username}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-zinc-400">
                  {account.followerCount.toLocaleString()} followers
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-zinc-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold shadow-sm shadow-sky-500/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
                {'badge' in item && item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 uppercase">
                    {item.badge}
                  </span>
                )}
                {'count' in item && item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
