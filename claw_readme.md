# E-CLAW 900 Retrofit - Version 5.8

## 📦 Two Versions Available

### **CLAW-5.8.ino** - Standard LCD Version
Full-featured with 16x2 LCD shield and 5 buttons for operator interface

### **CLAW-5.8-HEADLESS.ino** - Headless Version
No LCD required - Serial monitoring and remote configuration

---

## 🔧 Hardware Requirements

### Common to Both Versions:
- **Arduino Uno R3**
- **3x L298N Motor Drivers** (ENA jumpered HIGH for full speed)
- **MCP23017 I2C GPIO Expander** (address 0x20)
- **Prize Sensor Array**: 3x optical sensors on pins A1, A2, A3
- **Motors**: X, Y, Z axis + Claw solenoid
- **Limit Switches**: X-min/max, Y-min/max, Z-min/max (optical on Z)
- **Coin Acceptor**: Pulse input
- **Joystick**: 4-direction on MCP23017
- **Drop Button**: On MCP23017

### Standard Version Additional:
- **LCD Keypad Shield** (16x2, pins 4-10, A0 for buttons)

### Headless Version Additional:
- **Status LED**: Pin 13 (built-in)
- **Optional Credit LED**: A4
- **Optional Playing LED**: A5
- **USB Serial Connection** for monitoring/control

---

## 📍 Pinout

### Arduino Uno Pins:

| Pin | Standard Version | Headless Version | Notes |
|-----|------------------|------------------|-------|
| 0 | Claw Control | Claw Control | Disconnect when uploading! |
| 1 | Z Motor IN1 | Z Motor IN1 | |
| 2 | Z Motor IN2 | Z Motor IN2 | |
| 3 | X Motor IN1 | X Motor IN1 | |
| 4-10 | LCD Shield | Available | LCD uses these in standard |
| 11 | X Motor IN2 | X Motor IN2 | |
| 12 | Y Motor IN1 | Y Motor IN1 | |
| 13 | Y Motor IN2 | Y Motor IN2 / Status LED | |
| A0 | LCD Buttons | Available | |
| A1 | Prize Sensor 1 | Prize Sensor 1 | |
| A2 | Prize Sensor 2 | Prize Sensor 2 | |
| A3 | Prize Sensor 3 | Prize Sensor 3 | |
| A4 | I2C SDA | I2C SDA / Credit LED | |
| A5 | I2C SCL | I2C SCL / Playing LED | |

### MCP23017 Pin Assignments:

| MCP Pin | Function | Type |
|---------|----------|------|
| 0 | Joystick UP | Input (pullup) |
| 1 | Joystick DOWN | Input (pullup) |
| 2 | Joystick LEFT | Input (pullup) |
| 3 | Joystick RIGHT | Input (pullup) |
| 4 | DROP Button | Input (pullup) |
| 5 | COIN Pulse | Input (pullup) |
| 6 | Limit X-MIN | Input (pullup) |
| 7 | Limit X-MAX | Input (pullup) |
| 8 | Limit Y-MIN | Input (pullup) |
| 9 | Limit Y-MAX | Input (pullup) |
| 10 | Limit Z-MIN (optical) | Input (pullup) |
| 11 | Limit Z-MAX (optical) | Input (pullup) |

---

## 🚀 Installation

### 1. Install Arduino Libraries
```
Sketch -> Include Library -> Manage Libraries
```
Install:
- **Adafruit MCP23017** (or MCP23X17)
- **LiquidCrystal** (built-in, standard version only)
- **Wire** (built-in)
- **EEPROM** (built-in)

### 2. Upload Code

**IMPORTANT**: Disconnect **Pin 0 (Claw Control)** wire before uploading!

1. Open the appropriate `.ino` file in Arduino IDE
2. Select **Board**: Arduino Uno
3. Select **Port**: Your Arduino's COM port
4. Click **Upload**
5. Wait for "Done uploading"
6. Reconnect Pin 0 wire

### 3. Initial Setup

**Standard Version:**
- Power on, LCD shows "E-CLAW 5.8"
- Machine will auto-home (Z up, Y front, X left)
- Insert coin to test

**Headless Version:**
- Open Serial Monitor (9600 baud)
- Type `?` to see status
- Type `M` to enter menu
- Machine will auto-home and report via Serial

---

## 🎮 Operation

### Standard Version (LCD)

**Normal Operation:**
1. INSERT COIN → Credits shown
2. Press DROP button → Game starts
3. Use joystick to position claw
4. Press DROP → Claw descends, grabs, returns
5. Prize detection → WIN or GAME OVER

**Operator Menu:**
1. Hold DROP button for 3 seconds (no credits)
2. Use joystick UP/DOWN to navigate
3. Use joystick LEFT/RIGHT to adjust values
4. Navigate to "Save & Exit" and press DROP

