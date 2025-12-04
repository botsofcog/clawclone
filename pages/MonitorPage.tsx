
import React, { useRef, useState, useEffect } from 'react';
import { MonitorPageProps, MachineState, HatchPosition } from '../types';

const Icons = {
    Play: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Terminal: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Pause: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const Joystick = ({ onMove, onStop, disabled }: { onMove: (x: number, y: number) => void, onStop: () => void, disabled: boolean }) => {
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if(disabled) return;
        setActive(true);
        updatePos(e);
    };

    const handleEnd = () => {
        if(!active) return;
        setActive(false);
        setPos({ x: 0, y: 0 });
        onStop();
    };

    const updatePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = rect.width / 2;

        // Clamp
        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }

        setPos({ x: dx, y: dy });

        // Normalize -1 to 1 and send
        const normX = dx / maxDist;
        const normY = -(dy / maxDist); // Invert Y because Up is negative in screen pixels
        
        // Thresholding
        const sendX = Math.abs(normX) > 0.3 ? (normX > 0 ? 1 : -1) : 0;
        const sendY = Math.abs(normY) > 0.3 ? (normY > 0 ? 1 : -1) : 0;
        
        onMove(sendX, sendY);
    };

    useEffect(() => {
        const move = (e: MouseEvent | TouchEvent) => { if(active) updatePos(e); };
        const up = () => { if(active) handleEnd(); };
        
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move);
        window.addEventListener('touchend', up);

        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        }
    }, [active]);

    return (
        <div className="flex flex-col items-center">
            <div 
                ref={ref}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className={`w-32 h-32 rounded-full border-4 relative flex items-center justify-center shadow-inner transition-colors ${disabled ? 'bg-panel-800 border-panel-700 opacity-50 cursor-not-allowed' : 'bg-black/40 border-slate-600 cursor-move'}`}
            >
                {/* Base */}
                <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600 shadow-lg absolute"></div>
                
                {/* Stick */}
                <div 
                    className="w-12 h-12 bg-red-600 rounded-full absolute shadow-[0_5px_10px_rgba(0,0,0,0.5)] border-b-4 border-red-800 z-10"
                    style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                >
                    <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full"></div>
                </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Joystick (Drag)</span>
        </div>
    );
};

