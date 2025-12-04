
import React, { useState, useEffect, useRef } from 'react';
import { FirmwarePageProps } from '../types';
import { generateArduinoCode } from '../services/codeGenerator';

const Icons = {
    Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    Refresh: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Lock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    Unlock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Copy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const SNIPPETS = [
    { label: "Debug Macro", code: "#define DEBUG_PRINT(x) Serial.println(x)" },
    { label: "NeoPixel Lib", code: "#include <Adafruit_NeoPixel.h>\n#define LED_PIN 6\n#define LED_COUNT 60\nAdafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);" },
    { label: "Servo Claw", code: "#include <Servo.h>\nServo clawServo;\n// In Setup:\n// clawServo.attach(9);" },
    { label: "Music Player", code: "void playMusic() {\n  // Add tone() logic here\n  tone(SPEAKER_PIN, 440, 100);\n}" }
];

const SECTIONS = [
    { label: "Includes & Pins", search: "#include" },
    { label: "Config Struct", search: "struct SysConfig" },
    { label: "Globals", search: "// --- GLOBALS ---" },
    { label: "Setup()", search: "void setup()" },
    { label: "Loop()", search: "void loop()" },
    { label: "State Machine", search: "switch(state)" },
    { label: "Motor Logic", search: "void updateMotors()" },
    { label: "Telemetry", search: "void reportTelemetry" },
    { label: "Serial Parser", search: "void parseCommand()" }
];

const FirmwarePage: React.FC<FirmwarePageProps> = ({ config, valResult, setConfig, showToast }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [actionType, setActionType] = useState<'copy' | 'download'>('copy');
    const [activeMenu, setActiveMenu] = useState<'none' | 'jump' | 'inject'>('none');
    
    // Editor State
    const [code, setCode] = useState<string>(generateArduinoCode(config));
    const [isManualEdit, setIsManualEdit] = useState(false);
    const [isLocked, setIsLocked] = useState(true); 
    
    // Refs for scrolling elements
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const codeBlockRef = useRef<HTMLElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    // Auto-Regenerate when config changes (only if not manually editing)
    useEffect(() => {
        if (!isManualEdit) {
            const newCode = generateArduinoCode(config);
            setCode(newCode);
        }
    }, [config, isManualEdit]);

    // Syntax Highlighting Effect
    useEffect(() => {
        if (codeBlockRef.current && (window as any).Prism) {
            // Slight delay ensures DOM is ready
            setTimeout(() => {
                if(codeBlockRef.current) (window as any).Prism.highlightElement(codeBlockRef.current);
            }, 50);
        }
    }, [code, isLocked]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isLocked) return;
        const newValue = e.target.value;
        if (!isManualEdit) setIsManualEdit(true);
        setCode(newValue);
    };

    // Synchronized Scrolling Logic
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = scrollTop;
        }
    };

    const jumpToSection = (search: string) => {
        setActiveMenu('none'); // Close menu
        const lines = code.split('\n');
        const lineIndex = lines.findIndex(line => line.includes(search));
        
        if (lineIndex !== -1) {
             const LINE_HEIGHT = 24; // Matched strictly in CSS
             const targetScroll = lineIndex * LINE_HEIGHT;
             
             // Scroll the SINGLE scroll container
             if (scrollContainerRef.current) {
                 scrollContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
             }
             
             showToast(`Jumped to line ${lineIndex + 1}`, "success");
        } else {
            showToast("Section not found", "error");
        }
    };

    const handleRevert = () => {
        if (window.confirm("Discard all manual changes and revert to configuration?")) {
            const newCode = generateArduinoCode(config);
            setCode(newCode);
            setIsManualEdit(false);
            
            // Reset Scroll
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
            
            showToast("Reverted to Config", "success");
        }
    };

    const handleInject = (snippetCode: string) => {
        setActiveMenu('none'); // Close menu
        if (isLocked) { 
            if(window.confirm("Editor is locked. Unlock to inject code?")) {
                setIsLocked(false);
                setIsManualEdit(true);
            } else {
                return;
            }
        }
        
        // Inject at top
        const timestamp = new Date().toLocaleTimeString();
        const header = `// >>> INJECTED SNIPPET: ${timestamp} <<<`;
        const footer = `// >>> END SNIPPET <<<`;
        const newCode = `${header}\n${snippetCode}\n${footer}\n\n${code}`;
        
        setCode(newCode);
        if(!isManualEdit) setIsManualEdit(true);
        showToast("Snippet Injected at Line 1", "success");
        
        // Scroll to top
        setTimeout(() => {
             if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }, 100);
    };

    const handleAction = () => {
        if (actionType === 'copy') {
            navigator.clipboard.writeText(code);
            showToast("Code Copied to Clipboard", "success");
        } else {
            const blob = new Blob([code], { type: 'text/x-c' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `clawos_firmware_${isManualEdit ? 'custom' : 'v5'}.ino`;
            a.click();
            window.URL.revokeObjectURL(url);
            showToast("Firmware Downloaded", "success");
        }
        setShowConfirm(false);
    };

    const lineCount = code.split('\n').length;
    // Calculate total height needed for the scrollable area
    const contentHeight = Math.max(lineCount * 24 + 200, 600);

    return (
        <div className="flex-1 flex flex-col h-full bg-panel-950 overflow-hidden animate-fade-in relative select-none">
            
            {/* CLICK OUTSIDE HANDLER FOR MENUS */}
            {activeMenu !== 'none' && (
                <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setActiveMenu('none')}></div>
            )}

            {/* VALIDATION MODAL */}
            {showValidationModal && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-slate-800 border border-white/5 shadow-2xl p-8 rounded-2xl max-w-lg w-full relative">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                            <div className={`p-3 rounded-full border ${valResult.isValid ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                                <Icons.Check />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Validation Report</h2>
                                <p className="text-xs text-slate-400">Analysis of current configuration state</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                             {valResult.isValid && valResult.warnings.length === 0 ? (
                                 <div className="text-green-400 text-sm font-bold flex items-center gap-2">
                                     <Icons.Check /> Configuration is valid and optimized.
                                 </div>
                             ) : null}

                             {valResult.errors.length > 0 && (
                                 <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                                     <h4 className="text-red-400 font-bold text-xs uppercase mb-2">Critical Errors</h4>
                                     <ul className="list-disc list-inside text-xs text-red-200 space-y-1">
                                         {valResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                                     </ul>
                                 </div>
                             )}

                             {valResult.warnings.length > 0 && (
                                 <div className="bg-amber-900/20 border border-amber-900/50 p-3 rounded-lg">
                                     <h4 className="text-amber-400 font-bold text-xs uppercase mb-2">Warnings</h4>
                                     <ul className="list-disc list-inside text-xs text-amber-200 space-y-1">
                                         {valResult.warnings.map((e, i) => <li key={i}>{e}</li>)}
                                     </ul>
                                 </div>
                             )}

                             <div className="grid grid-cols-2 gap-4 mt-4">
                                 <div className="bg-panel-950 p-2 rounded text-center border border-white/5">
                                     <div className="text-[10px] text-slate-500 font-bold">ESTIMATED FLASH</div>
                                     <div className="text-sm font-mono text-white">{valResult.estimatedFlash} Bytes</div>
                                 </div>
                                 <div className="bg-panel-950 p-2 rounded text-center border border-white/5">
                                     <div className="text-[10px] text-slate-500 font-bold">ESTIMATED SRAM</div>
                                     <div className="text-sm font-mono text-white">{valResult.estimatedRam} Bytes</div>
                                 </div>
                             </div>
                        </div>
                        
                        <button onClick={() => setShowValidationModal(false)} className="w-full py-3 bg-panel-700 hover:bg-panel-600 rounded-xl font-bold text-sm text-slate-300 transition-colors border border-white/5">
                            CLOSE REPORT
                        </button>
                    </div>
                </div>
            )}

            {/* CONFIRM DOWNLOAD MODAL */}
            {showConfirm && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-slate-800 border border-white/5 shadow-2xl p-8 rounded-2xl max-w-lg w-full">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                            <div className="p-3 bg-brand-500/20 text-brand-500 rounded-full border border-brand-500/30">
                                <Icons.Download />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Export Firmware</h2>
                                <p className="text-xs text-slate-400">Ready to flash to Arduino Uno</p>
                            </div>
                        </div>
                        <div className="space-y-4 mb-8 text-sm text-slate-300 bg-panel-950 p-4 rounded-lg border border-white/5">
                           <p className="font-mono text-xs text-brand-400 mb-2">CHECKSUM: {valResult.estimatedFlash.toString(16).toUpperCase()}</p>
                           <ul className="list-disc list-inside space-y-1 text-slate-400">
                               <li>Verify baud rate is set to <strong>{config.serialBaudRate}</strong></li>
                               <li>Ensure high-voltage power is <strong>OFF</strong> during upload</li>
                               <li>Disconnect Bluetooth module from RX/TX if connected</li>
                           </ul>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-panel-700 hover:bg-panel-600 rounded-xl font-bold text-sm text-slate-300 transition-colors border border-white/5">CANCEL</button>
                            <button onClick={handleAction} className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold text-sm text-white shadow-lg shadow-brand-500/20 transition-colors">
                                {actionType === 'copy' ? 'COPY TO CLIPBOARD' : 'DOWNLOAD .INO'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOP BAR */}
            <div className="bg-panel-900 border-b border-panel-800 p-3 shadow-md z-50 relative flex flex-col gap-3 md:flex-row md:items-center justify-between">
                
                {/* LEFT: TITLE & STATS */}
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Icons.Download /> Firmware
                            {isManualEdit && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30">MODIFIED</span>}
                        </h2>
                    </div>
                    
                    <button 
                        onClick={() => setShowValidationModal(true)}
                        className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-bold transition-all ${valResult.isValid ? 'bg-green-900/20 border-green-900/50 text-green-400 hover:bg-green-900/30' : 'bg-red-900/20 border-red-900/50 text-red-400 hover:bg-red-900/30'}`}
                    >
                        {valResult.isValid ? <Icons.Check /> : '!'} VERIFY CODE
                    </button>
                </div>

                {/* CENTER: TOOLS */}
                <div className="flex items-center gap-2 bg-panel-950/50 p-1 rounded-lg border border-panel-800 relative">
                    
                    {/* Jump To */}
                    <div className="relative">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'jump' ? 'none' : 'jump'); }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeMenu === 'jump' ? 'bg-panel-800 text-white shadow-sm' : 'hover:bg-panel-800 text-slate-400'}`}
                        >
                            <Icons.Search /> Jump To
                        </button>
                        
                        {activeMenu === 'jump' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-panel-800 border border-panel-700 rounded-lg shadow-2xl p-1 z-50 animate-fade-in flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Section</div>
                                {SECTIONS.map(sec => (
                                    <button key={sec.label} onClick={() => jumpToSection(sec.search)} className="w-full text-left px-3 py-2 hover:bg-panel-700 rounded-md text-xs text-slate-300 transition-colors border border-transparent hover:border-panel-600">
                                        {sec.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-4 bg-panel-700"></div>

                    {/* Inject */}
                    <div className="relative">
                        <button 
                             onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'inject' ? 'none' : 'inject'); }}
                             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeMenu === 'inject' ? 'bg-panel-800 text-white shadow-sm' : 'hover:bg-panel-800 text-slate-400'}`}
                        >
                            <Icons.Plus /> Inject
                        </button>

                        {activeMenu === 'inject' && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-panel-800 border border-panel-700 rounded-lg shadow-2xl p-1 z-50 animate-fade-in flex flex-col gap-0.5">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Code Snippets</div>
                                {SNIPPETS.map(snip => (
                                    <button key={snip.label} onClick={() => handleInject(snip.code)} className="w-full text-left px-3 py-2 hover:bg-panel-700 rounded-md text-xs text-slate-300 transition-colors group/item border border-transparent hover:border-panel-600">
                                        <div className="font-bold text-brand-400">{snip.label}</div>
                                        <div className="text-[10px] text-slate-500 font-mono truncate opacity-70 group-hover/item:opacity-100">{snip.code.substring(0, 25)}...</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-4 bg-panel-700"></div>

                    <button 
                        onClick={handleRevert}
                        disabled={!isManualEdit} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isManualEdit ? 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30' : 'text-slate-700 cursor-not-allowed opacity-50'}`}
                        title="Discard changes and reset to auto-generated code"
                    >
                        <Icons.Refresh /> Revert
                    </button>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-2">
                    <div className="flex bg-panel-950 rounded-lg p-0.5 border border-panel-800 mr-2">
                        <button 
                            onClick={() => setIsLocked(true)} 
                            className={`p-1.5 rounded-md transition-all ${isLocked ? 'bg-panel-700 text-white shadow-sm ring-1 ring-panel-600' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Read Only Mode"
                        >
                            <Icons.Lock />
                        </button>
                        <button 
                            onClick={() => setIsLocked(false)} 
                            className={`p-1.5 rounded-md transition-all ${!isLocked ? 'bg-panel-700 text-white shadow-sm ring-1 ring-panel-600' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Edit Mode"
                        >
                            <Icons.Unlock />
                        </button>
                    </div>

                    <button 
                        onClick={()=>{ setActionType('copy'); setShowConfirm(true); }}
                        className="p-2 hover:bg-panel-800 text-slate-400 rounded-lg border border-transparent hover:border-panel-700 transition-all"
                        title="Copy to Clipboard"
                    >
                        <Icons.Copy />
                    </button>
                    <button 
                        onClick={()=>{ setActionType('download'); setShowConfirm(true); }}
                        disabled={!valResult.isValid}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                    >
                        <Icons.Download /> EXPORT
                    </button>
                </div>
            </div>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 relative flex overflow-hidden z-0">
                {/* Gutter (Line Numbers) */}
                <div 
                    ref={lineNumbersRef}
                    className="w-14 bg-panel-900 text-slate-600 font-mono text-[13px] text-right p-4 border-r border-panel-800 select-none overflow-hidden editor-font pt-6 shadow-inner"
                >
                    {Array.from({length: lineCount}).map((_, i) => (
                        <div key={i} className="opacity-50 hover:opacity-100 hover:text-slate-400 cursor-pointer transition-opacity" onClick={()=>showToast(`Line ${i+1}`, "success")}>{i+1}</div>
                    ))}
                    <div className="h-40"></div> {/* Bottom Padding */}
                </div>

                {/* UNIFIED SCROLL CONTAINER */}
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 relative bg-[#0d1117] overflow-auto scroll-smooth"
                >
                    {/* 
                      CRITICAL FIX: 
                      Wrapper with explicit height ensures the scroll container sees the content.
                      Absolute children do not contribute to parent size, so this div is mandatory.
                    */}
                    <div 
                        className="relative min-w-full"
                        style={{ height: `${contentHeight}px` }}
                    >
                        
                        {/* READ ONLY LAYER (Highlighter) */}
                        <div 
                            className={`absolute inset-0 p-4 pt-6 pointer-events-none transition-opacity duration-200 ${isLocked ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <pre className="m-0 bg-transparent !p-0 !overflow-visible">
                                <code ref={codeBlockRef} className="language-cpp editor-font !bg-transparent shadow-none !text-shadow-none block min-w-full">
                                    {code}
                                </code>
                            </pre>
                        </div>

                        {/* EDIT MODE LAYER (Textarea) */}
                        <textarea 
                            className={`absolute inset-0 w-full h-full bg-transparent text-slate-300 p-4 pt-6 font-mono editor-font focus:outline-none resize-none selection:bg-brand-500/30 whitespace-pre overflow-hidden transition-opacity duration-200 ${!isLocked ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                            spellCheck="false"
                            value={code}
                            onChange={handleCodeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirmwarePage;