### Headless Version (Serial)

**Serial Commands (9600 baud):**
- `?` - Show current status
- `M` - Enter menu mode
- `T+` / `T-` - Adjust play time (±5 seconds)
- `P+` / `P-` - Adjust payout target (±5%)
- `S+` / `S-` - Adjust strong grab interval (±1)
- `M+` / `M-` - Adjust mercy rule (±1)
- `W+` / `W-` - Adjust weak grab time (±100ms)
- `G+` / `G-` - Adjust strong grab time (±100ms)
- `X` - Save config and exit menu
- `R` - Reset all stats (requires confirmation)
- `H` - Force homing sequence

**Example Session:**
```
> ?
===== E-CLAW STATUS =====
Version: 5.8H
State: ATTRACT
Credits: 0
Total Plays: 47
Total Wins: 15
Actual Payout: 31%
=========================

> M
===== CONFIGURATION =====
1. Play Time: 30s
2. Target Payout: 33%
3. Strong Interval: 1/8
4. Mercy Rule: 5
5. Weak Grab: 1200ms
6. Strong Grab: 2500ms
=========================

> P+
Payout: 38%

> X
Config saved!
```

---

## ⚙️ Configuration Parameters

### Adjustable Settings:

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| **Play Time** | 15-90s | 30s | Time allowed for positioning |
| **Payout Target** | 10-70% | 33% | Target win percentage |
| **Strong Interval** | 1-20 | 8 | Guaranteed strong grab every N plays |
| **Mercy Rule** | 1-10 | 5 | Strong grab after N consecutive losses |
| **Weak Grab Time** | 500-3000ms | 1200ms | Normal grab motor time |
| **Strong Grab Time** | 1000-5000ms | 2500ms | Power grab motor time |

### Payout Logic (Improved v5.8):

Strong grab triggers when ANY of these conditions met:
1. **Interval**: Every 8th play (configurable)
2. **Mercy**: 5 consecutive losses (configurable)
3. **Payout Gap**: If actual payout < target:
   - Gap of 10% → 20% chance
   - Gap of 15% → 30% chance
   - Gap of 20% → 40% chance
   - (Probability = Gap × 2)

---

## 🛡️ Safety Features

### Watchdog Timer
- 2-second timeout
- Auto-resets Arduino if code hangs
- Prevents stuck motors

### Motor Timeouts
- **12 seconds max** continuous run time
- **500ms idle** in PLAY state stops motors
- Prevents driver burnout

### State Timeouts
- **30 seconds max** in any state (except ATTRACT)
- Prevents getting stuck

### Homing Protection
- **8 seconds per axis** timeout
- Shows specific error (X, Y, or Z fail)
- Safe failure mode

### I2C Error Detection
- Monitors MCP23017 communication
- 10 consecutive errors → ERROR state
- Prevents random behavior

### EEPROM Wear Protection
- Saves every **10 coins** instead of every coin
- Saves on game **wins/losses**
- Extends EEPROM life to 100,000+ plays

---

## 🔍 Troubleshooting

### Arduino Won't Upload
**Problem**: "avrdude: stk500_recv(): programmer is not responding"
**Solution**: Disconnect Pin 0 (Claw Control) wire during upload

### Homing Fails
**Problem**: "ERROR: 2 - X AXIS FAIL"
**Solution**: 
- Check limit switch wiring
- Verify switches are normally-open (NO)
- Test continuity with multimeter
- Check MCP23017 I2C connection

### Motors Don't Move
**Problem**: No motor response
**Solution**:
- Verify L298N ENA pins are jumpered HIGH
- Check motor power supply (12V typical)
- Test motor drivers with multimeter
- Verify IN1/IN2 connections

### Prize Not Detected
**Problem**: Always loses / always wins
**Solution**:
- Check A1, A2, A3 sensor wiring
- Sensors should be INPUT_PULLUP
- Test sensors: LOW = prize detected
- Clean optical sensor lenses

### LCD Shows Garbage (Standard)
**Problem**: Random characters on LCD
**Solution**:
- Check LCD shield is firmly seated
- Verify I2C address (0x27 or 0x3F)
- Adjust contrast potentiometer on shield
- Check 5V power supply

### Watchdog Keeps Resetting
**Problem**: Arduino reboots every 2 seconds
**Solution**:
- Check for infinite loops in code
- Verify MCP23017 responds (I2C scan)
- Look for Serial output showing error
- Check power supply stability

### Credits Disappear
**Problem**: Credits expire too quickly
**Solution**:
- Check `CREDIT_TIMEOUT` setting (default 120 seconds)
- Increase timeout in code if needed
- Verify coin pulse is clean (debounced)

---

## 📊 Monitoring & Diagnostics

### Standard Version (LCD)
- Real-time display shows:
  - Credits available
  - Time remaining in play
  - Power mode indicator
  - Game over messages
  - Error codes

