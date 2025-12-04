
import React, { useMemo, useState } from 'react';
import { AnalyticsPageProps } from '../types';
import { exportStatsToCSV, clearStats } from '../services/storage';

const Icons = {
    Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Chart: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
    List: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
};

const ERROR_DESCRIPTIONS: Record<number, string> = {
    1: "Motor X Fault: Stall detected or driver disconnected.",
    2: "Motor Y Fault: Stall detected or driver disconnected.",
    3: "Motor Z Fault: Stall detected or driver disconnected.",
    4: "Claw Circuit Open: Check wiring to solenoid or relay.",
    5: "EEPROM Corrupt: Settings reset to default values.",
    6: "Sensor Failure: Prize sensor stuck or disconnected.",
    7: "State Timeout: Machine stuck in a state too long.",
    8: "Position Lost: Homing required to reset coordinates.",
    9: "Low Memory: Heap fragmentation warning."
};

const CollapsiblePanel = ({ 
    title, 
    icon: Icon, 
    children, 
    defaultOpen = true, 
    borderColor = "border-panel-600",
    className = ""
}: {
    title: string, 
    icon?: any, 
    children: React.ReactNode, 
    defaultOpen?: boolean, 
    borderColor?: string,
    className?: string
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`glass-panel rounded-xl transition-all duration-300 border-t-4 ${borderColor} ${className}`}>
            <div 
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold flex items-center gap-2 select-none text-slate-200">
                    {Icon && <Icon />}
                    {title}
                </h3>
                <div className={`transform transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 border-t border-panel-800/50 pt-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ extStats, setExtStats, revenueData, showToast }) => {

    const handleExportCSV = () => {
        const csv = exportStatsToCSV(extStats);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clawos_stats_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showToast("CSV Exported", "success");
    };

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(extStats, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clawos_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        showToast("JSON Backup Exported", "success");
    };

    const handleResetStats = () => {
        if(window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
            setExtStats(clearStats());
            showToast("Stats Cleared", "success");
        }
    };

    // Chart Generation
    const chartPath = useMemo(() => {
        if (!revenueData || revenueData.length === 0) return { path: "", maxVal: 100 };
        
        // Safety: Filter out invalid data and ensure numbers
        const safeData = revenueData.map(d => ({...d, value: isNaN(Number(d.value)) ? 0 : Number(d.value)}));
        
        // Prevent div by zero if max is 0
        const rawMax = Math.max(...safeData.map(d => d.value));
        const maxVal = rawMax > 10 ? rawMax : 10; 
        
        if (safeData.length < 2) return { path: "", maxVal };
        
        const height = 150;
        const width = 1000;
        const stepX = width / (safeData.length - 1);
        
        let path = `M0,${height} `; // Start bottom-left
        
        safeData.forEach((d, i) => {
            const x = i * stepX;
            const y = height - ((d.value / maxVal) * height);
            // Ensure y is finite
            const safeY = isFinite(y) ? y : height;
            path += `L${x},${safeY} `;
        });

        path += `L${width},${height} Z`; // Close path
        return { path, maxVal };
    }, [revenueData]);

    return (
        <div className="flex-1 p-8 overflow-y-auto animate-fade-in custom-scrollbar">
             <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Center</h2>
                        <p className="text-slate-400 text-sm">Revenue tracking and system health monitoring.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 bg-panel-800 hover:bg-panel-700 rounded-lg border border-panel-600 text-xs font-bold text-slate-300 transition-colors shadow-sm">
                            <Icons.Download /> CSV
                        </button>
                        <button onClick={handleExportJSON} className="flex items-center gap-2 px-3 py-2 bg-panel-800 hover:bg-panel-700 rounded-lg border border-panel-600 text-xs font-bold text-slate-300 transition-colors shadow-sm">
                            <Icons.Download /> JSON
                        </button>
                        <button onClick={handleResetStats} className="flex items-center gap-2 px-3 py-2 bg-red-900/10 hover:bg-red-900/30 rounded-lg border border-red-900/30 text-xs font-bold text-red-400 transition-colors">
                            <Icons.Trash /> CLEAR
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-brand-500 shadow-lg">
                        <div className="text-4xl font-mono font-bold text-white mb-2">{extStats.lifetimePlays.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Plays</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-accent-success shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent-success/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-4xl font-mono font-bold text-accent-success mb-2">${extStats.lifetimeRevenue.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Gross Revenue</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-brand-400 shadow-lg">
                        <div className="text-4xl font-mono font-bold text-brand-400">
                            {extStats.lifetimePlays > 0 ? ((extStats.lifetimeWins / extStats.lifetimePlays) * 100).toFixed(1) : '0.0'}%
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Win Rate</div>
                    </div>
                </div>
                
                {/* Revenue Chart */}
                <CollapsiblePanel title="Hourly Revenue (Last 12h)" icon={Icons.Chart} borderColor="border-panel-700">
                    <div className="h-48 w-full relative">
                        {revenueData.length > 1 && chartPath.path ? (
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 150">
                                {/* Gradient Defs */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Grid Lines */}
                                <line x1="0" y1="150" x2="1000" y2="150" stroke="#334155" strokeWidth="1" />
                                <line x1="0" y1="75" x2="1000" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="0" y1="0" x2="1000" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                                {/* Area */}
                                <path d={chartPath.path} fill="url(#chartGradient)" />
                                
                                {/* Line */}
                                <path 
                                    d={chartPath.path.replace('Z', '').replace(`L1000,150`, '').replace(`M0,150`, `M0,${150 - (( (revenueData[0]?.value || 0) / chartPath.maxVal)*150)}`)} 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="3" 
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* Points */}
                                {revenueData.map((d, i) => {
                                    const x = i * (1000 / (revenueData.length - 1));
                                    const val = isNaN(d.value) ? 0 : d.value;
                                    const y = 150 - ((val / chartPath.maxVal) * 150);
                                    if(!isFinite(y)) return null;
                                    return (
                                        <g key={i} className="group">
                                            <circle cx={x} cy={y} r="4" fill="#10b981" className="transition-all group-hover:r-6" />
                                            {/* Tooltip */}
                                            <foreignObject x={x - 40} y={y - 40} width="80" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-panel-900 text-white text-[10px] text-center rounded py-1 border border-panel-600 shadow-xl">
                                                    ${val}
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}
                            </svg>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-600 text-sm">No revenue data available</div>
                        )}
                        
                        {/* X-Axis Labels */}
                        <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                            {revenueData.filter((_,i) => i % 2 === 0).map(d => (
                                <span key={d.time}>{d.time}</span>
                            ))}
                        </div>
                    </div>
                </CollapsiblePanel>

                {/* Detailed Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CollapsiblePanel title="Session History" icon={Icons.List} borderColor="border-panel-700">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-xs text-slate-500 bg-panel-800 px-2 py-1 rounded-full">{extStats.sessions.length} records</span>
                        </div>
                        <div className="overflow-hidden shadow-inner h-[400px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-panel-900/80 text-slate-500 font-mono text-[10px] uppercase sticky top-0 backdrop-blur-md">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Result</th>
                                        <th className="p-4 text-right">Dur</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-panel-700/50">
                                    {extStats.sessions.slice(0, 50).map(s => (
                                        <tr key={s.id} className="hover:bg-panel-700/30 transition-colors">
                                            <td className="p-4 font-mono text-slate-500 text-xs">{new Date(s.timestamp).toLocaleTimeString()}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${s.result === 'WIN' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-700/30 border-slate-600/30 text-slate-400'}`}>
                                                    {s.result}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs font-mono text-right text-slate-400">{s.duration.toFixed(1)}s</td>
                                        </tr>
                                    ))}
                                    {extStats.sessions.length === 0 && (
                                        <tr><td colSpan={3} className="p-8 text-center text-slate-600 italic">No games played yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CollapsiblePanel>
                    
                    <CollapsiblePanel title="System Logs" icon={Icons.Alert} borderColor="border-panel-700">
                         <div className="flex justify-between items-center mb-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${extStats.errorLog.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {extStats.errorLog.length} Issues
                            </span>
                        </div>
                        <div className="overflow-hidden shadow-inner h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                            {extStats.errorLog.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                    <div className="p-4 bg-panel-800 rounded-full mb-2 opacity-50"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                    <span className="text-sm italic">System Nominal. No errors.</span>
                                </div>
                            )}
                            {extStats.errorLog.map((err, i) => (
                                <div key={i} className="bg-panel-900/50 p-3 rounded-lg border border-panel-700/50 flex items-start gap-3 group hover:border-red-500/30 transition-colors">
                                    <div className="p-2 bg-red-500/10 text-red-400 rounded-md shrink-0 mt-0.5"><Icons.Alert /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-red-300 text-xs">Error Code {err.code}</span>
                                            <span className="text-[10px] text-slate-600 font-mono">{new Date(err.time).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 truncate">{ERROR_DESCRIPTIONS[err.code] || "Unknown error occurred."}</div>
                                        <div className="text-[10px] text-slate-600 mt-1 break-words">{err.msg}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsiblePanel>
                </div>
             </div>
        </div>
    );
};

export default AnalyticsPage;
