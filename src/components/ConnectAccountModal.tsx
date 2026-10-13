import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  BadgeCheck,
  ShieldCheck,
  Key,
  ExternalLink,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Eye,
  Radio,
} from 'lucide-react';

export const ConnectAccountModal: React.FC = () => {
  const {
    account,
    updateAccount,
    connectAccount,
    disconnectAccount,
    isConnectModalOpen,
    setIsConnectModalOpen,
    addToast,
  } = useApp();

  const [usernameInput, setUsernameInput] = useState(account.username);
  const [displayNameInput, setDisplayNameInput] = useState(account.displayName);
  const [bioInput, setBioInput] = useState(account.bio);
  const [isVerifiedInput, setIsVerifiedInput] = useState(account.isVerified);
  const [tierInput, setTierInput] = useState(account.tier);
  const [followerCountInput, setFollowerCountInput] = useState(account.followerCount);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isConnectModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccount({
      username: usernameInput.replace(/^@/, ''),
      displayName: displayNameInput,
      bio: bioInput,
      isVerified: isVerifiedInput,
      tier: tierInput,
      followerCount: Number(followerCountInput) || account.followerCount,
    });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Account details and synced metrics have been updated.',
    });
    setIsConnectModalOpen(false);
  };

  const handleOAuthSimulate = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      connectAccount(usernameInput || 'tumininu_tech', displayNameInput || 'Tumininu Aiyegbusi', tierInput);
      setIsAuthorizing(false);
      setIsConnectModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-base">
              𝕏
            </div>
            <div>
              <h3 className="text-base font-bold text-white">X (Twitter) Account Connection</h3>
              <p className="text-xs text-zinc-400">OAuth 2.0 PKCE & Automated Post Pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsConnectModalOpen(false)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Connection Status Card */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={account.avatarUrl}
                  alt={account.displayName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/30"
                />
                {account.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-sky-400 absolute -bottom-0.5 -right-0.5 bg-zinc-950 rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{account.displayName}</h4>
                  <span className="text-xs text-zinc-400">@{account.username}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    OAuth 2.0 Linked
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Token: active (Read & Write)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {account.tier} Tier
              </span>
              <span className="text-[10px] text-zinc-500">
                Synced: {account.connectedAt ? new Date(account.connectedAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-sky-400" />
                Followers
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {account.followerCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-emerald-400" />
                Monthly Reach
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {(account.monthlyImpressions / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Avg Engagement
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {account.avgEngagementRate}%
              </p>
            </div>
          </div>

          {/* Account Configuration Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  X Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-sm font-mono">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors font-mono"
                    placeholder="tumininu_tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Your Display Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Profile Bio
              </label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
                placeholder="What do you build and tweet about?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Follower Count
                </label>
                <input
                  type="number"
                  value={followerCountInput}
                  onChange={(e) => setFollowerCountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Account Tier
                </label>
                <select
                  value={tierInput}
                  onChange={(e: any) => setTierInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="Free">Free</option>
                  <option value="Basic">Basic API</option>
                  <option value="Premium">Premium (Pro)</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Verified Badge
                </label>
                <button
                  type="button"
                  onClick={() => setIsVerifiedInput(!isVerifiedInput)}
                  className={`w-full py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    isVerifiedInput
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-semibold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <BadgeCheck className={`w-4 h-4 ${isVerifiedInput ? 'text-sky-400' : 'text-zinc-500'}`} />
                  {isVerifiedInput ? 'Verified (Blue)' : 'Standard'}
                </button>
              </div>
            </div>

            {/* Scope Permissions Info */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Active OAuth 2.0 Scopes
              </div>
              <p className="text-[11px] leading-relaxed">
                <span className="font-mono text-zinc-300">tweet.write</span> (Auto-publish scheduled posts),{' '}
                <span className="font-mono text-zinc-300">tweet.read</span> (Live metrics retrieval),{' '}
                <span className="font-mono text-zinc-300">users.read</span> (Follower growth tracking).
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={disconnectAccount}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 px-3 py-2 rounded-lg border border-rose-900/30 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAuthorizing}
                  onClick={handleOAuthSimulate}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuthorizing ? 'animate-spin' : ''}`} />
                  {isAuthorizing ? 'Authenticating...' : 'Re-sync OAuth'}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 active:scale-95 shadow-md shadow-sky-500/25 rounded-lg transition-all"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
