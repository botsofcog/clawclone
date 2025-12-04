
import React, { useState, useEffect, useRef } from 'react';
import { MachineState, ClawConfig, SimulationState, CraneStyle, DropMode, LedMode, ValidationResult, ExternalStats, HatchPosition, TelemetryState } from './types';
import { validateConfig, fixConfig } from './services/validator';
import { loadExternalStats, clearStats, getRevenueData } from './services/storage';
import Sidebar from './components/Sidebar';
import MonitorPage from './pages/MonitorPage';
import ConfigPage from './pages/ConfigPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FirmwarePage from './pages/FirmwarePage';

const Icons = {
  Usb: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  Bluetooth: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
};

const DEFAULT_CONFIG: ClawConfig = {
  craneStyle: CraneStyle.PLUSH,
  playTime: 30,
  descentSpeed: 80,
  hangTime: 300,
  grabTime: 2000,
  liftSpeed: 80,
  travelSpeed: 90,
  returnSpeed: 80,
  lowerTime: 1000,
  softStartDuration: 200,
  payoutPercentage: 33,
  strongGrabInterval: 8,
  mercyThreshold: 5,
  grabStrengthWeak: 100,
  grabStrengthStrong: 255,
  solenoidHoldPower: 80,
  dropMode: DropMode.HOME_RELEASE,
  hatchPosition: HatchPosition.BOTTOM_LEFT,
  progressiveEnabled: false,
  progressiveThreshold: 100,
  audioMode: 1,
  audioVolume: 70,
  ledMode: LedMode.GAME_SYNC,
  ledBrightness: 100,
  enableWatchdog: true,
  expansionEnabled: false,
  expansionPin: 'MCP_15',
  wirelessEnabled: false,
  wirelessRxPin: 'A1',
  wirelessTxPin: 'A2',
  wirelessBaud: 9600,
  serialBaudRate: 115200,
  wirelessSecurityEnabled: false,
  wirelessPairingCode: "1234",
  pinMappings: {
    'JOY_UP': 'MCP_0', 'JOY_DN': 'MCP_1', 'JOY_LT': 'MCP_2', 'JOY_RT': 'MCP_3',
    'BTN_DROP': 'MCP_4', 'COIN': 'MCP_5',
    'LIM_X_HOME': 'MCP_6', 'LIM_Y_HOME': 'MCP_8', 'LIM_Z_TOP': 'MCP_10', 'LIM_Z_BOT': 'MCP_11',
    'PRIZE_SENS': 'MCP_12'
  },
  invertInputs: { 'LIM_X_HOME': false, 'LIM_Y_HOME': false, 'LIM_Z_TOP': false }
};

