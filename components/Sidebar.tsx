
import React from 'react';

const Icons = {
  Dash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  Stats: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Code: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Usb: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  Fix: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isConnected: boolean;
  onConnectClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isConnected, onConnectClick }) => {
  return (
    <aside className="w-20 lg:w-64 bg-panel-900 border-r border-panel-700 flex flex-col items-center lg:items-stretch z-20 shadow-2xl">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-panel-700 bg-panel-800/50">
          <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20 bg-gradient-to-br from-brand-400 to-brand-600">C</div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight text-slate-200">CLAW<span className="text-brand-400">OS</span></span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-2">
         {[
           {id: 'monitor', label: 'Monitor', icon: Icons.Dash},
           {id: 'config', label: 'Config', icon: Icons.Settings},
           {id: 'diag', label: 'Diagnostics', icon: Icons.Fix},
           {id: 'history', label: 'Analytics', icon: Icons.Stats},
           {id: 'code', label: 'Firmware', icon: Icons.Code}
         ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${activeTab === item.id 
                 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' 
                 : 'text-slate-400 hover:bg-panel-800 hover:text-white'}`}
             >
                <div className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <item.icon />
                </div>
                <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
             </button>
         ))}
      </nav>

      <div className="p-4 border-t border-panel-700 bg-panel-800/30">
         <button 
            onClick={onConnectClick}
            className={`w-full flex items-center justify-center lg:justify-start p-2 rounded-lg border transition-all duration-200 ${
                isConnected 
                ? 'border-accent-success/30 bg-accent-success/10 text-accent-success hover:bg-accent-success/20' 
                : 'border-slate-600 bg-panel-800 text-slate-400 hover:border-slate-400 hover:text-white'
            }`}
         >
            <Icons.Usb />
            <span className="hidden lg:block ml-3 text-xs font-mono font-bold tracking-wide">
                {isConnected ? 'ONLINE' : 'CONNECT'}
            </span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
