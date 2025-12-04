
import { ClawConfig, ValidationResult } from '../types';

// Arduino Uno R3 Specs
const MAX_FLASH = 32256; // 32KB - Bootloader
const MAX_RAM = 2048;    // 2KB

// Estimated resource costs (Optimized C++ Code)
const COST_BASE = { flash: 750, ram: 160 }; 
const COST_SERIAL = { flash: 500, ram: 120 }; // Using raw buffer now
const COST_WIRE = { flash: 1600, ram: 60 };   // Wire.h
const COST_LCD = { flash: 1500, ram: 40 };    // LiquidCrystal
const COST_MCP = { flash: 1200, ram: 20 };    // Adafruit_MCP23017
const COST_EEPROM = { flash: 200, ram: 0 };
const COST_SOFTSERIAL = { flash: 1200, ram: 64 }; // SoftwareSerial

export const validateConfig = (config: ClawConfig): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    estimatedFlash: 0,
    estimatedRam: 0,
    pinConflicts: []
  };

  // 1. Calculate Resources
  let flash = COST_BASE.flash + COST_SERIAL.flash + COST_WIRE.flash + COST_LCD.flash + COST_MCP.flash + COST_EEPROM.flash;
  let ram = COST_BASE.ram + COST_SERIAL.ram + COST_WIRE.ram + COST_LCD.ram + COST_MCP.ram;

  // Logic complexity
  flash += 4500; // State machine + Helpers
  if (config.progressiveEnabled) flash += 400;
  if (config.ledMode !== 0) flash += 800;
  if (config.softStartDuration > 0) flash += 150; // PWM ramping logic
  if (config.wirelessEnabled) {
      flash += COST_SOFTSERIAL.flash;
      ram += COST_SOFTSERIAL.ram;
      
      if (config.wirelessSecurityEnabled) {
          flash += 200; // Auth logic
          ram += 20; // Code storage
      }
  }

  // Safety buffer
  ram += 350; // Stack reserve

  result.estimatedFlash = flash;
  result.estimatedRam = ram;

  // 2. Resource Checks
  if (flash > MAX_FLASH) {
    result.isValid = false;
    result.errors.push(`Code exceeds Flash memory! (${flash}/${MAX_FLASH} bytes).`);
    result.suggestions.push("Disable 'LED Patterns' or 'Progressive Jackpot'.");
  }

  if (ram > MAX_RAM) {
    result.isValid = false;
    result.errors.push(`RAM usage critical! (${ram}/${MAX_RAM} bytes).`);
  } else if (ram > (MAX_RAM * 0.8)) {
    result.warnings.push(`RAM usage high (${Math.round((ram/MAX_RAM)*100)}%).`);
  }

  // 3. Pin Conflict Check
  const pinMap = new Map<string, string>();
  
  // Hardware Reserved Pins check
  const usesI2C = Object.values(config.pinMappings).some(p => p.startsWith('MCP_')) || config.expansionEnabled;
  
  // Helper to register pin usage
  const registerPin = (pin: string, func: string) => {
      if(pin.startsWith('MCP_')) return; // MCP pins don't conflict with Arduino pins
      
      // I2C Conflict Check
      if (usesI2C && (pin === 'A4' || pin === 'A5')) {
        result.isValid = false;
        result.errors.push(`Pin ${pin} (${func}) conflict: I2C is active.`);
      }

      if (pinMap.has(pin)) {
        result.isValid = false;
        const conflict = `Pin ${pin} is shared by ${pinMap.get(pin)} and ${func}`;
        result.errors.push(conflict);
        result.pinConflicts.push(func);
      } else {
        pinMap.set(pin, func);
      }
  };

  // Check Mapped Pins
  Object.entries(config.pinMappings).forEach(([func, pin]) => registerPin(pin, func));
  
  // Check Wireless Pins
  if(config.wirelessEnabled) {
      registerPin(config.wirelessRxPin, 'Bluetooth RX');
      registerPin(config.wirelessTxPin, 'Bluetooth TX');
      
      // Hardware Serial Conflict
      if(config.wirelessRxPin === 'D0' || config.wirelessTxPin === 'D1') {
          result.warnings.push("Using D0/D1 for Bluetooth disables USB upload. Recommended: A1/A2.");
      }
      
      // Security Check
      if (config.wirelessSecurityEnabled) {
          if (!config.wirelessPairingCode || config.wirelessPairingCode.length < 4 || config.wirelessPairingCode.length > 8) {
              result.isValid = false;
              result.errors.push("Pairing Code must be 4-8 alphanumeric characters.");
          }
      }
  }

  // Check Expansion
  if(config.expansionEnabled && !config.expansionPin.startsWith('MCP_')) {
      registerPin(config.expansionPin, 'Expansion');
  }

  // 4. Logic & Safety Validation
  if (config.grabTime > 5000) {
    result.warnings.push("Grab time > 5s may overheat solenoid.");
  }
  if (config.payoutPercentage > 80) {
    result.warnings.push("Payout > 80% may cause loss.");
  }
  if(config.grabStrengthStrong > 255 || config.grabStrengthWeak > 255) {
      result.isValid = false;
      result.errors.push("PWM values must be 0-255");
  }

  return result;
};

export const fixConfig = (config: ClawConfig): ClawConfig => {
  const newConfig = JSON.parse(JSON.stringify(config)) as ClawConfig;
  
  const availablePins = ['D2', 'D12', 'A1', 'A2', 'A3', 'MCP_0', 'MCP_1', 'MCP_2', 'MCP_3', 'MCP_4', 'MCP_5', 'MCP_6', 'MCP_7', 'MCP_8', 'MCP_9', 'MCP_10', 'MCP_11', 'MCP_12', 'MCP_13', 'MCP_14', 'MCP_15'];
  
  // Remove A4/A5 from available if using I2C
  const usesI2C = true; // Assume yes for safety if fixing
  
  const used = new Set<string>();
  const keys = Object.keys(newConfig.pinMappings);

  keys.forEach(func => {
    let pin = newConfig.pinMappings[func];
    
    // Check conflicts
    let conflict = used.has(pin);
    // Check I2C
    if(usesI2C && (pin === 'A4' || pin === 'A5')) conflict = true;
    
    if (conflict) {
      // Find new pin
      const free = availablePins.find(p => !used.has(p));
      if (free) {
        newConfig.pinMappings[func] = free;
        used.add(free);
      }
    } else {
      used.add(pin);
    }
  });

  // Safety clamps
  newConfig.payoutPercentage = Math.min(newConfig.payoutPercentage, 80);
  newConfig.grabTime = Math.min(newConfig.grabTime, 4000);
  newConfig.grabStrengthStrong = Math.min(255, newConfig.grabStrengthStrong);
  newConfig.grabStrengthWeak = Math.min(255, newConfig.grabStrengthWeak);
  
  // Security Fix
  if(newConfig.wirelessSecurityEnabled && newConfig.wirelessPairingCode.length < 4) {
      newConfig.wirelessPairingCode = "1234";
  }

  return newConfig;
};