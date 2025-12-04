
import { ClawConfig, HatchPosition } from '../types';

const getPinDef = (pinId: string): string => {
  if (pinId.startsWith('MCP_')) return pinId.split('_')[1];
  if (pinId.startsWith('A')) return `A${pinId.substring(1)}`;
  if (pinId.startsWith('D')) return pinId.substring(1);
  return pinId;
};

const isMcp = (pinId: string) => pinId.startsWith('MCP_');

export const generateArduinoCode = (config: ClawConfig): string => {
  const { pinMappings, invertInputs, wirelessEnabled, wirelessRxPin, wirelessTxPin, wirelessBaud, serialBaudRate } = config;

  // Calculate Homing Directions
  let homeDirX = -1;
  let homeDirY = -1;
  if (config.hatchPosition === HatchPosition.BOTTOM_RIGHT) { homeDirX = 1; homeDirY = -1; }
  else if (config.hatchPosition === HatchPosition.TOP_LEFT) { homeDirX = -1; homeDirY = 1; }
  else if (config.hatchPosition === HatchPosition.TOP_RIGHT) { homeDirX = 1; homeDirY = 1; }

  // Input Reader Generator with Inversion support
  const genRead = (funcId: string, varName: string) => {
    const pinId = pinMappings[funcId] || 'D0';
    const invert = invertInputs && invertInputs[funcId] ? true : false;
    
    if (isMcp(pinId)) {
      // MCP pins are read from a bitmask `mcpInputs`
      // Logic: ( (mcpInputs >> pin) & 1 ) == invert
      return `bool ${varName} = ((mcpInputs >> ${getPinDef(pinId)}) & 1) == ${invert ? 1 : 0};`;
    } else {
      // Direct pins
      // Logic: digitalRead(pin) == invert
      return `bool ${varName} = digitalRead(${getPinDef(pinId)}) == ${invert ? 1 : 0};`;
    }
  };

  return `/*
 * CLAWOS PRO FIRMWARE v5.1 (Commercial Release)
 * Board: Arduino Uno R3 (ATmega328P)
 * Features: Zero-Heap, Soft-Start, Telemetry, CRC Safety, Dual-Serial, Security Auth
 */

#include <Wire.h>
#include <LiquidCrystal.h>
#include <Adafruit_MCP23X17.h>
#include <EEPROM.h>
#include <avr/wdt.h> 
${wirelessEnabled ? '#include <SoftwareSerial.h>' : ''}

#define BAUD_RATE ${serialBaudRate}

// --- PIN MAP ---
// Fixed Motor Pins (L298N/IBT-2 compatible)
const byte PIN_X_EN = 3;  
const byte PIN_X_IN1 = 4;
const byte PIN_X_IN2 = 5;
const byte PIN_Y_EN = 6;  
const byte PIN_Y_IN1 = 7;
const byte PIN_Y_IN2 = 8;
const byte PIN_Z_EN = 9;  
const byte PIN_Z_IN1 = 10;
const byte PIN_Z_IN2 = 11;
const byte PIN_CLAW = 13; 

// --- CONFIGURATION STRUCT (EEPROM) ---
struct SysConfig {
  uint8_t version;      // 0x50
  uint8_t playTime;     
  uint8_t payoutPct;    
  uint8_t strongInt;    
  uint8_t mercyLimit;   
  uint8_t pwmWeak;      
  uint8_t pwmStrong;    
  uint8_t pwmHold;      
  uint8_t dropMode;     
  uint8_t progEnabled;  
  uint16_t progThresh;  
  
  uint32_t totalPlays;
  uint32_t totalWins;
  uint32_t jackpotPool;
  uint32_t crc;
} sys;

// --- GLOBALS ---
LiquidCrystal lcd(8, 9, 4, 5, 6, 7); 
Adafruit_MCP23X17 mcp;
bool mcpReady = false;

${wirelessEnabled ? `SoftwareSerial btSerial(${getPinDef(wirelessRxPin)}, ${getPinDef(wirelessTxPin)}); // RX, TX` : ''}

// Security Layer
const bool SECURITY_ENABLED = ${config.wirelessSecurityEnabled};
const char PAIRING_CODE[] = "${config.wirelessPairingCode}";
bool isAuthenticated = ${!config.wirelessSecurityEnabled}; // Default true if no security

enum State { BOOT, HOME, ATTRACT, PLAY, DESCEND, HANG, GRAB, LIFT, RETURN, LOWER, DROP, CHECK, ERROR };
State state = BOOT;
unsigned long stateTime = 0;
int credits = 0;
bool strongGrab = false;
bool progressiveWin = false;
bool remoteDrop = false;

// Serial Parser (Zero Allocation)
const byte CMD_MAX = 32;
char cmdBuffer[CMD_MAX];
byte cmdIndex = 0;

// Motor Ramp Control
int targetSpeed[3] = {0,0,0};
int currentSpeed[3] = {0,0,0};
unsigned long lastRamp = 0;
const int RAMP_STEP = 20; // PWM step per tick

// Diagnostics
bool remoteOverride = false;
int remoteX=0, remoteY=0, remoteZ=0;
bool remoteClaw=false;
bool expansionState=false;
unsigned long lastTelemetry = 0;

// Homing Config
const int HOME_DIR_X = ${homeDirX};
const int HOME_DIR_Y = ${homeDirY};

// --- CRC HELPER ---
uint32_t calculateCRC(byte* data, uint16_t len) {
  uint32_t crc = 0xFFFFFFFF;
  for(uint16_t i=0; i<len; i++) {
    crc ^= data[i];
    for(uint8_t j=0; j<8; j++) {
      if(crc & 1) crc = (crc >> 1) ^ 0xEDB88320;
      else crc >>= 1;
    }
  }
  return ~crc;
}

void setup() {
  wdt_disable();
  Serial.begin(BAUD_RATE);
  Serial.println(F("SYS:BOOT_V5.1")); 
  
  ${wirelessEnabled ? `btSerial.begin(${wirelessBaud});` : ''}
  
  // Motor Pins
  pinMode(PIN_X_EN, OUTPUT); pinMode(PIN_X_IN1, OUTPUT); pinMode(PIN_X_IN2, OUTPUT);
  pinMode(PIN_Y_EN, OUTPUT); pinMode(PIN_Y_IN1, OUTPUT); pinMode(PIN_Y_IN2, OUTPUT);
  pinMode(PIN_Z_EN, OUTPUT); pinMode(PIN_Z_IN1, OUTPUT); pinMode(PIN_Z_IN2, OUTPUT);
  pinMode(PIN_CLAW, OUTPUT);

  // Mapped Inputs (Direct)
  ${Object.entries(pinMappings).filter(([_, p]) => !isMcp(p)).map(([_, p]) => `pinMode(${getPinDef(p)}, INPUT_PULLUP);`).join('\n  ')}
  
  // Expansion
  ${config.expansionEnabled && !isMcp(config.expansionPin) ? `pinMode(${getPinDef(config.expansionPin)}, OUTPUT);` : ''}

  lcd.begin(16, 2);
  lcd.print(F("CLAWOS PRO v5.1"));

  // I2C Init
  Wire.begin();
  if(mcp.begin_I2C(0x20)) {
    mcpReady = true;
    for(int i=0; i<16; i++) mcp.pinMode(i, INPUT_PULLUP);
    ${config.expansionEnabled && isMcp(config.expansionPin) ? `mcp.pinMode(${getPinDef(config.expansionPin)}, OUTPUT);` : ''}
  } else {
    lcd.setCursor(0,1); lcd.print(F("MCP ERROR"));
    Serial.println(F("ERR:MCP_FAIL"));
    delay(1000);
  }

  loadConfig();
  ${config.enableWatchdog ? 'wdt_enable(WDTO_2S);' : ''}
  
  // Initial Homing
  changeState(HOME);
}

void loop() {
  ${config.enableWatchdog ? 'wdt_reset();' : ''}
  processSerial();
  updateMotors(); // Soft start logic
  
  uint16_t mcpInputs = mcpReady ? mcp.readGPIOAB() : 0;
  
  // --- INPUT READING ---
  ${genRead('JOY_UP', 'inUp')}
  ${genRead('JOY_DN', 'inDn')}
  ${genRead('JOY_LT', 'inLt')}
  ${genRead('JOY_RT', 'inRt')}
  ${genRead('BTN_DROP', 'inDrop')}
  ${genRead('COIN', 'inCoin')}
  ${genRead('LIM_X_HOME', 'limX')}
  ${genRead('LIM_Y_HOME', 'limY')}
  ${genRead('LIM_Z_TOP', 'limZTop')}
  ${genRead('LIM_Z_BOT', 'limZBot')}
  ${genRead('PRIZE_SENS', 'inPrize')}
  
  // --- ANALOG KEYPAD ---
  int adc = analogRead(A0);
  bool btnRight = (adc < 50);
  bool btnUp = (adc > 50 && adc < 250);
  bool btnDown = (adc > 250 && adc < 450);
  bool btnLeft = (adc > 450 && adc < 650);
  bool btnSelect = (adc > 650 && adc < 850);

  // --- TELEMETRY (5Hz) ---
  if(millis() - lastTelemetry > 200) {
    lastTelemetry = millis();
    reportTelemetry(inUp, inDn, inLt, inRt, inDrop, inCoin, inPrize, limX, limY, limZTop, limZBot, 
                    btnSelect, btnLeft, btnUp, btnDown, btnRight);
  }

  // --- DIAGNOSTICS OVERRIDE ---
  if(remoteOverride && isAuthenticated) {
    setMotorTarget(0, remoteX * 255);
    setMotorTarget(1, remoteY * 255);
    setMotorTarget(2, remoteZ * 255);
    analogWrite(PIN_CLAW, remoteClaw ? 255 : 0);
    
    // Expansion
    ${config.expansionEnabled ? 
      (isMcp(config.expansionPin) ? 
        `mcp.digitalWrite(${getPinDef(config.expansionPin)}, expansionState);` : 
        `digitalWrite(${getPinDef(config.expansionPin)}, expansionState);`) 
      : ''
    }
    return;
  }

  // --- STATE MACHINE ---
  switch(state) {
    case BOOT: changeState(HOME); break;
    
    case HOME:
      // Z Axis First
      if(!limZTop) setMotorTarget(2, 255); else setMotorTarget(2, 0);
      
      if(limZTop) {
        if(!limX) setMotorTarget(0, HOME_DIR_X * 200); else setMotorTarget(0, 0);
        if(!limY) setMotorTarget(1, HOME_DIR_Y * 200); else setMotorTarget(1, 0);
        if(limX && limY) changeState(ATTRACT);
      }
      break;

    case ATTRACT:
      stopMotors();
      // Coin Logic
      static bool lastCoin = false;
      if(inCoin && !lastCoin) {
        credits++;
        printLog(F("EVT:COIN"));
        if(sys.progEnabled) { sys.jackpotPool++; saveConfig(); }
        delay(50); // Debounce
      }
      lastCoin = inCoin;

      if(credits > 0) {
        lcd.setCursor(0,0); lcd.print(F("CREDITS: ")); lcd.print(credits);
        lcd.setCursor(0,1); sys.progEnabled ? lcd.print(F("JACKPOT ACTIVE ")) : lcd.print(F("PRESS DROP      "));
        if(inDrop || remoteDrop) { 
           credits--; 
           remoteDrop = false; // Reset remote trigger
           startGame(); 
        }
      } else {
        lcd.setCursor(0,0); lcd.print(F("INSERT COIN     "));
        lcd.setCursor(0,1); lcd.print(F("PRO CLAW SYSTEM "));
      }
      break;

    case PLAY: {
      long timeLeft = (sys.playTime * 1000) - (millis() - stateTime);
      lcd.setCursor(0,0); lcd.print(F("TIME: ")); lcd.print(timeLeft/1000); lcd.print(F("s   "));
      
      if(timeLeft <= 0 || inDrop || remoteDrop) {
        remoteDrop = false;
        changeState(DESCEND);
      } else {
        // Joystick Logic
        int spdX = 255 * ${config.travelSpeed/100};
        int spdY = 255 * ${config.travelSpeed/100};
        
        setMotorTarget(0, inLt ? -spdX : (inRt ? spdX : 0));
        setMotorTarget(1, inDn ? -spdY : (inUp ? spdY : 0));
      }
      break;
    }

    case DESCEND:
      stopMotors();
      setMotorTarget(2, -255 * ${config.descentSpeed/100});
      if(limZBot || (millis() - stateTime > 4000)) changeState(HANG);
      break;
      
    case HANG:
      stopMotors();
      if(millis() - stateTime > ${config.hangTime}) changeState(GRAB);
      break;

    case GRAB:
      lcd.setCursor(0,1); lcd.print(strongGrab ? F("POWER GRAB") : F("WEAK GRAB "));
      analogWrite(PIN_CLAW, 255); delay(200); // Pulse
      analogWrite(PIN_CLAW, strongGrab ? sys.pwmStrong : sys.pwmWeak);
      if(millis() - stateTime > ${config.grabTime}) changeState(LIFT);
      break;

    case LIFT:
      setMotorTarget(2, 255 * ${config.liftSpeed/100});
      analogWrite(PIN_CLAW, strongGrab ? sys.pwmStrong : sys.pwmWeak);
      if(limZTop) { analogWrite(PIN_CLAW, sys.pwmHold); changeState(RETURN); }
      break;

    case RETURN:
      analogWrite(PIN_CLAW, sys.pwmHold);
      setMotorTarget(0, HOME_DIR_X * 255 * ${config.returnSpeed/100});
      setMotorTarget(1, HOME_DIR_Y * 255 * ${config.returnSpeed/100});
      if(limX && limY) {
        stopMotors();
        changeState(sys.dropMode == 1 ? LOWER : DROP);
      }
      break;
      
    case LOWER:
      analogWrite(PIN_CLAW, sys.pwmHold);
      setMotorTarget(2, -200);
      if(millis() - stateTime > ${config.lowerTime}) changeState(DROP);
      break;

    case DROP:
      analogWrite(PIN_CLAW, 0); delay(600);
      setMotorTarget(2, 255); delay(800); stopMotors();
      changeState(CHECK);
      break;

    case CHECK:
      if(inPrize) {
        sys.totalWins++; printLog(F("EVT:WIN"));
        lcd.clear(); lcd.print(F("WINNER!"));
        if(progressiveWin) { sys.jackpotPool = 0; lcd.setCursor(0,1); lcd.print(F("JACKPOT RESET")); }
      } else { 
        printLog(F("EVT:LOSS")); 
      }
      saveConfig();
      delay(2000);
      changeState(ATTRACT);
      break;
      
    case ERROR:
      stopMotors();
      lcd.setCursor(0,0); lcd.print(F("SYSTEM ERROR"));
      printLog(F("ERR:GENERIC"));
      if(btnSelect) changeState(BOOT); // Reset
      break;
  }
}

// --- HELPERS ---

void printLog(const __FlashStringHelper* msg) {
  Serial.println(msg);
  ${wirelessEnabled ? 'btSerial.println(msg);' : ''}
}

void reportTelemetry(bool up, bool dn, bool lt, bool rt, bool drop, bool coin, bool prize, 
                     bool lx, bool ly, bool lzt, bool lzb,
                     bool sel, bool bl, bool bu, bool bd, bool br) {
  // Efficient CSV format
  Serial.print(F("TEL:"));
  Serial.print(up); Serial.print(','); Serial.print(dn); Serial.print(',');
  Serial.print(lt); Serial.print(','); Serial.print(rt); Serial.print(',');
  Serial.print(drop); Serial.print(','); Serial.print(coin); Serial.print(',');
  Serial.print(prize); Serial.print(','); Serial.print(lx); Serial.print(',');
  Serial.print(ly); Serial.print(','); Serial.print(lzt); Serial.print(',');
  Serial.print(lzb); Serial.print('|');
  Serial.print(sel); Serial.print(','); Serial.print(bl); Serial.print(',');
  Serial.print(bu); Serial.print(','); Serial.print(bd); Serial.print(',');
  Serial.println(br);

  ${wirelessEnabled ? `
  btSerial.print(F("TEL:"));
  btSerial.print(up); btSerial.print(','); btSerial.print(dn); btSerial.print(',');
  btSerial.print(lt); btSerial.print(','); btSerial.print(rt); btSerial.print(',');
  btSerial.print(drop); btSerial.print(','); btSerial.print(coin); btSerial.print(',');
  btSerial.print(prize); btSerial.print(','); btSerial.print(lx); btSerial.print(',');
  btSerial.print(ly); btSerial.print(','); btSerial.print(lzt); btSerial.print(',');
  btSerial.print(lzb); btSerial.print('|');
  btSerial.print(sel); btSerial.print(','); btSerial.print(bl); btSerial.print(',');
  btSerial.print(bu); btSerial.print(','); btSerial.print(bd); btSerial.print(',');
  btSerial.println(br);
  ` : ''}
}

void startGame() {
  sys.totalPlays++;
  strongGrab = false;
  progressiveWin = false;
  printLog(F("EVT:START"));
  
  // Logic
  if(sys.progEnabled && sys.jackpotPool >= sys.progThresh) { 
    strongGrab = true; progressiveWin = true; 
  } else if(sys.totalPlays % sys.strongInt == 0) { 
    strongGrab = true; 
  } else {
    // Basic payout algo
    float actualPct = (float)sys.totalWins / (float)sys.totalPlays * 100.0;
    if(actualPct < sys.payoutPct && random(100) < 25) strongGrab = true; 
  }
  changeState(PLAY);
}

// Soft-Start Motor Control
void updateMotors() {
  if(millis() - lastRamp < 10) return;
  lastRamp = millis();
  
  for(int i=0; i<3; i++) {
    if(currentSpeed[i] < targetSpeed[i]) currentSpeed[i] += RAMP_STEP;
    if(currentSpeed[i] > targetSpeed[i]) currentSpeed[i] -= RAMP_STEP;
    if(abs(currentSpeed[i] - targetSpeed[i]) < RAMP_STEP) currentSpeed[i] = targetSpeed[i];
    
    // Hardware Write
    byte en, in1, in2;
    if(i==0) { en=PIN_X_EN; in1=PIN_X_IN1; in2=PIN_X_IN2; }
    if(i==1) { en=PIN_Y_EN; in1=PIN_Y_IN1; in2=PIN_Y_IN2; }
    if(i==2) { en=PIN_Z_EN; in1=PIN_Z_IN1; in2=PIN_Z_IN2; }
    
    if(currentSpeed[i] == 0) {
       digitalWrite(in1, LOW); digitalWrite(in2, LOW); analogWrite(en, 0);
    } else if(currentSpeed[i] > 0) {
       digitalWrite(in1, HIGH); digitalWrite(in2, LOW); analogWrite(en, currentSpeed[i]);
    } else {
       digitalWrite(in1, LOW); digitalWrite(in2, HIGH); analogWrite(en, -currentSpeed[i]);
    }
  }
}

void setMotorTarget(byte axis, int target) {
  targetSpeed[axis] = target;
}

void stopMotors() { 
  targetSpeed[0] = 0; targetSpeed[1] = 0; targetSpeed[2] = 0; 
}

void changeState(State s) {
  state = s; stateTime = millis();
  lcd.clear(); 
  Serial.print(F("STATE:")); Serial.println(s);
  ${wirelessEnabled ? 'btSerial.print(F("STATE:")); btSerial.println(s);' : ''}
}

void loadConfig() {
  EEPROM.get(0, sys);
  uint32_t calc = calculateCRC((byte*)&sys, sizeof(sys)-4);
  if(sys.version != 0x50 || sys.crc != calc) {
    // Defaults
    sys.version = 0x50; 
    sys.playTime = ${config.playTime}; 
    sys.payoutPct = ${config.payoutPercentage};
    sys.pwmWeak = ${config.grabStrengthWeak};
    sys.pwmStrong = ${config.grabStrengthStrong};
    sys.pwmHold = ${config.solenoidHoldPower};
    sys.totalPlays = 0; sys.totalWins = 0; sys.jackpotPool = 0;
    saveConfig();
  }
}

void saveConfig() {
  sys.crc = calculateCRC((byte*)&sys, sizeof(sys)-4);
  EEPROM.put(0, sys);
}

// Dual-Serial Handling
void processSerial() {
  // 1. USB Serial
  while (Serial.available() > 0) {
    char c = (char)Serial.read();
    handleChar(c);
  }
  
  // 2. Bluetooth Serial
  ${wirelessEnabled ? `
  while (btSerial.available() > 0) {
    char c = (char)btSerial.read();
    handleChar(c);
  }
  ` : ''}
}

void handleChar(char c) {
  if (c == '\n') {
    cmdBuffer[cmdIndex] = 0; 
    parseCommand();
    cmdIndex = 0;
  } else if(cmdIndex < CMD_MAX - 1) cmdBuffer[cmdIndex++] = c;
}

void parseCommand() {
  // Security Check
  if(strncmp(cmdBuffer, "AUTH:", 5) == 0) {
     if(SECURITY_ENABLED) {
         if(strcmp(cmdBuffer+5, PAIRING_CODE) == 0) {
             isAuthenticated = true;
             printLog(F("SYS:AUTH_OK"));
         } else {
             isAuthenticated = false;
             printLog(F("ERR:AUTH_FAIL"));
         }
     } else {
        printLog(F("SYS:NO_AUTH_REQ"));
     }
     return;
  }
  
  // Gatekeeper
  if(SECURITY_ENABLED && !isAuthenticated) {
     printLog(F("ERR:NO_AUTH"));
     return;
  }

  // --- LIVE COMMANDS ---
  if(strncmp(cmdBuffer, "SET:TIME:", 9) == 0) { sys.playTime = atoi(cmdBuffer+9); saveConfig(); printLog(F("CFG:UPDATED")); }
  else if(strncmp(cmdBuffer, "SET:PAY:", 8) == 0) { sys.payoutPct = atoi(cmdBuffer+8); saveConfig(); printLog(F("CFG:UPDATED")); }
  else if(strncmp(cmdBuffer, "SET:PWM:", 8) == 0) { sys.pwmStrong = atoi(cmdBuffer+8); saveConfig(); printLog(F("CFG:UPDATED")); }

  // --- DIAGNOSTICS ---
  else if(strncmp(cmdBuffer, "DIAG:X:", 7) == 0) { remoteOverride=true; remoteX = atoi(cmdBuffer+7); }
  else if(strncmp(cmdBuffer, "DIAG:Y:", 7) == 0) { remoteOverride=true; remoteY = atoi(cmdBuffer+7); }
  else if(strncmp(cmdBuffer, "DIAG:Z:", 7) == 0) { remoteOverride=true; remoteZ = atoi(cmdBuffer+7); }
  else if(strncmp(cmdBuffer, "DIAG:CLAW:", 10) == 0) { remoteOverride=true; remoteClaw = (atoi(cmdBuffer+10) == 1); }
  else if(strncmp(cmdBuffer, "DIAG:EXP:", 9) == 0) { remoteOverride=true; expansionState = (atoi(cmdBuffer+9) == 1); }
  else if(strncmp(cmdBuffer, "DIAG:EXIT", 9) == 0) { remoteOverride=false; stopMotors(); }
  else if(strncmp(cmdBuffer, "R:STATS", 7) == 0) { sys.totalPlays=0; sys.totalWins=0; saveConfig(); }
  else if(strncmp(cmdBuffer, "R:COIN", 6) == 0) { credits++; printLog(F("EVT:COIN")); }
  else if(strncmp(cmdBuffer, "R:DROP", 6) == 0) { remoteDrop = true; }
}
`;
};