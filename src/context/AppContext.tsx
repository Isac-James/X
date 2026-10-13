import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  XAccount,
  PostItem,
  AutoPostIntervalConfig,
  AutomationLog,
  FollowerDataPoint,
} from '../types';
import {
  initialAccount,
  initialIntervalConfig,
  initialQueue,
  initialPublishedPosts,
  initialAutomationLogs,
  followerGrowthHistory,
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  account: XAccount;
  updateAccount: (patch: Partial<XAccount>) => void;
  connectAccount: (username: string, displayName: string, tier?: 'Free' | 'Basic' | 'Premium' | 'Enterprise') => void;
  disconnectAccount: () => void;
  
  queue: PostItem[];
  publishedPosts: PostItem[];
  addPostToQueue: (post: Omit<PostItem, 'id' | 'status'> & { id?: string }) => void;
  removePostFromQueue: (id: string) => void;
  updatePostInQueue: (id: string, patch: Partial<PostItem>) => void;
  reorderQueue: (newQueue: PostItem[]) => void;
  publishPostNow: (idOrPost: string | PostItem, openXIntent?: boolean) => void;
  
  intervalConfig: AutoPostIntervalConfig;
  updateIntervalConfig: (patch: Partial<AutoPostIntervalConfig>) => void;
  toggleAutoPilot: () => void;
  triggerAutoPilotIntervalSimulation: () => void;
  
  secondsUntilNextPost: number;
  nextScheduledPostDate: Date | null;
  
  automationLogs: AutomationLog[];
  followerHistory: FollowerDataPoint[];
  
  activeTab: 'dashboard' | 'ai_engine' | 'scheduler' | 'trends' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'ai_engine' | 'scheduler' | 'trends' | 'analytics') => void;
  
  composerState: {
    isOpen: boolean;
    initialContent: string;
    initialHashtags: string[];
    editingPostId?: string;
  };
  openComposer: (initialContent?: string, hashtags?: string[], editingPostId?: string) => void;
  closeComposer: () => void;
  
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
  
  isLogsModalOpen: boolean;
  setIsLogsModalOpen: (open: boolean) => void;
  
  selectedPostForAnalytics: PostItem | null;
  setSelectedPostForAnalytics: (post: PostItem | null) => void;
  
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Account state with localStorage
  const [account, setAccount] = useState<XAccount>(() => {
    try {
      const saved = localStorage.getItem('pulsex_account');
      return saved ? JSON.parse(saved) : initialAccount;
    } catch {
      return initialAccount;
    }
  });

  // Interval configuration
  const [intervalConfig, setIntervalConfig] = useState<AutoPostIntervalConfig>(() => {
    try {
      const saved = localStorage.getItem('pulsex_interval_config');
      return saved ? JSON.parse(saved) : initialIntervalConfig;
    } catch {
      return initialIntervalConfig;
    }
  });

  // Scheduled Queue
  const [queue, setQueue] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulsex_queue');
      return saved ? JSON.parse(saved) : initialQueue;
    } catch {
      return initialQueue;
    }
  });

  // Published posts history
  const [publishedPosts, setPublishedPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulsex_published_posts');
      return saved ? JSON.parse(saved) : initialPublishedPosts;
    } catch {
      return initialPublishedPosts;
    }
  });

  // Automation audit logs
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    try {
      const saved = localStorage.getItem('pulsex_automation_logs');
      return saved ? JSON.parse(saved) : initialAutomationLogs;
    } catch {
      return initialAutomationLogs;
    }
  });

  // Follower history
  const [followerHistory, setFollowerHistory] = useState<FollowerDataPoint[]>(followerGrowthHistory);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai_engine' | 'scheduler' | 'trends' | 'analytics'>('dashboard');

  // Modals & UI states
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedPostForAnalytics, setSelectedPostForAnalytics] = useState<PostItem | null>(null);

  // Composer state
  const [composerState, setComposerState] = useState<{
    isOpen: boolean;
    initialContent: string;
    initialHashtags: string[];
    editingPostId?: string;
  }>({
    isOpen: false,
    initialContent: '',
    initialHashtags: [],
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem('pulsex_account', JSON.stringify(account));
    } catch {}
  }, [account]);

  useEffect(() => {
    try {
      localStorage.setItem('pulsex_interval_config', JSON.stringify(intervalConfig));
    } catch {}
  }, [intervalConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('pulsex_queue', JSON.stringify(queue));
    } catch {}
  }, [queue]);

  useEffect(() => {
    try {
      localStorage.setItem('pulsex_published_posts', JSON.stringify(publishedPosts));
    } catch {}
  }, [publishedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('pulsex_automation_logs', JSON.stringify(automationLogs));
    } catch {}
  }, [automationLogs]);

  // Toast Helpers
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Countdown timer calculation
  const [secondsUntilNextPost, setSecondsUntilNextPost] = useState<number>(1800);
  const [nextScheduledPostDate, setNextScheduledPostDate] = useState<Date | null>(null);

  useEffect(() => {
    if (queue.length > 0) {
      const nextPost = queue[0];
      const targetTime = new Date(nextPost.scheduledFor).getTime();
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((targetTime - now) / 1000));
      setSecondsUntilNextPost(diffSecs);
      setNextScheduledPostDate(new Date(nextPost.scheduledFor));
    } else {
      // If queue is empty, calculate from intervalConfig
      const fallbackSecs = intervalConfig.intervalHours * 3600 + intervalConfig.intervalMinutes * 60;
      setSecondsUntilNextPost(fallbackSecs);
      setNextScheduledPostDate(new Date(Date.now() + fallbackSecs * 1000));
    }
  }, [queue, intervalConfig]);

  // Real-time ticking effect
  useEffect(() => {
    if (!account.autoPilotEnabled) return;

    const timer = setInterval(() => {
      setSecondsUntilNextPost((prev) => {
        if (prev <= 1) {
          // Trigger automated execution if there is an item
          if (queue.length > 0) {
            triggerAutoPilotIntervalSimulation();
          }
          const resetSecs = intervalConfig.intervalHours * 3600 + intervalConfig.intervalMinutes * 60;
          return resetSecs > 0 ? resetSecs : 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [account.autoPilotEnabled, queue, intervalConfig]);

  // Account operations
  const updateAccount = useCallback((patch: Partial<XAccount>) => {
    setAccount((prev) => ({ ...prev, ...patch }));
  }, []);

  const connectAccount = useCallback((username: string, displayName: string, tier: 'Free' | 'Basic' | 'Premium' | 'Enterprise' = 'Premium') => {
    const cleanUsername = username.replace(/^@/, '');
    const newAcc: XAccount = {
      ...account,
      id: `x-acc-${Date.now()}`,
      username: cleanUsername,
      displayName: displayName || cleanUsername,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80`,
      bio: `Official X account for @${cleanUsername}. Automated engagement activated via PulseX.`,
      isConnected: true,
      connectedAt: new Date().toISOString(),
      tier,
      apiStatus: 'active',
      autoPilotEnabled: true,
    };
    setAccount(newAcc);
    addToast({
      type: 'success',
      title: 'X Account Linked!',
      message: `Successfully connected @${cleanUsername} with OAuth 2.0 PKCE. Auto-posting permissions active.`,
    });
  }, [account, addToast]);

  const disconnectAccount = useCallback(() => {
    setAccount((prev) => ({
      ...prev,
      isConnected: false,
      apiStatus: 'disconnected',
      autoPilotEnabled: false,
    }));
    addToast({
      type: 'info',
      title: 'Account Disconnected',
      message: 'Your X profile has been unlinked from PulseX automated scheduling.',
    });
  }, [addToast]);

  // Interval & AutoPilot
  const updateIntervalConfig = useCallback((patch: Partial<AutoPostIntervalConfig>) => {
    setIntervalConfig((prev) => {
      const updated = { ...prev, ...patch };
      // Recalculate scheduled dates for queue items based on new interval
      const now = Date.now();
      const intervalMs = (updated.intervalHours * 3600 + updated.intervalMinutes * 60) * 1000;
      
      setQueue((prevQueue) =>
        prevQueue.map((item, index) => ({
          ...item,
          scheduledFor: new Date(now + (index + 1) * intervalMs).toISOString(),
        }))
      );
      
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Cadence Updated',
      message: `Auto-posting interval set to every ${patch.intervalHours || intervalConfig.intervalHours}h ${patch.intervalMinutes !== undefined ? patch.intervalMinutes + 'm' : ''}. Queue timings synchronized.`,
    });
  }, [intervalConfig, addToast]);

  const toggleAutoPilot = useCallback(() => {
    setAccount((prev) => {
      const nextState = !prev.autoPilotEnabled;
      addToast({
        type: nextState ? 'success' : 'warning',
        title: nextState ? 'Auto-Pilot Activated ⚡️' : 'Auto-Pilot Paused ⏸️',
        message: nextState
          ? 'PulseX is now publishing posts automatically according to your interval schedule.'
          : 'Automatic publishing has been halted. Your scheduled drafts remain in queue.',
      });
      return { ...prev, autoPilotEnabled: nextState };
    });
  }, [addToast]);

  // Queue Operations
  const addPostToQueue = useCallback((postData: Omit<PostItem, 'id' | 'status'> & { id?: string }) => {
    const id = postData.id || `post-q-${Date.now()}`;
    const intervalMs = (intervalConfig.intervalHours * 3600 + intervalConfig.intervalMinutes * 60) * 1000;
    
    // Calculate scheduled time based on queue length
    const queueLength = queue.length;
    const baseTime = queueLength > 0
      ? new Date(queue[queueLength - 1].scheduledFor).getTime()
      : Date.now();
    const scheduledFor = postData.scheduledFor || new Date(baseTime + intervalMs).toISOString();

    const newPost: PostItem = {
      ...postData,
      id,
      status: 'scheduled',
      scheduledFor,
      viralityScore: postData.viralityScore || Math.floor(Math.random() * 15) + 84,
    };

    setQueue((prev) => [...prev, newPost]);

    // Log automation event
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      action: 'queue_refilled',
      status: 'success',
      details: `Added new post to automated schedule for ${new Date(scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      tweetPreview: postData.content.substring(0, 50) + '...',
      engagementEstimate: `Predicted Virality: ${newPost.viralityScore}/100`,
    };
    setAutomationLogs((prev) => [newLog, ...prev.slice(0, 49)]);

    addToast({
      type: 'success',
      title: 'Added to Auto-Schedule Queue',
      message: `Post slated for ${new Date(scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
    });
  }, [intervalConfig, queue, addToast]);

  const removePostFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Removed from Queue',
      message: 'The post has been taken off the schedule.',
    });
  }, [addToast]);

  const updatePostInQueue = useCallback((id: string, patch: Partial<PostItem>) => {
    setQueue((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    addToast({
      type: 'success',
      title: 'Post Updated',
      message: 'Changes saved to scheduled draft.',
    });
  }, [addToast]);

  const reorderQueue = useCallback((newQueue: PostItem[]) => {
    const intervalMs = (intervalConfig.intervalHours * 3600 + intervalConfig.intervalMinutes * 60) * 1000;
    const now = Date.now();
    
    // Re-assign scheduled dates sequentially
    const updated = newQueue.map((item, idx) => ({
      ...item,
      scheduledFor: new Date(now + (idx + 1) * intervalMs).toISOString(),
    }));
    
    setQueue(updated);
    addToast({
      type: 'info',
      title: 'Queue Reordered',
      message: 'New sequence will broadcast in order.',
    });
  }, [intervalConfig, addToast]);

  // Publish Post Action (Instant or Queue)
  const publishPostNow = useCallback((idOrPost: string | PostItem, openXIntent: boolean = false) => {
    let targetPost: PostItem | undefined;

    if (typeof idOrPost === 'string') {
      targetPost = queue.find((p) => p.id === idOrPost);
    } else {
      targetPost = idOrPost;
    }

    if (!targetPost) return;

    // Remove from queue if it was in queue
    setQueue((prev) => prev.filter((p) => p.id !== targetPost!.id));

    // Generate initial live metrics for the newly published tweet
    const impressions = Math.floor(Math.random() * 12000) + 8500;
    const retweets = Math.floor(impressions * (Math.random() * 0.02 + 0.015));
    const likes = Math.floor(impressions * (Math.random() * 0.045 + 0.03));
    const replies = Math.floor(likes * 0.2);
    const bookmarks = Math.floor(likes * 0.6);
    const profileClicks = Math.floor(impressions * 0.018);
    const engagementRate = Number((((likes + retweets + bookmarks + replies) / impressions) * 100).toFixed(2));

    const published: PostItem = {
      ...targetPost,
      id: targetPost.id.startsWith('post-q-') ? `pub-${Date.now()}` : targetPost.id,
      status: 'published',
      publishedAt: new Date().toISOString(),
      metrics: {
        impressions,
        likes,
        retweets,
        replies,
        bookmarks,
        profileClicks,
        engagementRate,
      },
    };

    setPublishedPosts((prev) => [published, ...prev]);

    // Update account follower count & total tweets
    const gain = Math.floor(Math.random() * 18) + 12;
    setAccount((prev) => ({
      ...prev,
      totalTweets: prev.totalTweets + 1,
      followerCount: prev.followerCount + gain,
      monthlyImpressions: prev.monthlyImpressions + impressions,
    }));

    // Update follower growth chart point
    setFollowerHistory((prev) => {
      const last = prev[prev.length - 1];
      const newPoint: FollowerDataPoint = {
        date: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followers: account.followerCount + gain,
        netGain: gain,
        impressions: impressions,
        engagementScore: engagementRate,
      };
      return [...prev.slice(-9), newPoint];
    });

    // Log automation
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      action: 'auto_post_published',
      status: 'success',
      details: `Published via PulseX execution engine with hashtags ${targetPost.hashtags.join(' ')}`,
      tweetPreview: targetPost.content.substring(0, 60) + '...',
      engagementEstimate: `${impressions.toLocaleString()} live impressions logged (+${gain} followers)`,
    };
    setAutomationLogs((prev) => [newLog, ...prev.slice(0, 49)]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1d9bf0', '#00ba7c', '#f91880', '#ffd400'],
      });
    } catch {}

    // Open X Intent if requested or preferred
    if (openXIntent) {
      const fullText = `${targetPost.content}\n\n${targetPost.hashtags.join(' ')}`;
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    }

    addToast({
      type: 'success',
      title: 'Tweet Published Successfully! 🚀',
      message: `Posted to @${account.username}. +${gain} followers gained and performance metrics registered.`,
    });
  }, [queue, account, addToast]);

  // Interval Simulation Trigger (Manual "Trigger Next Interval Now" for testing)
  const triggerAutoPilotIntervalSimulation = useCallback(() => {
    if (queue.length === 0) {
      addToast({
        type: 'warning',
        title: 'Queue Empty',
        message: 'No scheduled tweets left to auto-post. Use the AI Content Engine to generate new drafts.',
      });
      return;
    }

    const nextPost = queue[0];
    publishPostNow(nextPost.id, false);
  }, [queue, publishPostNow, addToast]);

  // Composer helpers
  const openComposer = useCallback((initialContent: string = '', hashtags: string[] = [], editingPostId?: string) => {
    setComposerState({
      isOpen: true,
      initialContent,
      initialHashtags: hashtags,
      editingPostId,
    });
  }, []);

  const closeComposer = useCallback(() => {
    setComposerState({
      isOpen: false,
      initialContent: '',
      initialHashtags: [],
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        account,
        updateAccount,
        connectAccount,
        disconnectAccount,
        queue,
        publishedPosts,
        addPostToQueue,
        removePostFromQueue,
        updatePostInQueue,
        reorderQueue,
        publishPostNow,
        intervalConfig,
        updateIntervalConfig,
        toggleAutoPilot,
        triggerAutoPilotIntervalSimulation,
        secondsUntilNextPost,
        nextScheduledPostDate,
        automationLogs,
        followerHistory,
        activeTab,
        setActiveTab,
        composerState,
        openComposer,
        closeComposer,
        isConnectModalOpen,
        setIsConnectModalOpen,
        isLogsModalOpen,
        setIsLogsModalOpen,
        selectedPostForAnalytics,
        setSelectedPostForAnalytics,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
