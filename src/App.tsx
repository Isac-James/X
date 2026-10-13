import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { AiSuggestionEngine } from './components/AiSuggestionEngine';
import { AutoPostScheduler } from './components/AutoPostScheduler';
import { TrendingRadar } from './components/TrendingRadar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ConnectAccountModal } from './components/ConnectAccountModal';
import { TweetComposerModal } from './components/TweetComposerModal';
import { AutomationLogsModal } from './components/AutomationLogsModal';
import { PostDetailsModal } from './components/PostDetailsModal';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {activeTab === 'dashboard' && <OverviewTab />}
      {activeTab === 'ai_engine' && <AiSuggestionEngine />}
      {activeTab === 'scheduler' && <AutoPostScheduler />}
      {activeTab === 'trends' && <TrendingRadar />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Global Modals & Notifications */}
        <ConnectAccountModal />
        <TweetComposerModal />
        <AutomationLogsModal />
        <PostDetailsModal />
        <ToastContainer />

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-400">PulseX Engine</span>
              <span>•</span>
              <span>Automated X Publishing & Algorithmic Growth Radar</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
              <span>OAuth 2.0 PKCE</span>
              <span>Gemini 3.8 Flash</span>
              <span>Cadence Intervals Active</span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
