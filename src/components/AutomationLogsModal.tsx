import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const AutomationLogsModal: React.FC = () => {
  const { automationLogs, isLogsModalOpen, setIsLogsModalOpen } = useApp();

  if (!isLogsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-sky-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Automation Execution Logs</h3>
              <p className="text-xs text-zinc-400">Audit trail of interval runs & auto-pilot events</p>
            </div>
          </div>

          <button
            onClick={() => setIsLogsModalOpen(false)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-3">
          {automationLogs.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">No automation logs yet.</p>
          ) : (
            automationLogs.map((log) => {
              let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
              if (log.action === 'interval_triggered') {
                icon = <Clock className="w-4 h-4 text-sky-400 shrink-0" />;
              } else if (log.action === 'trend_applied') {
                icon = <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />;
              } else if (log.action === 'queue_refilled') {
                icon = <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />;
              }

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 flex items-start gap-3 text-xs"
                >
                  <div className="mt-0.5">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-zinc-200 capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{log.timestamp}</span>
                    </div>

                    <p className="text-zinc-400 mt-0.5 leading-relaxed">{log.details}</p>

                    {log.tweetPreview && (
                      <p className="text-[11px] text-zinc-500 italic mt-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/40">
                        &quot;{log.tweetPreview}&quot;
                      </p>
                    )}

                    {log.engagementEstimate && (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {log.engagementEstimate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
