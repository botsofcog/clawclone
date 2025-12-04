
export enum MachineState {
  BOOT = 'BOOT',
  HOME = 'HOME',
  ATTRACT = 'ATTRACT',
  PLAY = 'PLAY',
  DESCEND = 'DESCEND',
  HANG = 'HANG',
  GRAB = 'GRAB',
  LIFT = 'LIFT',
  RETURN = 'RETURN',
  LOWER = 'LOWER', // For HOME_LOWER drop mode
  DROP = 'DROP',
  CHECK = 'CHECK',
  OVER = 'OVER',
  ERROR = 'ERROR'
}

export enum CraneStyle {
  PREMIUM = 'PREMIUM', 
  PLUSH = 'PLUSH',     
  PROMO = 'PROMO',     
  CANDY = 'CANDY',     
  LIMITED = 'LIMITED', 
  CUSTOM = 'CUSTOM'
}

export enum DropMode {
  HOME_RELEASE = 'HOME_RELEASE', 
  HOME_LOWER = 'HOME_LOWER',     
  DIRECT = 'DIRECT'              
}

export enum HatchPosition {
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT'
}

export enum LedMode {
  OFF = 0,
  SOLID = 1,
  PULSE = 2,
  RAINBOW = 3,
  CHASE = 4,
  STROBE = 5,
  GAME_SYNC = 6 
}

export interface ClawConfig {
  // General
  craneStyle: CraneStyle;
  hatchPosition: HatchPosition;
  
  // Gameplay / Timing
  playTime: number;
  descentSpeed: number; // %
  hangTime: number; // ms
  grabTime: number; // ms
  liftSpeed: number; // %
  travelSpeed: number; // %
  returnSpeed: number; // %
  lowerTime: number; // ms (for Home-Lower)
  
  // Advanced Motor Control
  softStartDuration: number; // ms (Ramp up time)
  
  // Payout / Rigging
  payoutPercentage: number;
  strongGrabInterval: number;
  mercyThreshold: number;
  
  // Electrical / PWM
  grabStrengthWeak: number;
  grabStrengthStrong: number;
  solenoidHoldPower: number;
  
  // Features
  dropMode: DropMode;
  progressiveEnabled: boolean;
  progressiveThreshold: number; 
  
  // AV
  audioMode: number; 
  audioVolume: number; 
  ledMode: LedMode;
  ledBrightness: number;
  
  // Expansion
  expansionEnabled: boolean;
  expansionPin: string; // e.g. 'A3' or 'MCP_15'
  
  // Communications
  serialBaudRate: number; // Main USB Baud
  
  // Wireless / Remote
  wirelessEnabled: boolean;
  wirelessRxPin: string; // e.g. 'A1'
  wirelessTxPin: string; // e.g. 'A2'
  wirelessBaud: number;
  wirelessSecurityEnabled: boolean;
  wirelessPairingCode: string;
  
  // System
  enableWatchdog: boolean;
  pinMappings: Record<string, string>;
  invertInputs: Record<string, boolean>; // True = NO, False = NC
}

export interface Prize {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface SerialMessage {
  type: 'INFO' | 'ERROR' | 'STATE' | 'STATS' | 'TEL' | 'EVT';
  content: string;
  timestamp: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  estimatedFlash: number; // Bytes
  estimatedRam: number; // Bytes
  pinConflicts: string[];
}

export interface GameSession {
  id: string;
  timestamp: number;
  duration: number;
  result: 'WIN' | 'LOSS';
  creditsUsed: number;
}

export interface ExternalStats {
  lifetimeRevenue: number;
  lifetimePlays: number;
  lifetimeWins: number;
  errorLog: {code: number, msg: string, time: number}[];
  sessions: GameSession[];
}

export interface TelemetryState {
  inputs: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    drop: boolean;
    coin: boolean;
    prize: boolean;
    limX: boolean;
    limY: boolean;
    limZTop: boolean;
    limZBot: boolean;
    lcdSelect: boolean;
    lcdLeft: boolean;
    lcdUp: boolean;
    lcdDown: boolean;
    lcdRight: boolean;
  };
  state: MachineState;
  lastEvent?: string;
}

export interface SimulationState {
  posX: number;
  posY: number;
  posZ: number;
  clawOpen: boolean;
  credits: number;
  currentState: MachineState;
  logs: SerialMessage[];
  prizes: Prize[];
  grabbedPrizeId: string | null;
  isConnected: boolean;
  
  // Live Stats from Machine (Transient)
  totalPlays: number;
  totalWins: number;
  jackpotPool: number;
  currentError: number;
  telemetry: TelemetryState;
}

// Props Interfaces for Pages
export interface PageProps {
  config: ClawConfig;
  setConfig: (c: ClawConfig) => void;
  simState: SimulationState;
  setSimState: React.Dispatch<React.SetStateAction<SimulationState>>;
  sendCommand: (cmd: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export interface ConfigPageProps extends PageProps {
    valResult: ValidationResult;
}

export interface MonitorPageProps extends PageProps {
    isSimulating: boolean;
    startTestPlay: () => void;
    stopTestPlay: () => void;
}

export interface AnalyticsPageProps extends PageProps {
    extStats: ExternalStats;
    setExtStats: (s: ExternalStats) => void;
    revenueData: {time: string, value: number}[];
}

export interface FirmwarePageProps extends PageProps {
    valResult: ValidationResult;
    fixConfig: () => void;
}

export interface DiagnosticsPageProps extends PageProps {
    overrideValues: {X: number, Y: number, Z: number};
    setOverrideValues: (v: {X: number, Y: number, Z: number}) => void;
    diagClawState: boolean;
    setDiagClawState: (v: boolean) => void;
    diagExpState: boolean;
    setDiagExpState: (v: boolean) => void;
    sendAuth: () => void;
}