### Headless Version (Serial Monitor)
- Continuous logging:
  ```
  [COIN] Credits: 1
  [STATE] PLAY
  [START] Play #23 | Strong: NO
  [DROP] Button pressed
  [GRAB] Normal
  [DROP] Release
  [LOSE] No prize
  [STATS] Plays: 23 | Wins: 7 | Payout: 30%
  [NEXT] 5 plays until power
  ```

- Auto-status every 60 seconds in ATTRACT mode
- Error reporting with codes

---

## 🔒 Error Codes

| Code | Error | Cause | Solution |
|------|-------|-------|----------|
| 1 | MCP_FAIL | MCP23017 not detected | Check I2C wiring (SDA/SCL) |
| 2 | HOMING_X | X axis won't home | Check X limit switches |
| 3 | HOMING_Y | Y axis won't home | Check Y limit switches |
| 4 | HOMING_Z | Z axis won't home | Check Z optical sensors |
| 5 | STATE_TIMEOUT | Stuck in state >30s | Check limit switches, power cycle |
| 6 | MOTOR_STUCK | Motor ran >12s | Check for mechanical jam |
| 7 | I2C_FAIL | I2C bus failure | Check MCP23017, loose wires |

**All errors require power cycle to recover** (safety feature)

---

## 📈 Performance Tuning

### Increase Difficulty (More Profit)
1. Decrease **Payout Target** (e.g., 25%)
2. Increase **Strong Interval** (e.g., 1/12)
3. Increase **Mercy Rule** (e.g., 7 losses)
4. Decrease **Weak Grab Time** (e.g., 1000ms)

### Increase Generosity (More Wins)
1. Increase **Payout Target** (e.g., 40%)
2. Decrease **Strong Interval** (e.g., 1/5)
3. Decrease **Mercy Rule** (e.g., 3 losses)
4. Increase **Strong Grab Time** (e.g., 3000ms)

### Optimize Play Time
- **Short (20s)**: Fast turnover, less positioning skill needed
- **Medium (30s)**: Balanced gameplay
- **Long (45s)**: More skill-based, better for competitive players

---

## 🔄 Upgrading from v5.6 to v5.8

**What's New:**
- ✅ Prize sensor array support (A1-A3)
- ✅ Fixed motor timeout false triggers
- ✅ Fixed payout calculation overflow (safe to 2 billion plays!)
- ✅ Non-blocking celebration (no missed coins)
- ✅ Better state management
- ✅ I2C error detection
- ✅ Headless version for remote operation

**Migration Steps:**
1. Backup your EEPROM data (write down stats)
2. Upload new code
3. Version mismatch will auto-reset to defaults
4. Re-enter your preferred settings
5. Stats will start from zero (or manually restore)

**Configuration Structure Changed:**
- Added `consecutiveLosses` tracking
- Version bumped to 58
- Checksum recalculated

---

## 📝 Development Notes

### Memory Usage (Arduino Uno):
- **Flash**: ~26-28KB / 32KB (82-87%)
- **RAM**: ~1400-1500 bytes / 2048 bytes (68-73%)
- **EEPROM**: 50 bytes used

### Future Enhancements (Possible):
- [ ] Encoder support for X-axis positioning memory
- [ ] Multiple drop zones
- [ ] Time-of-day pricing
- [ ] Network connectivity (ESP32 version)
- [ ] RFID card reader for credits
- [ ] Advanced statistics (hourly/daily reports)

---

## 🤝 Support

### Compile Errors?
- Verify all libraries installed
- Check Arduino IDE version (1.8.19+ recommended)
- Board set to "Arduino Uno"
- Port selected correctly

### Behavior Issues?
- Check Serial Monitor (headless) or LCD (standard)
- Look for error codes
- Verify limit switch wiring
- Test motors manually

### Need Help?
Document your issue with:
1. Version (5.8 or 5.8H)
2. Error code (if any)
3. What state machine was in
4. Serial output (if headless)
5. Actions taken before issue

---

## ⚖️ Legal & Safety

**WARNING**: This code controls physical motors and mechanical systems.

- ✅ Always test with low voltage first
- ✅ Install emergency stop button
- ✅ Use proper wire gauge for motors
- ✅ Fuse all power supplies
- ✅ Ensure mechanical safety (pinch points, etc.)
- ✅ Comply with local gaming regulations
- ✅ Regular maintenance and inspection

**Disclaimer**: This code is provided as-is. The author assumes no liability for damage, injury, or financial loss. Use at your own risk. Test thoroughly before deploying in production.

---

## 📄 License

Open source for educational and commercial use.
Attribution appreciated but not required.

**Version**: 5.8 (Standard & Headless)
**Release Date**: 2024
**Author**: E-CLAW Retrofit Project

---

*Happy Clawing! 🎯🧸*