const MonitorPage: React.FC<MonitorPageProps> = ({ config, simState, isSimulating, startTestPlay, stopTestPlay, sendCommand }) => {
    const termRef = useRef<HTMLDivElement>(null);
    const [serialInput, setSerialInput] = useState('');

    const handleSerialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!serialInput.trim()) return;
        sendCommand(serialInput);
        setSerialInput('');
    };

    // Auto-scroll terminal
    useEffect(() => {
        if(termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
    }, [simState.logs]);

    const isPlayActive = simState.currentState === MachineState.PLAY;

    const handleJoyMove = (x: number, y: number) => {
        if (x === 0 && y === 0) {
            sendCommand('DIAG:STOP');
        } else {
            if (x !== 0) sendCommand(`DIAG:MOVE:X:${x}`);
            if (y !== 0) sendCommand(`DIAG:MOVE:Y:${y}`);
        }
    };

    return (
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto animate-fade-in pb-20">
             {/* LEFT COLUMN: VISUALIZER */}
             <div className="lg:col-span-2 flex flex-col gap-6">
                 
                 {/* 3D VIEWPORT */}
                 <div className="glass-panel rounded-2xl p-1 relative overflow-hidden flex flex-col h-[500px] shadow-2xl shadow-black/50 border border-panel-700 bg-black">
                     
                     {/* OVERLAY STATUS */}
                     <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <div className="flex gap-2">
                             <span className={`px-3 py-1 rounded-sm text-xs font-display font-bold border backdrop-blur-md shadow-lg transition-colors duration-500 uppercase tracking-widest ${simState.currentState === 'ERROR' ? 'bg-red-900/50 border-red-500 text-red-400 animate-pulse' : 'bg-panel-900/80 border-panel-600 text-brand-400'}`}>
                                {simState.currentState} MODE
                            </span>
                            {simState.isConnected && (
                                <span className="px-2 py-1 rounded-sm text-[10px] font-bold border bg-green-500/20 border-green-500 text-green-400 flex items-center gap-1 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> LIVE
                                </span>
                            )}
                        </div>
                        
                        {!simState.isConnected && (
                            isSimulating ? (
                             <button onClick={stopTestPlay} className="px-3 py-1 rounded-sm text-xs font-display font-bold border bg-amber-500/20 border-amber-500 text-amber-500 hover:bg-amber-500/30 flex items-center gap-2 backdrop-blur-md transition-all shadow-lg cursor-pointer z-20 self-start">
                                 <Icons.Pause /> PAUSE SIM
                             </button>
                            ) : (
                             <button onClick={startTestPlay} className="px-3 py-1 rounded-sm text-xs font-display font-bold border bg-accent-success/20 border-accent-success text-accent-success hover:bg-accent-success/30 flex items-center gap-2 backdrop-blur-md transition-all shadow-lg cursor-pointer z-20 self-start">
                                 <Icons.Play /> START SIM
                             </button>
                            )
                        )}
                     </div>
                     
                     {/* CREDITS OVERLAY */}
                     <div className="absolute top-4 right-4 z-10 flex flex-col items-end pointer-events-none">
                        <div className="bg-panel-900/90 border border-panel-600 rounded-lg p-2 flex flex-col items-end shadow-xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Credits</span>
                            <span className="text-3xl font-display font-bold text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">{simState.credits}</span>
                        </div>
                        {simState.credits === 0 && <div className="mt-2 text-xs font-bold text-white animate-pulse bg-red-600 px-2 py-1 rounded">INSERT COIN TO START</div>}
                     </div>

                     {/* 3D SCENE */}
                     <div className="flex-1 bg-gradient-to-b from-panel-900 to-panel-950 relative flex items-center justify-center overflow-hidden perspective-[1000px]">
                        
                        {/* Floor */}
                        <div className="absolute w-[200%] h-[200%] opacity-20" style={{
                             backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                             backgroundSize: '40px 40px',
                             transform: 'rotateX(60deg) translateY(200px) translateZ(-100px)'
                        }}></div>

                        {/* Machine Frame Bounds */}
                        <div className="absolute w-[500px] h-[500px] border-4 border-panel-700/50 rounded-lg transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 shadow-2xl" 
                             style={{transform: 'translate(-50%, -40%) rotateX(50deg)'}}>
                            
                            {/* Hatch Zone */}
                            <div className={`absolute w-32 h-32 border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)] flex items-center justify-center
                                ${config.hatchPosition === HatchPosition.BOTTOM_LEFT ? 'bottom-4 left-4' : ''}
                                ${config.hatchPosition === HatchPosition.BOTTOM_RIGHT ? 'bottom-4 right-4' : ''}
                                ${config.hatchPosition === HatchPosition.TOP_LEFT ? 'top-4 left-4' : ''}
                                ${config.hatchPosition === HatchPosition.TOP_RIGHT ? 'top-4 right-4' : ''}
                            `}>
                                <div className="text-[10px] text-yellow-500 font-bold opacity-70 tracking-widest">DROP</div>
                            </div>
                            
                            {/* Claw Shadow */}
                            <div 
                                className="absolute bg-black rounded-full blur-lg transition-all duration-75 ease-linear opacity-60 pointer-events-none"
                                style={{
                                    left: `${simState.posX}%`, 
                                    bottom: `${simState.posY}%`, // CSS Bottom maps to Y logic
                                    transform: 'translate(-50%, 50%)',
                                    width: `${40 + (simState.posZ * 0.4)}px`,
                                    height: `${40 + (simState.posZ * 0.2)}px`,
                                }}
                            />

                            {/* Gantry Rail (X Axis) */}
                            <div className="absolute top-0 bottom-0 w-6 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 shadow-xl transition-all duration-75 ease-linear border-x border-slate-800"
                                 style={{ left: `${simState.posX}%`, transform: `translateX(-50%) translateZ(100px)` }}>
                                 
                                 {/* Trolley (Y Axis) */}
                                 <div className="absolute w-12 h-14 bg-slate-600 border border-slate-400 rounded shadow-md transition-all duration-75 ease-linear z-10 flex justify-center"
                                      style={{ bottom: `${simState.posY}%`, left: '50%', transform: 'translate(-50%, 50%)' }}>
                                      
                                      {/* Cable */}
                                      <div className="absolute top-full w-0.5 bg-slate-400 origin-top shadow-sm"
                                           style={{ height: `${(simState.posZ * 3) + 20}px` }}></div>

                                      {/* CLAW HEAD with Visual Sway */}
                                      <div className="absolute z-20 w-16 h-16 pointer-events-none transition-all duration-75 ease-linear"
                                           style={{
                                               top: `${(simState.posZ * 3) + 20}px`, // Physical descent
                                               left: '50%',
                                               transform: 'translateX(-50%)',
                                               animation: simState.currentState === MachineState.PLAY ? 'bounceSlight 3s infinite ease-in-out' : 'none' // VISUAL SWAY ONLY
                                           }}>
                                           
                                           {/* Solenoid Housing */}
                                           <div className="w-8 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-lg shadow-lg border border-brand-400/50 mx-auto relative z-20">
                                                <div className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
                                           </div>
                                           
                                           {/* Fingers Container */}
                                           <div className="relative w-full h-full -mt-2">
                                                {/* Left Finger */}
                                                <div 
                                                    className="absolute top-0 left-4 w-1.5 h-12 bg-slate-300 rounded-b-full origin-top transition-transform duration-300"
                                                    style={{ transform: simState.clawOpen ? 'rotate(25deg)' : 'rotate(5deg) translateX(4px)' }}
                                                >
                                                    <div className="w-2 h-4 bg-slate-400 absolute bottom-0 -left-0.5 rounded-full"></div>
                                                </div>
                                                
                                                {/* Right Finger */}
                                                <div 
                                                    className="absolute top-0 right-4 w-1.5 h-12 bg-slate-300 rounded-b-full origin-top transition-transform duration-300"
                                                    style={{ transform: simState.clawOpen ? 'rotate(-25deg)' : 'rotate(-5deg) translateX(-4px)' }}
                                                >
                                                     <div className="w-2 h-4 bg-slate-400 absolute bottom-0 -left-0.5 rounded-full"></div>
                                                </div>

                                                {/* Middle Finger (Back) */}
                                                <div 
                                                    className="absolute top-0 left-1/2 w-1.5 h-10 bg-slate-400 rounded-b-full origin-top transition-transform duration-300 -z-10"
                                                    style={{ transform: simState.clawOpen ? 'translateX(-50%) scale(0.8) rotate(0deg)' : 'translateX(-50%) scale(0.8) rotate(0deg) translateY(4px)' }}
                                                ></div>
                                           </div>
                                      </div>
                                 </div>
                            </div>
                        </div>
                     </div>
                 </div>

                 {/* SERIAL TERMINAL */}
                 <div className="h-48 glass-panel rounded-xl flex flex-col overflow-hidden border border-panel-700">
                    <div className="px-3 py-2 bg-panel-800/80 border-b border-panel-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center">
                        <span className="flex items-center gap-2"><Icons.Terminal /> System Serial Log</span>
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-mono">{simState.logs.length} Lines</span>
                             <span className={`w-2 h-2 rounded-full ${simState.isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
                        </div>
                    </div>
                    <div className="flex-1 p-3 font-mono text-xs overflow-y-auto flex flex-col-reverse bg-panel-950/50" ref={termRef}>
                        {simState.logs.map((l, i) => (
                            <div key={i} className="mb-0.5 text-slate-400 break-all hover:bg-white/5 px-1 rounded transition-colors">
                                <span className="text-slate-600 mr-2">[{new Date(l.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span> 
                                <span className={l.content.includes("ERR") ? "text-red-400 font-bold" : (l.content.includes("EVT") ? "text-brand-400" : "text-slate-300")}>{l.content}</span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSerialSubmit} className="p-2 border-t border-panel-700 flex gap-2 bg-panel-800">
                        <span className="text-brand-500 font-mono self-center font-bold">{'>'}</span>
                        <input 
                            type="text" 
                            value={serialInput} 
                            onChange={e => setSerialInput(e.target.value)} 
                            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder-slate-600 focus:ring-0" 
                            placeholder="Send raw G-Code or Commands..."
                            disabled={!simState.isConnected}
                        />
                    </form>
                 </div>
             </div>

             {/* RIGHT COLUMN: ARCADE DECK */}
             <div className="space-y-6">
                 
                 {/* CONTROL PANEL */}
                 <div className="metal-panel rounded-xl p-1 shadow-2xl relative">
                    {/* Screw Heads */}
                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner"></div>
                    
                    <div className="bg-panel-900/50 p-6 rounded-lg border border-white/5 flex flex-col items-center gap-8">
                        <div className="text-center">
                            <h3 className="text-slate-300 font-display font-bold text-lg tracking-widest border-b-2 border-brand-500 inline-block px-4 pb-1">CONTROL DECK</h3>
                        </div>

                        {/* COIN SLOT */}
                        <div className="w-full flex justify-center">
                            <button 
                                onClick={()=>sendCommand('R:COIN')}
                                className="group relative bg-slate-800 p-2 rounded border border-slate-600 hover:border-brand-500 transition-all active:scale-95 shadow-lg"
                            >
                                <div className="w-12 h-16 bg-black rounded flex items-center justify-center border-2 border-slate-700 relative overflow-hidden">
                                    <div className="w-1 h-8 bg-black border border-slate-800 rounded-full"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-slate-400 group-hover:text-brand-400 whitespace-nowrap">INSERT COIN</div>
                                {/* Coin animation hint */}
                                {simState.credits === 0 && <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                            </button>
                        </div>

                        {/* JOYSTICK & BUTTON */}
                        <div className="grid grid-cols-2 gap-8 w-full items-center mt-4">
                            <Joystick 
                                onMove={handleJoyMove} 
                                onStop={() => sendCommand('DIAG:STOP')} 
                                disabled={!isPlayActive && !simState.isConnected}
                            />

                            {/* BUTTON */}
                            <div className="flex flex-col items-center">
                                <button 
                                    onClick={()=>sendCommand('R:DROP')}
                                    disabled={!isPlayActive}
                                    className={`w-20 h-20 rounded-full border-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all active:scale-95 active:shadow-none flex items-center justify-center relative overflow-hidden
                                        ${isPlayActive 
                                            ? 'bg-green-500 border-green-700 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse' 
                                            : 'bg-slate-700 border-slate-800 cursor-not-allowed opacity-50'}
                                    `}
                                >
                                    <span className="font-display font-bold text-white text-sm drop-shadow-md z-10">DROP</span>
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
                                </button>
                                <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Action</span>
                            </div>

                        </div>
                    </div>
                 </div>

                 {/* SENSOR READOUTS */}
                 <div className="glass-panel rounded-xl p-4 border border-panel-700">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-panel-700 pb-2">Sensor Telemetry</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Limits */}
                        <div className={`p-2 rounded border text-center ${simState.telemetry.inputs.limX ? 'bg-brand-900/40 border-brand-500 text-brand-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                            <div className="text-[9px] font-bold">X-HOME</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${simState.telemetry.inputs.limY ? 'bg-brand-900/40 border-brand-500 text-brand-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                            <div className="text-[9px] font-bold">Y-HOME</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${simState.telemetry.inputs.limZTop ? 'bg-brand-900/40 border-brand-500 text-brand-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                            <div className="text-[9px] font-bold">Z-TOP</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${simState.telemetry.inputs.limZBot ? 'bg-brand-900/40 border-brand-500 text-brand-400' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                            <div className="text-[9px] font-bold">Z-BOT</div>
                        </div>
                    </div>
                    {/* Prize Sensor */}
                    <div className={`mt-2 p-2 rounded border flex justify-between items-center ${simState.telemetry.inputs.prize ? 'bg-accent-success/20 border-accent-success text-accent-success' : 'bg-panel-800 border-panel-700 text-slate-600'}`}>
                        <span className="text-[10px] font-bold">OPTICAL SENSOR</span>
                        <div className={`w-2 h-2 rounded-full ${simState.telemetry.inputs.prize ? 'bg-accent-success animate-ping' : 'bg-slate-700'}`}></div>
                    </div>
                 </div>

             </div>
        </div>
    );
};

export default MonitorPage;
