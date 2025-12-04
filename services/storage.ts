
import { ExternalStats, GameSession } from '../types';

const STORAGE_KEY = 'clawos_pro_stats_v2';

const DEFAULT_STATS: ExternalStats = {
  lifetimeRevenue: 0,
  lifetimePlays: 0,
  lifetimeWins: 0,
  errorLog: [],
  sessions: []
};

export const loadExternalStats = (): ExternalStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load stats", e);
    return DEFAULT_STATS;
  }
};

export const saveExternalStats = (stats: ExternalStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const logSession = (result: 'WIN' | 'LOSS', duration: number, credits: number) => {
  const stats = loadExternalStats();
  const session: GameSession = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: Date.now(),
    duration,
    result,
    creditsUsed: credits
  };
  
  stats.sessions.unshift(session); 
  if (stats.sessions.length > 2000) stats.sessions.pop(); // Cap history
  
  stats.lifetimePlays++;
  if (result === 'WIN') stats.lifetimeWins++;
  stats.lifetimeRevenue += credits; 
  
  saveExternalStats(stats);
  return stats;
};

export const logError = (code: number, msg: string) => {
  const stats = loadExternalStats();
  stats.errorLog.unshift({ code, msg, time: Date.now() });
  if (stats.errorLog.length > 100) stats.errorLog.pop();
  saveExternalStats(stats);
  return stats;
};

export const clearStats = () => {
    saveExternalStats(DEFAULT_STATS);
    return DEFAULT_STATS;
}

// Chart Helpers
export const getRevenueData = (stats: ExternalStats) => {
    const hours = new Map<string, number>();
    const now = new Date();
    // Initialize last 12 hours
    for(let i=11; i>=0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        const k = `${d.getHours()}:00`;
        hours.set(k, 0);
    }
    
    // Aggregate
    stats.sessions.forEach(s => {
        if(Date.now() - s.timestamp < 12 * 60 * 60 * 1000) {
            const d = new Date(s.timestamp);
            const k = `${d.getHours()}:00`;
            if(hours.has(k)) hours.set(k, hours.get(k)! + s.creditsUsed);
        }
    });
    
    return Array.from(hours.entries()).map(([time, value]) => ({ time, value }));
};

// Export Helpers
export const exportStatsToCSV = (stats: ExternalStats): string => {
    const headers = ['Session ID', 'Timestamp', 'Date', 'Time', 'Result', 'Duration (s)', 'Credits'];
    const rows = stats.sessions.map(s => {
        const d = new Date(s.timestamp);
        return [
            s.id,
            s.timestamp,
            d.toLocaleDateString(),
            d.toLocaleTimeString(),
            s.result,
            s.duration.toFixed(2),
            s.creditsUsed
        ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
};
