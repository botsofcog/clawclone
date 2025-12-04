
import React, { useState } from 'react';
import { DiagnosticsPageProps } from '../types';

const Icons = {
    Fix: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Input: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Grid: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Map: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
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
                <h3 className="text-sm font-bold flex items-center gap-2 select-none text-slate-300 uppercase tracking-widest">
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

const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ 
    config, simState, overrideValues, setOverrideValues, 
    diagClawState, setDiagClawState, diagExpState, setDiagExpState, 
    sendCommand, sendAuth 
}) => {

    const isConnected = simState.isConnected; // Strictly check connection for safety

    const handleOverride = (axis: 'X'|'Y'|'Z', val: number) => {
        if(!isConnected) return;
        setOverrideValues({...overrideValues, [axis]: val});
        sendCommand(`DIAG:${axis}:${val}`);
    };

    const toggleClaw = () => {
        if(!isConnected) return;
        const newState = !diagClawState;
        setDiagClawState(newState);
        sendCommand(`DIAG:CLAW:${newState ? 1 : 0}`);
    };

    const toggleExpansion = () => {
        if(!isConnected) return;
        const newState = !diagExpState;
        setDiagExpState(newState);
        sendCommand(`DIAG:EXP:${newState ? 1 : 0}`);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
             
             {/* OFFLINE LOCK OVERLAY */}
             {!isConnected && (
                 <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                     <div className="p-4 bg-panel-900 border border-panel-700 rounded-2xl shadow-2xl max-w-md">
                         <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <Icons.Fix />
                         </div>
                         <h2 className="text-xl font-bold text-white mb-2">Diagnostics Locked</h2>
                         <p className="text-slate-400 text-sm mb-4">Hardware control is disabled because the machine is disconnected. Connect via USB or Bluetooth to access manual overrides.</p>
                         <div className="px-3 py-1 bg-panel-800 rounded text-xs font-mono text-slate-500">Connect in Monitor Tab</div>
                     </div>
                 </div>
             )}

             <div className={`max-w-5xl mx-auto space-y-8 transition-all ${!isConnected ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                 
                 <div className="flex justify-between items-center border-b border-panel-700 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Icons.Fix /> Hardware Diagnostics</h2>
                    <div className="flex gap-4 items-center">
                        {config.wirelessSecurityEnabled && (
                            <button onClick={sendAuth} className="px-3 py-1 bg-brand-900/50 border border-brand-500/50 text-brand-400 text-xs rounded hover:bg-brand-900 transition-colors">
                                SEND AUTH
                            </button>
                        )}
                        <div className="text-green-500 text-xs font-bold px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-full animate-pulse">SYSTEM LIVE</div>
                    </div>
                 </div>

                 {/* INPUT BOARD */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {/* OPERATOR INPUTS */}
                     <CollapsiblePanel title="Operator Inputs" icon={Icons.Input} borderColor="border-panel-600">
                         <div className="grid grid-cols-2 gap-3">
                             {['coin', 'drop', 'prize', 'up', 'down', 'left', 'right'].map(key => (
                                 <div key={key} className={`p-3 rounded border flex justify-between items-center ${simState.telemetry.inputs[key as keyof typeof simState.telemetry.inputs] ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                                    <span className="font-bold text-xs uppercase">{key}</span>
                                    <div className={`w-3 h-3 rounded-full ${simState.telemetry.inputs[key as keyof typeof simState.telemetry.inputs] ? 'bg-green-500 shadow-sm shadow-green-500' : 'bg-panel-600'}`}></div>
                                 </div>
                             ))}
                         </div>
                     </CollapsiblePanel>

                     {/* SAFETY LIMITS */}
                     <CollapsiblePanel title="Safety Limits" icon={Icons.Shield} borderColor="border-panel-600">
                         <div className="space-y-3">
                             {['limX', 'limY', 'limZTop', 'limZBot'].map(key => (
                                 <div key={key} className={`p-3 rounded border flex justify-between items-center ${simState.telemetry.inputs[key as keyof typeof simState.telemetry.inputs] ? 'bg-brand-900/30 border-brand-500 text-brand-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                                    <span className="font-bold text-xs uppercase">{key.replace('lim', '')} AXIS</span>
                                    <div className={`w-3 h-3 rounded-full ${simState.telemetry.inputs[key as keyof typeof simState.telemetry.inputs] ? 'bg-brand-500 shadow-sm shadow-brand-500' : 'bg-panel-600'}`}></div>
                                 </div>
                             ))}
                         </div>
                     </CollapsiblePanel>
                     
                     {/* LCD KEYPAD */}
                     <CollapsiblePanel title="LCD Keypad" icon={Icons.Grid} borderColor="border-panel-600">
                         <div className="grid grid-cols-3 gap-2">
                             <div className="col-start-2 flex justify-center"><div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-xs ${simState.telemetry.inputs.lcdUp ? 'bg-blue-600 border-blue-400 text-white' : 'bg-panel-800 border-panel-700'}`}>UP</div></div>
                             <div className="col-start-1 row-start-2 flex justify-center"><div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-xs ${simState.telemetry.inputs.lcdLeft ? 'bg-blue-600 border-blue-400 text-white' : 'bg-panel-800 border-panel-700'}`}>LT</div></div>
                             <div className="col-start-2 row-start-2 flex justify-center"><div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-xs ${simState.telemetry.inputs.lcdSelect ? 'bg-green-600 border-green-400 text-white' : 'bg-panel-800 border-panel-700'}`}>SEL</div></div>
                             <div className="col-start-3 row-start-2 flex justify-center"><div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-xs ${simState.telemetry.inputs.lcdRight ? 'bg-blue-600 border-blue-400 text-white' : 'bg-panel-800 border-panel-700'}`}>RT</div></div>
                             <div className="col-start-2 row-start-3 flex justify-center"><div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-xs ${simState.telemetry.inputs.lcdDown ? 'bg-blue-600 border-blue-400 text-white' : 'bg-panel-800 border-panel-700'}`}>DN</div></div>
                         </div>
                     </CollapsiblePanel>
                 </div>

                 {/* PIN MAP VERIFICATION */}
                 <CollapsiblePanel title="Active Pin Map Configuration" icon={Icons.Map} borderColor="border-panel-700">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {Object.entries(config.pinMappings).map(([func, pin]) => (
                             <div key={func} className="flex flex-col text-xs bg-panel-800 p-2 rounded">
                                 <span className="text-slate-500 font-bold">{func}</span>
                                 <span className="text-brand-400 font-mono">{pin}</span>
                             </div>
                         ))}
                     </div>
                 </CollapsiblePanel>
                 
                 {/* HARDWARE OVERRIDES */}
                 <CollapsiblePanel title="Manual Overrides" icon={Icons.Fix} borderColor="border-red-500" defaultOpen={true}>
                     <div className="flex justify-end mb-4">
                        <button onClick={()=>{ handleOverride('X',0); handleOverride('Y',0); handleOverride('Z',0); setOverrideValues({X:0,Y:0,Z:0}) }} className="text-xs text-red-400 hover:text-white underline">RESET ALL MOTORS</button>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                             {['X', 'Y', 'Z'].map(axis => (
                                 <div key={axis}>
                                     <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                         <span>MOTOR {axis}</span>
                                         <span className={overrideValues[axis as 'X'|'Y'|'Z'] !== 0 ? 'text-red-400' : 'text-slate-600'}>
                                            {overrideValues[axis as 'X'|'Y'|'Z'] === 0 ? 'IDLE' : `${overrideValues[axis as 'X'|'Y'|'Z'] > 0 ? 'FWD' : 'REV'} ${Math.abs(overrideValues[axis as 'X'|'Y'|'Z'] * 100).toFixed(0)}%`}
                                         </span>
                                     </div>
                                     {/* VISUAL INDICATOR */}
                                     <div className="h-2 bg-panel-800 rounded-full mb-2 relative overflow-hidden flex justify-center">
                                         <div className="w-[1px] h-full bg-slate-600 absolute"></div>
                                         {overrideValues[axis as 'X'|'Y'|'Z'] !== 0 && (
                                            <div 
                                                className={`h-full absolute transition-all duration-100 ${overrideValues[axis as 'X'|'Y'|'Z'] > 0 ? 'bg-green-500 right-1/2 rounded-r-full origin-left' : 'bg-red-500 left-1/2 rounded-l-full origin-right'}`}
                                                style={{width: `${Math.abs(overrideValues[axis as 'X'|'Y'|'Z']) * 50}%`, left: overrideValues[axis as 'X'|'Y'|'Z'] < 0 ? `${(1+overrideValues[axis as 'X'|'Y'|'Z'])*50}%` : '50%'}}
                                            ></div>
                                         )}
                                     </div>
                                     <input 
                                        type="range" 
                                        min="-1" max="1" step="0.1" 
                                        value={overrideValues[axis as 'X'|'Y'|'Z']}
                                        onChange={(e) => handleOverride(axis as any, parseFloat(e.target.value))}
                                        className="w-full accent-red-500 bg-panel-700 h-4 rounded-lg appearance-none cursor-pointer hover:bg-panel-600" 
                                     />
                                     <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                                         <span>{'<<< REV'}</span>
                                         <span>STOP</span>
                                         <span>{'FWD >>>'}</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={toggleClaw}
                                className={`rounded-xl flex flex-col items-center justify-center p-4 border-2 transition-all ${diagClawState ? 'bg-brand-600 border-brand-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-panel-800 border-panel-600 text-slate-400 hover:border-slate-400'}`}
                             >
                                 <div className="text-3xl font-bold mb-2">{diagClawState ? 'CLOSED' : 'OPEN'}</div>
                                 <div className="text-xs uppercase tracking-widest">Claw Solenoid</div>
                             </button>
                             
                             <button 
                                onClick={toggleExpansion}
                                className={`rounded-xl flex flex-col items-center justify-center p-4 border-2 transition-all ${diagExpState ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'bg-panel-800 border-panel-600 text-slate-400 hover:border-slate-400'}`}
                             >
                                 <div className="text-3xl font-bold mb-2">{diagExpState ? 'ON' : 'OFF'}</div>
                                 <div className="text-xs uppercase tracking-widest">Expansion I/O</div>
                             </button>
                         </div>
                     </div>
                 </CollapsiblePanel>
             </div>
        </div>
    );
};

export default DiagnosticsPage;
