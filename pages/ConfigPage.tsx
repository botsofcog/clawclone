
import React, { useState } from 'react';
import { ConfigPageProps, CraneStyle, DropMode, ClawConfig } from '../types';

const Icons = {
    Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    Save: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    Bluetooth: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    Lock: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    Bolt: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Chip: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
    Sync: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

const CRANE_PROFILES: Record<string, Partial<ClawConfig>> = {
  PREMIUM: { payoutPercentage: 20, playTime: 25, hangTime: 500, grabTime: 1800, dropMode: DropMode.HOME_LOWER, strongGrabInterval: 15, descentSpeed: 60, liftSpeed: 60 },
  PLUSH:   { payoutPercentage: 33, playTime: 30, hangTime: 300, grabTime: 2000, dropMode: DropMode.HOME_RELEASE, strongGrabInterval: 8, descentSpeed: 80, liftSpeed: 80 },
  PROMO:   { payoutPercentage: 50, playTime: 45, hangTime: 200, grabTime: 2500, dropMode: DropMode.HOME_RELEASE, strongGrabInterval: 3, descentSpeed: 100, liftSpeed: 100 },
  CANDY:   { payoutPercentage: 40, playTime: 35, hangTime: 500, grabTime: 1200, dropMode: DropMode.HOME_LOWER, strongGrabInterval: 6, descentSpeed: 70, liftSpeed: 70 },
  LIMITED: { payoutPercentage: 15, playTime: 20, hangTime: 800, grabTime: 2200, dropMode: DropMode.HOME_LOWER, strongGrabInterval: 25, progressiveEnabled: true },
};

const PIN_GROUPS = [
    { label: 'Digital', options: ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'] },
    { label: 'Analog', options: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'] },
    { label: 'MCP Expander', options: Array.from({length: 16}, (_, i) => `MCP_${i}`) }
];

const PinSelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="bg-panel-900 border border-panel-700 rounded px-2 py-1 text-xs text-white flex-1 focus:ring-1 focus:ring-brand-500 outline-none h-8"
    >
        {PIN_GROUPS.map(g => (
            <optgroup key={g.label} label={g.label}>
                {g.options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </optgroup>
        ))}
    </select>
);

const ToggleSwitch = ({ checked, onChange, labelOn="ON", labelOff="OFF" }: { checked: boolean, onChange: (v: boolean) => void, labelOn?: string, labelOff?: string }) => (
    <div className="flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-green-600' : 'bg-panel-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
        </div>
        <span className={`ml-2 text-[10px] font-bold ${checked ? 'text-green-400' : 'text-slate-500'}`}>
            {checked ? labelOn : labelOff}
        </span>
    </div>
);

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

const ConfigPage: React.FC<ConfigPageProps> = ({ config, setConfig, showToast, sendCommand, simState }) => {

    const handleLiveSync = async () => {
        if(!simState.isConnected) {
            showToast("Machine Not Connected", "error");
            return;
        }

        // Send a batch of SET commands to update firmware in real-time
        await sendCommand(`SET:TIME:${config.playTime}`);
        await sendCommand(`SET:PAY:${config.payoutPercentage}`);
        await sendCommand(`SET:PWM:${config.grabStrengthStrong}`);
        
        // Visual feedback
        showToast("Config Synced to Machine", "success");
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto pb-20 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-8">
                 {/* HEADER */}
                 <div className="flex justify-between items-end border-b border-panel-700 pb-6">
                     <div>
                         <h2 className="text-3xl font-bold text-white tracking-tight">System Configuration</h2>
                         <p className="text-slate-400 mt-1">Configure timing, physics, electrical, and security parameters.</p>
                     </div>
                     <div className="flex gap-2">
                         <button 
                            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transition-all ${simState.isConnected ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20' : 'bg-panel-800 text-slate-500 cursor-not-allowed border border-panel-700'}`}
                            onClick={handleLiveSync}
                            disabled={!simState.isConnected}
                         >
                            <Icons.Sync /> {simState.isConnected ? 'LIVE SYNC' : 'OFFLINE'}
                         </button>
                         <button 
                            className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-colors text-white"
                            onClick={() => showToast("Configuration Saved", "success")}
                         >
                            <Icons.Save /> SAVE PROJECT
                         </button>
                     </div>
                 </div>

                 {/* SECTIONS */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     <CollapsiblePanel title="Crane Profile" icon={Icons.Settings} borderColor="border-brand-500">
                         <div className="grid grid-cols-3 gap-2">
                             {Object.keys(CRANE_PROFILES).map(p => (
                                 <button 
                                    key={p} 
                                    onClick={()=>{ setConfig({...config, ...CRANE_PROFILES[p], craneStyle: p as any}); showToast(`Profile ${p} Applied`, 'success'); }}
                                    className={`p-2 rounded-lg text-xs font-bold border transition-all ${config.craneStyle === p ? 'bg-brand-500 border-brand-400 text-white shadow-lg' : 'bg-panel-800 border-panel-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                                 >
                                     {p}
                                 </button>
                             ))}
                         </div>
                     </CollapsiblePanel>

                     <CollapsiblePanel title="Motor Tuning" icon={Icons.Bolt} borderColor="border-panel-600">
                         <div className="space-y-6">
                             <div>
                                 <div className="flex justify-between text-xs mb-2 font-mono text-slate-400"><span>TRAVEL SPEED</span><span className="text-brand-400">{config.travelSpeed}%</span></div>
                                 <input type="range" className="w-full accent-brand-500 bg-panel-700 h-2 rounded-lg appearance-none cursor-pointer" min="30" max="100" value={config.travelSpeed} onChange={e=>setConfig({...config, travelSpeed: parseInt(e.target.value)})} />
                             </div>
                             <div>
                                 <div className="flex justify-between text-xs mb-2 font-mono text-slate-400"><span>SOFT START RAMP</span><span className="text-brand-400">{config.softStartDuration}ms</span></div>
                                 <input type="range" className="w-full accent-brand-500 bg-panel-700 h-2 rounded-lg appearance-none cursor-pointer" min="0" max="1000" value={config.softStartDuration} onChange={e=>setConfig({...config, softStartDuration: parseInt(e.target.value)})} />
                             </div>
                         </div>
                     </CollapsiblePanel>
                     
                     {/* COMMUNICATION CONFIG */}
                     <CollapsiblePanel 
                        title="Communication & Security" 
                        icon={Icons.Bluetooth} 
                        borderColor="border-blue-500"
                        className="md:col-span-2"
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* USB/Serial */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Serial (USB)</h4>
                                <div>
                                    <label className="text-xs font-mono text-slate-400 block mb-1">BAUD RATE</label>
                                    <select value={config.serialBaudRate} onChange={e=>setConfig({...config, serialBaudRate: parseInt(e.target.value)})} className="w-full bg-panel-900 border border-panel-700 rounded px-3 py-2 text-xs text-white focus:ring-1 focus:ring-brand-500 outline-none">
                                        <option value="9600">9600</option>
                                        <option value="115200">115200 (Recommended)</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Wireless */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wireless (HC-05/06)</h4>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={config.wirelessEnabled} onChange={e=>setConfig({...config, wirelessEnabled: e.target.checked})} />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${config.wirelessEnabled ? 'bg-blue-500' : 'bg-panel-700'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.wirelessEnabled ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                                
                                {config.wirelessEnabled && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-mono text-slate-400 block mb-1">RX PIN</label>
                                                <PinSelect value={config.wirelessRxPin} onChange={v => setConfig({...config, wirelessRxPin: v})} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-mono text-slate-400 block mb-1">TX PIN</label>
                                                <PinSelect value={config.wirelessTxPin} onChange={v => setConfig({...config, wirelessTxPin: v})} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-slate-400 block mb-1">BT BAUD RATE</label>
                                            <select value={config.wirelessBaud} onChange={e=>setConfig({...config, wirelessBaud: parseInt(e.target.value)})} className="w-full bg-panel-900 border border-panel-700 rounded px-3 py-2 text-xs text-white focus:ring-1 focus:ring-brand-500 outline-none">
                                                <option value="9600">9600 (HC-05 Default)</option>
                                                <option value="38400">38400 (AT Mode)</option>
                                                <option value="115200">115200</option>
                                            </select>
                                        </div>
                                        
                                        {/* Security */}
                                        <div className="pt-2 border-t border-panel-700 mt-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Icons.Lock />
                                                    <span className="text-xs font-bold text-slate-300">SECURITY LAYER</span>
                                                </div>
                                                <input type="checkbox" checked={config.wirelessSecurityEnabled} onChange={e=>setConfig({...config, wirelessSecurityEnabled: e.target.checked})} className="rounded bg-panel-700 border-panel-600" />
                                            </div>
                                            {config.wirelessSecurityEnabled && (
                                                <div>
                                                    <label className="text-xs font-mono text-slate-400 block mb-1">PAIRING CODE</label>
                                                    <input 
                                                      type="text" 
                                                      value={config.wirelessPairingCode}
                                                      onChange={e => setConfig({...config, wirelessPairingCode: e.target.value.substring(0,8)})}
                                                      className="w-full bg-panel-900 border border-panel-700 rounded px-3 py-2 text-xs text-white focus:ring-1 focus:ring-accent-warning outline-none tracking-widest"
                                                      placeholder="1234"
                                                    />
                                                    <p className="text-[10px] text-slate-500 mt-1">Require AUTH:CODE to control machine.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                     </CollapsiblePanel>

                     <CollapsiblePanel 
                        title="Electrical & I/O Map" 
                        icon={Icons.Chip} 
                        borderColor="border-panel-600" 
                        className="md:col-span-2"
                     >
                         {/* PWM SETTINGS */}
                         <div className="mb-6 bg-panel-800/50 p-4 rounded-lg border border-panel-700">
                             <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Claw Strength (PWM)</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 font-mono text-slate-400"><span>WEAK GRAB (CARRY)</span><span className="text-brand-400">{config.grabStrengthWeak}</span></div>
                                    <input type="range" className="w-full accent-blue-500 bg-panel-700 h-2 rounded-lg appearance-none cursor-pointer" min="0" max="255" value={config.grabStrengthWeak} onChange={e=>setConfig({...config, grabStrengthWeak: parseInt(e.target.value)})} />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 font-mono text-slate-400"><span>STRONG GRAB</span><span className="text-brand-400">{config.grabStrengthStrong}</span></div>
                                    <input type="range" className="w-full accent-blue-500 bg-panel-700 h-2 rounded-lg appearance-none cursor-pointer" min="0" max="255" value={config.grabStrengthStrong} onChange={e=>setConfig({...config, grabStrengthStrong: parseInt(e.target.value)})} />
                                </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {Object.keys(config.pinMappings).map(k => (
                                 <div key={k} className="flex items-center gap-2 bg-panel-800 p-2 rounded-lg border border-panel-700">
                                     <label className="text-xs font-mono text-slate-400 w-24 truncate" title={k}>{k}</label>
                                     <PinSelect 
                                        value={config.pinMappings[k]} 
                                        onChange={v => setConfig({...config, pinMappings: {...config.pinMappings, [k]: v}})}
                                     />
                                     <ToggleSwitch 
                                        checked={config.invertInputs?.[k] || false} 
                                        onChange={v => setConfig({...config, invertInputs: {...config.invertInputs, [k]: v}})}
                                        labelOn="NO" labelOff="NC"
                                     />
                                 </div>
                             ))}
                         </div>
                     </CollapsiblePanel>
                 </div>
             </div>
        </div>
    );
};

export default ConfigPage;