const DEFAULT_TELEMETRY: TelemetryState = {
    inputs: {
        up: false, down: false, left: false, right: false, drop: false, coin: false,
        prize: false, limX: false, limY: false, limZTop: false, limZBot: false,
        lcdSelect: false, lcdLeft: false, lcdUp: false, lcdDown: false, lcdRight: false
    },
    state: MachineState.BOOT
};

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce z-50 ${type === 'success' ? 'bg-accent-success text-black' : 'bg-accent-danger text-white'}`}>
        <span>{type === 'success' ? '✓' : '⚠'}</span>
        {message}
    </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'config' | 'diag' | 'code' | 'history'>('monitor');
  const [config, setConfig] = useState<ClawConfig>(DEFAULT_CONFIG);
  const [valResult, setValResult] = useState<ValidationResult>(validateConfig(DEFAULT_CONFIG));
  const [extStats, setExtStats] = useState<ExternalStats>(loadExternalStats());
  const [revenueData, setRevenueData] = useState<{time:string, value:number}[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  // Movement Physics State (Refs used for loop performance)
  const moveVectorRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  // We keep a state version just for UI highlighting if needed, but the loop uses the Ref
  const [moveVectorUI, setMoveVectorUI] = useState<{x: number, y: number}>({x: 0, y: 0});

  // Diagnostics State
  const [overrideValues, setOverrideValues] = useState<{X: number, Y: number, Z: number}>({X: 0, Y: 0, Z: 0});
  const [diagClawState, setDiagClawState] = useState(false);
  const [diagExpState, setDiagExpState] = useState(false);
  
  const [simState, setSimState] = useState<SimulationState>({
    posX: 50, posY: 50, posZ: 0, clawOpen: true, credits: 0, currentState: MachineState.ATTRACT,
    logs: [], prizes: [], grabbedPrizeId: null, isConnected: false,
    totalPlays: extStats.lifetimePlays, totalWins: extStats.lifetimeWins, jackpotPool: 45, currentError: 0,
    telemetry: DEFAULT_TELEMETRY
  });

  // Simulation Internal State (not exposed to UI directly for perf)
  const simInternalRef = useRef({
      playTimerStart: 0,
      stateStartTime: 0,
      activePlayTime: config.playTime
  });

  const [serialPort, setSerialPort] = useState<any>(null);
  const readerRef = useRef<any>(null);

  // --- LOGIC ---

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
      setToast({msg, type});
      setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.key === 's') {
              e.preventDefault();
              showToast("Configuration Saved", "success");
              return;
          }

          if (isSimulating || simState.isConnected) {
              // Arrow keys for movement
              let x = 0; let y = 0;
              if (e.key === 'ArrowUp' || e.key === 'w') y = 1;
              if (e.key === 'ArrowDown' || e.key === 's') y = -1;
              if (e.key === 'ArrowLeft' || e.key === 'a') x = -1;
              if (e.key === 'ArrowRight' || e.key === 'd') x = 1;
              
              if (e.key === ' ') {
                  // Space to drop
                  sendCommand('R:DROP');
              }
              
              if (x !== 0 || y !== 0) {
                 // Update Ref directly for immediate physics
                 const current = moveVectorRef.current;
                 const newVec = { x: x !== 0 ? x : current.x, y: y !== 0 ? y : current.y };
                 moveVectorRef.current = newVec;
                 // Don't set state on every key stroke to avoid re-renders, only if vector changes
              }
          }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
          if (isSimulating || simState.isConnected) {
              const current = moveVectorRef.current;
              let x = current.x; 
              let y = current.y;
              
              if (e.key === 'ArrowUp' || e.key === 'w') y = 0;
              if (e.key === 'ArrowDown' || e.key === 's') y = 0;
              if (e.key === 'ArrowLeft' || e.key === 'a') x = 0;
              if (e.key === 'ArrowRight' || e.key === 'd') x = 0;
              
              moveVectorRef.current = {x, y};
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, [isSimulating, simState.isConnected]);

  useEffect(() => {
    setValResult(validateConfig(config));
    // Update internal sim param if config changes offline
    simInternalRef.current.activePlayTime = config.playTime;
  }, [config]);

  useEffect(() => {
    setRevenueData(getRevenueData(extStats));
  }, [extStats]);

  // OFFLINE PHYSICS ENGINE
  useEffect(() => {
    if (simState.isConnected) return; 

    // Simulation Loop (60fps)
    const interval = setInterval(() => {
      setSimState(prev => {
        let { posX, posY, posZ, clawOpen, currentState } = prev;
        const vec = moveVectorRef.current; // Read from Ref for smooth updates
        const now = Date.now();

        // 1. STATE MACHINE SIMULATION
        if (isSimulating) {
           
           // A. CENTERING LOGIC (Start of game)
           switch(currentState) {
             case MachineState.PLAY:
               // Timer Check
               if (simInternalRef.current.playTimerStart > 0) {
                   const elapsed = (now - simInternalRef.current.playTimerStart) / 1000;
                   if (elapsed > simInternalRef.current.activePlayTime) {
                       // Time expired, auto drop
                       currentState = MachineState.DESCEND;
                       simInternalRef.current.playTimerStart = 0;
                   }
               }

               // User Control Phase
               // Apply Physics Vector (Slower speed: 0.8)
               // Clamp to 5-95 to keep inside frame
               if (vec.x !== 0) posX = Math.max(5, Math.min(95, posX + (vec.x * 0.8))); 
               if (vec.y !== 0) posY = Math.max(5, Math.min(95, posY + (vec.y * 0.8)));

               // Removed "sway" logic from here to prevent coordinate drift. 
               // Visual sway is handled in MonitorPage CSS.
               break;

             case MachineState.DESCEND:
               posZ = Math.min(100, posZ + 1.5); // Descend Speed
               if(posZ >= 100) currentState = MachineState.GRAB;
               break;

             case MachineState.GRAB:
               clawOpen = false; // Close claw
               // Hold for 1 second then lift
               // (In sim loop we just drift through this state)
               // Simple probability transition for sim feel
               if(Math.random() > 0.95) currentState = MachineState.LIFT; 
               break;

             case MachineState.LIFT:
               posZ = Math.max(0, posZ - 1.5); // Lift Speed
               if(posZ <= 0) currentState = MachineState.RETURN;
               break;

             case MachineState.RETURN:
               // Calculate Target based on Hatch Position
               // 0,0 is Bottom Left.
               let targetX = 5; 
               let targetY = 5; 

               if (config.hatchPosition === HatchPosition.BOTTOM_RIGHT) { targetX = 95; targetY = 5; }
               if (config.hatchPosition === HatchPosition.TOP_LEFT) { targetX = 5; targetY = 95; }
               if (config.hatchPosition === HatchPosition.TOP_RIGHT) { targetX = 95; targetY = 95; }

               // Move towards hatch
               const dx = targetX - posX;
               const dy = targetY - posY;
               posX += dx * 0.05; // Ease in
               posY += dy * 0.05;

               if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                   currentState = config.dropMode === DropMode.HOME_LOWER ? MachineState.LOWER : MachineState.DROP;
               }
               break;

             case MachineState.LOWER:
               posZ = Math.min(60, posZ + 1); 
               if(posZ >= 60) currentState = MachineState.DROP;
               break;

             case MachineState.DROP:
               clawOpen = true; // Release
               if(Math.random() > 0.95) { 
                   currentState = MachineState.ATTRACT; // Reset
                   posZ = 0; // Snap to top if needed, or lift first
                   simInternalRef.current.playTimerStart = 0;
               }
               break;
           }
        }

        return { ...prev, posX, posY, posZ, clawOpen, currentState };
      });
    }, 16); 

    return () => clearInterval(interval);
  }, [simState.isConnected, isSimulating, config.hatchPosition, config.dropMode]); 

  const startTestPlay = () => {
    setIsSimulating(true);
    moveVectorRef.current = {x:0, y:0};
    simInternalRef.current.playTimerStart = Date.now();
    
    setSimState(prev => ({ 
        ...prev, 
        currentState: MachineState.PLAY, 
        credits: 1,
        // Start roughly center
        posX: 50, 
        posY: 50,
        posZ: 0,
        clawOpen: true,
        logs: [{type: 'INFO', content: 'SYS:TEST_PLAY_START', timestamp: Date.now()}, ...prev.logs].slice(0, 50) as any 
    }));
    showToast("Test Mode: FREE PLAY", "success");
  };

  const stopTestPlay = () => {
      setIsSimulating(false);
      moveVectorRef.current = {x:0, y:0};
      setMoveVectorUI({x:0, y:0});
      setSimState(prev => ({ ...prev, currentState: MachineState.ATTRACT, credits: 0, logs: [{type: 'INFO', content: 'SYS:SIM_STOP', timestamp: Date.now()}, ...prev.logs].slice(0, 50) as any }));
  };

  // Serial Connection Logic
  const connectSerial = async () => {
    if(!(navigator as any).serial) return alert("Web Serial not supported in this browser.");
    try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 115200 }); 
        setSerialPort(port);
        setSimState(s => ({...s, isConnected: true}));
        setShowConnectModal(false);
        showToast("Connected via Serial", "success");
        
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;

        let buffer = '';
        while(true) {
            const { value, done } = await reader.read();
            if(done) break;
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            lines.forEach(line => handleSerialLine(line));
        }
    } catch(e) {
        console.error(e);
        setSimState(s => ({...s, isConnected: false}));
        showToast("Connection Failed", "error");
    }
  };

  const handleSerialLine = (line: string) => {
      line = line.trim();
      setSimState(prev => {
          const newLogs = [{ type: 'INFO', content: line, timestamp: Date.now() }, ...prev.logs].slice(0, 50);
          return { ...prev, logs: newLogs as any };
      });

      if(line.startsWith("TEL:")) {
         const parts = line.substring(4).split('|');
         const ins = parts[0].split(',').map(x => x === '1');
         const btns = parts[1].split(',').map(x => x === '1');
         
         setSimState(prev => ({
             ...prev,
             telemetry: {
                 inputs: {
                    up: ins[0], down: ins[1], left: ins[2], right: ins[3], drop: ins[4], coin: ins[5],
                    prize: ins[6], limX: ins[7], limY: ins[8], limZTop: ins[9], limZBot: ins[10],
                    lcdSelect: btns[0], lcdLeft: btns[1], lcdUp: btns[2], lcdDown: btns[3], lcdRight: btns[4]
                 },
                 state: prev.telemetry.state 
             }
         }));
      }
      else if(line.startsWith("STATE:")) {
          const s = line.substring(6) as MachineState;
          setSimState(prev => ({...prev, currentState: s, telemetry: {...prev.telemetry, state: s}}));
      }
      else if(line.startsWith("CFG:UPDATED")) {
          showToast("Machine Config Synced", "success");
      }
  };

  const sendCommand = async (cmd: string) => {
      // 1. If connected via Serial, send command to hardware
      if(serialPort && serialPort.writable) {
          const writer = serialPort.writable.getWriter();
          await writer.write(new TextEncoder().encode(cmd + '\n'));
          writer.releaseLock();
          return;
      }

      // 2. If Offline (Simulation), process commands locally
      const now = Date.now();
      
      if (cmd === 'R:COIN') {
          setIsSimulating(true); // Wake up physics
          setSimState(prev => {
              const newCredits = prev.credits + 1;
              let logs = [{type: 'INFO', content: 'EVT:COIN', timestamp: now}, ...prev.logs];

              // Auto-Start logic
              if (prev.currentState === MachineState.ATTRACT) {
                   logs = [{type: 'INFO', content: 'EVT:GAME_START', timestamp: now}, ...logs];
                   // Reset Play Timer
                   simInternalRef.current.playTimerStart = now;
                   // Move to center before allowing play
                   return {
                       ...prev,
                       credits: newCredits - 1, 
                       currentState: MachineState.PLAY,
                       posX: 50, // Center X
                       posY: 50, // Center Y
                       clawOpen: true,
                       logs: logs.slice(0,50) as any
                   };
              }

              return {
                  ...prev, 
                  credits: newCredits,
                  logs: logs.slice(0, 50) as any
              };
          });
          showToast("COIN INSERTED - STARTING...", "success");
      }
      else if (cmd === 'R:DROP') {
           setSimState(prev => {
               // Only drop if in PLAY mode
               if (prev.currentState === MachineState.PLAY) {
                   return {
                       ...prev,
                       currentState: MachineState.DESCEND,
                       logs: [{type: 'INFO', content: 'EVT:DROP', timestamp: now}, ...prev.logs].slice(0, 50) as any
                   }
               }
               return prev;
           });
      }
      // Handle Continuous Movement Commands
      else if (cmd.startsWith('DIAG:MOVE:')) {
          const parts = cmd.split(':'); // DIAG:MOVE:X:1
          const axis = parts[2];
          const dir = parseInt(parts[3]);
          
          const newVec = { ...moveVectorRef.current };
          if(axis === 'X') newVec.x = dir;
          if(axis === 'Y') newVec.y = dir;
          
          moveVectorRef.current = newVec;
          setMoveVectorUI(newVec); // Update UI
      }
      else if (cmd === 'DIAG:STOP') {
          moveVectorRef.current = {x:0, y:0};
          setMoveVectorUI({x:0, y:0});
      }
      // Handle Live Sync Config commands
      else if (cmd.startsWith('SET:')) {
          // Parse SET:TIME:30
          if(cmd.startsWith('SET:TIME:')) {
              simInternalRef.current.activePlayTime = parseInt(cmd.split(':')[2]);
          }
          
          setSimState(prev => ({
              ...prev,
              logs: [{type: 'INFO', content: 'CFG:UPDATED', timestamp: now}, ...prev.logs].slice(0, 50) as any
          }));
      }
  };
  
  const sendAuth = () => {
      if(config.wirelessSecurityEnabled) {
          sendCommand(`AUTH:${config.wirelessPairingCode}`);
      }
  }

  const commonProps = { config, setConfig, simState, setSimState, sendCommand, showToast };

  return (
    <div className="min-h-screen bg-panel-950 text-slate-200 font-sans flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isConnected={simState.isConnected} onConnectClick={()=>setShowConnectModal(true)} />
      
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* CONNECTION MODAL */}
      {showConnectModal && (
          <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-panel-900 border border-panel-700 p-8 rounded-2xl max-w-lg w-full shadow-2xl transform transition-all scale-100 relative">
                  <button onClick={() => setShowConnectModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                  
                  <h2 className="text-2xl font-bold text-white mb-2 font-display">Connect Machine</h2>
                  <p className="text-slate-400 text-sm mb-6">Select your connection interface type.</p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8">
                      {/* USB Option */}
                      <button className="flex items-center gap-4 p-4 bg-panel-800 border border-panel-700 rounded-xl hover:border-brand-500 hover:bg-panel-700 transition-all group text-left" onClick={connectSerial}>
                          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-lg group-hover:bg-brand-500 group-hover:text-white transition-colors"><Icons.Usb /></div>
                          <div>
                              <div className="font-bold text-white group-hover:text-brand-400 transition-colors">USB Serial</div>
                              <div className="text-xs text-slate-400">Direct connection via USB Cable</div>
                          </div>
                      </button>
                      
                      {/* Bluetooth Option */}
                      <button className="flex items-center gap-4 p-4 bg-panel-800 border border-panel-700 rounded-xl hover:border-blue-500 hover:bg-panel-700 transition-all group text-left" onClick={connectSerial}>
                          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><Icons.Bluetooth /></div>
                          <div>
                              <div className="font-bold text-white group-hover:text-blue-400 transition-colors">Wireless (Bluetooth)</div>
                              <div className="text-xs text-slate-400">Connect via HC-05/06 SPP</div>
                          </div>
                      </button>
                  </div>
                  
                  <div className="text-center text-xs text-slate-500">
                      Ensure your browser supports Web Serial API (Chrome/Edge recommended).
                  </div>
              </div>
          </div>
      )}
      
      <main className="flex-1 flex flex-col relative overflow-hidden bg-panel-950">
         {activeTab === 'monitor' && <MonitorPage {...commonProps} isSimulating={isSimulating} startTestPlay={startTestPlay} stopTestPlay={stopTestPlay} />}
         {activeTab === 'config' && <ConfigPage {...commonProps} valResult={valResult} />}
         {activeTab === 'diag' && <DiagnosticsPage {...commonProps} overrideValues={overrideValues} setOverrideValues={setOverrideValues} diagClawState={diagClawState} setDiagClawState={setDiagClawState} diagExpState={diagExpState} setDiagExpState={setDiagExpState} sendAuth={sendAuth} />}
         {activeTab === 'history' && <AnalyticsPage {...commonProps} extStats={extStats} setExtStats={setExtStats} revenueData={revenueData} />}
         {activeTab === 'code' && <FirmwarePage {...commonProps} valResult={valResult} fixConfig={() => setConfig(fixConfig(config))} />}
      </main>
    </div>
  );
};

export default App;
