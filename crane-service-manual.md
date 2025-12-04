# PROFESSIONAL CRANE CONTROL SYSTEM
## Complete Service & Operations Manual
### Version 3.5 | November 2024

---

## TABLE OF CONTENTS

### SECTION 1: SYSTEM OVERVIEW
1.1 Introduction  
1.2 Features and Capabilities  
1.3 System Specifications  
1.4 Safety Information  
1.5 Warranty and Support

### SECTION 2: INSTALLATION
2.1 Component Checklist  
2.2 Tools Required  
2.3 Wiring Diagrams  
2.4 Installation Procedures  
2.5 Initial Configuration

### SECTION 3: OPERATION
3.1 Operator Controls  
3.2 Crane Style Profiles  
3.3 Game Settings  
3.4 Menu Navigation Guide  
3.5 Daily Operations

### SECTION 4: CONFIGURATION
4.1 Timing Controls  
4.2 Payout Settings  
4.3 Audio/Visual Setup  
4.4 Home Position Configuration  
4.5 Progressive Jackpot Setup

### SECTION 5: TROUBLESHOOTING
5.1 Common Issues and Solutions  
5.2 Error Codes Reference  
5.3 Diagnostic Procedures  
5.4 Component Testing

### SECTION 6: MAINTENANCE
6.1 Daily Maintenance  
6.2 Weekly Maintenance  
6.3 Monthly Maintenance  
6.4 Parts Replacement Schedule

### SECTION 7: TRAINING GUIDE
7.1 Basic Operation Training  
7.2 Advanced Configuration  
7.3 Troubleshooting Training  
7.4 Revenue Optimization

### SECTION 8: TECHNICAL REFERENCE
8.1 Pin Assignment Table  
8.2 Parts List with Links  
8.3 Upgrade Options  
8.4 Future Expansion Ideas

### SECTION 9: BUSINESS OPTIMIZATION
9.1 Proven Money-Making Concepts  
9.2 Payout Tables  
9.3 Location Analysis  
9.4 Prize Selection Guide

### SECTION 10: APPENDICES
10.1 Blank Log Sheets  
10.2 Machine Information Sheet  
10.3 Preset Configuration Tables  
10.4 Revision History

---

# SECTION 1: SYSTEM OVERVIEW

## 1.1 INTRODUCTION

The Professional Crane Control System v3.5 is a complete, Arduino-based control solution designed to replace proprietary crane control boards. This system provides commercial-grade functionality with extensive customization options suitable for arcade operations, events, and entertainment venues.

### Key Benefits
- **Cost-Effective**: Fraction of the cost of proprietary replacement boards
- **Fully Customizable**: Complete control over all game parameters
- **Reliable**: Built-in error handling and diagnostic tools
- **Expandable**: Easy to add features and upgrades
- **Well-Supported**: Comprehensive documentation and training materials

## 1.2 FEATURES AND CAPABILITIES

### Core Features
✓ 5 Pre-configured Crane Style Profiles  
✓ Prize Sensor Integration  
✓ Progressive Jackpot System  
✓ Complete Timing Control (6 parameters)  
✓ Configurable Home Position  
✓ 3 Drop Behavior Modes  
✓ Extensive Bookkeeping  
✓ Error Logging and Diagnostics  

### Audio Features
✓ Built-in Tone Library  
✓ Victory Melodies  
✓ Volume Control (0-100%)  
✓ Audio Mode Selection  
✓ Custom Audio Support (via SD card - optional)

### Visual Features
✓ 7 LED Effect Modes  
✓ Game-Synced Lighting  
✓ Brightness Control  
✓ Effect Speed Control  
✓ Attract Mode Lighting

### Advanced Features
✓ Watchdog Timer Protection  
✓ Memory Management  
✓ EEPROM Data Persistence  
✓ Dual Checksum Validation  
✓ State Machine Safety  
✓ Emergency Stop Function

## 1.3 SYSTEM SPECIFICATIONS

### Hardware Requirements
- **Microcontroller**: Arduino Uno (ATmega328P)
- **Display**: LCD1602 Keypad Shield (16x2 with 5 buttons)
- **Motor Drivers**: 3x L298N or IBT-2 modules
- **Power Supply**: 24V DC, 5A minimum (or 36V/48V for full power)
- **Claw Control**: 5V relay module (10A rated)
- **Prize Sensor**: IR sensor or microswitch (optional)
- **Audio**: Passive buzzer or small speaker (optional)
- **Storage**: Optional SD card module for custom audio

### Electrical Specifications
- **Input Voltage**: 24-48V DC (motor power)
- **Control Voltage**: 5V DC (Arduino logic)
- **Motor Current**: Up to 2A per axis (L298N), up to 43A (IBT-2)
- **Claw Current**: Up to 10A (relay rated)
- **Power Consumption**: Approximately 50-150W during operation

### Performance Specifications
- **Play Time Range**: 15-120 seconds
- **Payout Range**: 10-70%
- **Response Time**: <50ms button response
- **Position Accuracy**: ±5mm (with proper calibration)
- **MTBF**: >10,000 plays (with proper maintenance)

## 1.4 SAFETY INFORMATION

### ⚠️ ELECTRICAL SAFETY

**WARNING: HIGH VOLTAGE**
- Motor power supply operates at 24-48V DC
- Always disconnect power before servicing
- Use insulated tools when working on electrical components
- Ensure all connections are secure before applying power

**DANGER: ELECTRIC SHOCK HAZARD**
- Never work on live circuits
- Always use proper lockout/tagout procedures
- Verify power is off with multimeter before touching components

### ⚠️ MECHANICAL SAFETY

**MOVING PARTS**
- Keep hands clear of crane during operation
- Emergency stop button must be functional at all times
- Test all movements before returning to service
- Inspect cables and pulleys for wear regularly

**PINCH POINTS**
- Crane gantry can create pinch points
- Never place hands between claw and prizes
- Warn customers to keep hands clear during operation

### ⚠️ OPERATIONAL SAFETY

**PROPER SUPERVISION**
- Children must be supervised while playing
- Operator should monitor machine during busy periods
- Clear signage indicating proper usage
- Emergency contact information visible

**PRIZE SAFETY**
- Ensure prizes are appropriate size and weight
- No sharp or hazardous items in crane
- Regular inspection of prize condition
- Replace damaged prizes immediately

## 1.5 WARRANTY AND SUPPORT

### Limited Warranty
This software is provided "as-is" without warranty of any kind. Hardware components carry manufacturer warranties (typically 30-90 days).

### Technical Support
- Online documentation: [Your website/GitHub]
- Email support: [Your support email]
- Community forum: [Forum link]
- Video tutorials: [YouTube channel]

### Recommended Service Intervals
- Daily: Visual inspection, prize refill
- Weekly: Clean sensors, check connections
- Monthly: Full system diagnostic, deep cleaning
- Annually: Complete overhaul, component replacement

---

# SECTION 2: INSTALLATION

## 2.1 COMPONENT CHECKLIST

### Essential Components (Required)

□ **Arduino Uno R3 Board** (or compatible)  
□ **LCD Keypad Shield** (1602, 16x2 with 5 buttons)  
□ **Motor Driver Modules** (3x L298N or IBT-2)  
□ **Relay Module** (5V trigger, 10A+ rated)  
□ **Buck Converter** (DC-DC step-down, adjustable)  
□ **Power Supply** (24V 5A minimum)  

### Optional Components

□ **Prize Sensor** (IR sensor or microswitch)  
□ **Buzzer** (Passive buzzer for audio feedback)  
□ **SD Card Module** (For custom audio - future)  
□ **RGB LED Strip** (12V, common anode)  
□ **Emergency Stop Button** (Mushroom style, red)  

### Wiring & Connectors

□ **JST Connector Kit** (Various sizes)  
□ **Dupont Jumper Wires** (Male-to-female)  
□ **Heat Shrink Tubing** (Assorted sizes)  
□ **Wire Ferrules** (For screw terminals)  
□ **22 AWG Wire** (Silicone insulated)  
□ **Cable Ties** (For cable management)  

### Tools Required

□ Wire strippers  
□ Crimping tool  
□ Multimeter  
□ Screwdriver set  
□ Heat gun or lighter  
□ Soldering iron (optional)  
□ Label maker or tape  

## 2.2 PARTS LIST WITH LINKS

### Arduino & Display

**Arduino Uno Compatible Board**
- Amazon: Search "ELEGOO UNO R3 Board"
- AliExpress: Search "Arduino Uno R3 ATmega328P"
- Price: $12-18 USD
- Specifications: ATmega328P, 5V, USB programmable

**LCD Keypad Shield**
- Amazon: Search "LCD1602 Keypad Shield Arduino"
- AliExpress: Search "1602 LCD shield 5 button"
- Price: $8-15 USD
- Specifications: 16x2 character, 5 buttons, blue backlight

### Motor Drivers

**Option 1: L298N Motor Driver (Budget)**
- Amazon: Search "L298N motor driver module"
- Price: $5-8 each (need 3)
- Max Voltage: 46V
- Max Current: 2A per channel
- Good for: 24V motors, testing

**Option 2: IBT-2 Motor Driver (Recommended)**
- Amazon: Search "IBT-2 H-Bridge motor driver"
- Price: $12-18 each (need 3)
- Max Voltage: 43V
- Max Current: 43A per channel
- Good for: 36V-48V motors, heavy duty

**Option 3: Cytron MD30C (Premium)**
- RobotShop: Search "Cytron MD30C"
- Price: $30-40 each
- Max Voltage: 80V
- Max Current: 30A continuous
- Good for: Professional installations

### Power Components

**Buck Converter (DC-DC Step Down)**
- Amazon: Search "LM2596 step down converter"
- Price: $6-10
- Input: Up to 40V
- Output: Adjustable 1.25-37V
- Features: LED voltage display

**Relay Module**
- Amazon: Search "5V relay module single channel"
- Price: $5-10
- Trigger: 5V
- Contact: 10A 250VAC / 10A 30VDC
- Features: Opto-isolated, LED indicator

### Sensors & Accessories

**Prize Sensor - IR Option**
- Amazon: Search "E18-D80NK IR sensor"
- Price: $3-8
- Type: Infrared proximity sensor
- Range: 3-80cm adjustable
- Output: NPN normally open

**Prize Sensor - Microswitch Option**
- Amazon: Search "micro limit switch lever"
- Price: $1-3
- Type: SPDT microswitch
- Rating: 5A 125VAC
- Mount: Through-hole or bracket

**Passive Buzzer**
- Amazon: Search "passive buzzer 5V Arduino"
- Price: $2-5
- Voltage: 5V
- Type: Electromagnetic
- Frequency: 2-4kHz

**Emergency Stop Button**
- Amazon: Search "emergency stop button mushroom"
- Price: $8-15
- Type: NC (normally closed)
- Color: Red
- Size: 22mm mushroom head

### Wiring Supplies

**JST Connector Kit**
- Amazon: Search "JST connector kit assorted"
- Price: $12-20
- Includes: 2.0mm, 2.5mm pitch connectors
- Quantity: 100+ pieces

**Dupont Wire Kit**
- Amazon: Search "dupont jumper wire kit"
- Price: $10-15
- Length: 20cm
- Types: M-M, M-F, F-F

**Heat Shrink Tubing**
- Amazon: Search "heat shrink tubing kit"
- Price: $10-15
- Sizes: 2mm to 10mm
- Colors: Assorted

**Ferrule Crimping Kit**
- Amazon: Search "wire ferrule crimping kit"
- Price: $20-30
- Sizes: 0.5mm² to 6mm²
- Includes: Crimper and 1200+ ferrules

## 2.3 WIRING DIAGRAMS

### System Overview Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    POWER DISTRIBUTION                        │
│                                                              │
│   24V DC Power Supply (5A+)                                 │
│            │                                                 │
│            ├──────────→ Motor Driver #1 (X-axis)           │
│            ├──────────→ Motor Driver #2 (Y-axis)           │
│            ├──────────→ Motor Driver #3 (Z-axis)           │
│            ├──────────→ Claw Relay (via 24V)               │
│            └──────────→ Buck Converter Input                │
│                                │                             │
│                         Buck Converter (5V Out)             │
│                                │                             │
│                         Arduino Uno                          │
│                                │                             │
│                         LCD Shield                           │
└─────────────────────────────────────────────────────────────┘
```

### Complete Wiring Schematic

```
POWER SECTION:
══════════════

24V Power Supply
    (+) ───┬─→ Motor Driver #1: 12V Input
           ├─→ Motor Driver #2: 12V Input
           ├─→ Motor Driver #3: 12V Input
           ├─→ Relay Module: VCC (via claw circuit)
           └─→ Buck Converter: IN+
           
    (-) ───┬─→ All Motor Drivers: GND
           ├─→ Buck Converter: IN-
           ├─→ Arduino GND (via Buck Converter)
           └─→ Relay Module: GND (via claw circuit)

Buck Converter
    OUT+ ──→ Arduino VIN (set to 5V!)
    OUT- ──→ Arduino GND


MOTOR CONTROL SECTION:
═══════════════════════

Motor Driver #1 (X-AXIS):
    12V   ← 24V Supply (+)
    GND   ← 24V Supply (-)
    ENA   ← Arduino Pin 3 (PWM)
    IN1   ← Arduino Pin A1
    IN2   ← Arduino Pin A2
    OUT1  ← Motor X Wire 1
    OUT2  ← Motor X Wire 2

Motor Driver #2 (Y-AXIS):
    12V   ← 24V Supply (+)
    GND   ← 24V Supply (-)
    ENA   ← Arduino Pin 11 (PWM)
    IN1   ← Arduino Pin A3
    IN2   ← Arduino Pin A4
    OUT1  ← Motor Y Wire 1
    OUT2  ← Motor Y Wire 2

Motor Driver #3 (Z-AXIS):
    12V   ← 24V Supply (+)
    GND   ← 24V Supply (-)
    ENA   ← Arduino Pin 10 (PWM)
    IN1   ← Arduino Pin 12
    IN2   ← Arduino Pin 13
    OUT1  ← Motor Z Wire 1
    OUT2  ← Motor Z Wire 2


CLAW CONTROL SECTION:
═══════════════════════

Relay Module:
    VCC   ← Arduino 5V
    GND   ← Arduino GND
    IN    ← Arduino Pin 2
    COM   ← Claw Power Wire 1
    NO    ← Claw Power Wire 2


SENSOR SECTION:
═══════════════

Prize Sensor (IR or Switch):
    VCC   ← Arduino 5V (IR sensor only)
    GND   ← Arduino GND
    OUT   ← Arduino Pin A5 (INPUT_PULLUP)
    
    Note: Sensor should pull Pin A5 to GND when triggered


AUDIO SECTION (OPTIONAL):
═════════════════════════

Passive Buzzer:
    (+)   ← Arduino Pin 1 (TX)
    (-)   ← Arduino GND
```

### Pin Assignment Table

| Arduino Pin | Function | Connection | Type |
|-------------|----------|------------|------|
| **Digital Pins** | | | |
| 0 | RX | Reserved (Serial) | Input |
| 1 | TX / Buzzer | Audio output | Output |
| 2 | Claw Relay | Relay IN pin | Output |
| 3 | Motor X ENA | Speed control | PWM Output |
| 4-7 | LCD Shield | Display control | Output |
| 8-9 | LCD Shield | Display control | Output |
| 10 | Motor Z ENA | Speed control | PWM Output |
| 11 | Motor Y ENA | Speed control | PWM Output |
| 12 | Motor Z IN1 | Direction | Output |
| 13 | Motor Z IN2 | Direction | Output |
| **Analog Pins** | | | |
| A0 | LCD Buttons | Button input | Input |
| A1 | Motor X IN1 | Direction | Output |
| A2 | Motor X IN2 | Direction | Output |
| A3 | Motor Y IN1 | Direction | Output |
| A4 | Motor Y IN2 | Direction | Output |
| A5 | Prize Sensor | Sensor input | Input (Pullup) |

### Detailed Motor Driver Wiring

**L298N Module Pin Connections:**

```
┌────────────────────────────────┐
│        L298N MODULE             │
│                                 │
│  [12V] [GND] [5V]              │  ← Power Input
│                                 │
│  [ENA] [IN1] [IN2]             │  ← Logic Inputs
│   PWM   DIR   DIR               │
│                                 │
│  [OUT1] [OUT2]                 │  ← Motor Outputs
│                                 │
│  [GND] [GND]                   │  ← Logic Ground
└────────────────────────────────┘

Connections:
- 12V: Connect to 24V power supply (+)
- GND (power): Connect to 24V power supply (-)
- 5V: Leave disconnected (or use for LED)
- ENA: Connect to Arduino PWM pin (3, 10, or 11)
- IN1: Connect to Arduino digital pin
- IN2: Connect to Arduino digital pin
- OUT1: Connect to motor wire 1
- OUT2: Connect to motor wire 2
- GND (logic): Connect to Arduino GND
```

**IBT-2 Module Pin Connections:**

```
┌────────────────────────────────┐
│        IBT-2 MODULE             │
│                                 │
│  [LPWM] [RPWM] [VCC] [GND]    │  ← Logic Inputs
│                                 │
│  [B+] [B-] [12-36V] [GND]     │  ← Power & Motor
└────────────────────────────────┘

Connections:
- LPWM: Connect to Arduino IN1 pin
- RPWM: Connect to Arduino IN2 pin
- VCC: Connect to Arduino 5V
- GND (logic): Connect to Arduino GND
- B+: Connect to motor wire 1
- B-: Connect to motor wire 2
- 12-36V: Connect to power supply (+)
- GND (power): Connect to power supply (-)

Control Logic:
- LPWM HIGH, RPWM LOW = Forward
- LPWM LOW, RPWM HIGH = Reverse
- Both LOW = Brake
- Both HIGH = Brake
```

### Prize Sensor Wiring Options

**Option 1: IR Proximity Sensor (E18-D80NK)**

```
Sensor Connections:
    Brown Wire  → Arduino 5V
    Blue Wire   → Arduino GND
    Black Wire  → Arduino Pin A5

Configuration:
- Adjust potentiometer for detection distance
- LED on sensor indicates power
- Output is normally HIGH, goes LOW when object detected
- Arduino uses INPUT_PULLUP mode
```

**Option 2: Mechanical Microswitch**

```
Switch Connections:
    COM Terminal → Arduino 5V
    NO Terminal  → Arduino Pin A5
    NC Terminal  → Not connected

Configuration:
- Mount switch on claw finger
- Switch closes when prize gripped
- Arduino uses INPUT_PULLUP mode
- Pin A5 goes LOW when switch closes
```

## 2.4 INSTALLATION PROCEDURES

### Step 1: Prepare Workspace

1. **Clear work area** of debris and hazards
2. **Gather all components** from checklist
3. **Verify tools** are functional
4. **Prepare wiring labels** for identification
5. **Review wiring diagrams** completely before starting

### Step 2: Buck Converter Configuration

**⚠️ CRITICAL: Must be done BEFORE connecting Arduino!**

1. Connect buck converter INPUT to 24V power supply
2. DO NOT connect Arduino yet
3. Measure OUTPUT voltage with multimeter
4. Adjust potentiometer (small screw) until OUTPUT = 5.0V
5. Verify voltage is stable at 5.0V ±0.1V
6. Disconnect from power
7. Now safe to connect to Arduino

**Common Mistake:** Connecting Arduino before adjusting output voltage can damage the board!

### Step 3: Arduino and Display Assembly

1. **Stack LCD Keypad Shield** onto Arduino Uno
   - Align all pins carefully
   - Press down firmly but gently
   - Verify all pins are seated

2. **Test Display**
   - Connect Arduino to USB (computer or 5V adapter)
   - Upload test sketch or system code
   - Verify LCD shows text
   - Test all 5 buttons

### Step 4: Motor Driver Installation

**For each of 3 motor drivers:**

1. Mount driver to mounting surface (DIN rail or board)
2. Label driver: "X-AXIS", "Y-AXIS", or "Z-AXIS"
3. Connect power wires:
   - Red 18AWG wire from 24V+ to driver 12V input
   - Black 18AWG wire from 24V- to driver GND input
4. Connect motor wires:
   - Identify motor power wires (typically 2 of 6 in connector)
   - Connect to OUT1 and OUT2 on driver
   - Note: Polarity can be reversed later if direction is wrong
5. Connect control wires:
   - Use color-coded Dupont wires
   - Connect ENA to PWM pin
   - Connect IN1 and IN2 to digital pins
   - Connect driver GND to Arduino GND

**Wire Color Coding Suggestion:**
- Red: Power positive
- Black: Ground
- Yellow: PWM/Enable signals
- Green: Direction 1
- Blue: Direction 2

### Step 5: Relay Module Connection

1. **Mount relay module** near claw mechanism
2. **Connect control wires**:
   - VCC → Arduino 5V
   - GND → Arduino GND
   - IN → Arduino Pin 2
3. **Connect claw power circuit**:
   - Identify claw power wires (from 4 or 6-pin connector)
   - Connect one wire to relay COM terminal
   - Connect other wire to relay NO terminal
   - When relay activates, circuit closes, claw grips

### Step 6: Prize Sensor Installation (Optional)

**IR Sensor Installation:**
1. Mount sensor on claw assembly
   - Position to detect prize when gripped
   - Typical distance: 2-4 inches from claw center
2. Run sensor wires to Arduino
3. Connect: Brown→5V, Blue→GND, Black→A5
4. Adjust sensor sensitivity with potentiometer
5. Test: Place object in range, LED should light

**Microswitch Installation:**
1. Mount switch on claw finger
   - Position to close when claw grips
   - Use bracket or adhesive
2. Run switch wires to Arduino
3. Connect: COM→5V, NO→A5
4. Test: Manually close claw, switch should click

### Step 7: Audio Installation (Optional)

1. **Connect passive buzzer**:
   - Red wire → Arduino Pin 1 (TX)
   - Black wire → Arduino GND
2. **Secure buzzer** to prevent movement
3. **Note:** Pin 1 is shared with serial TX
   - Serial debugging will make buzzer beep
   - Disconnect buzzer when uploading code

### Step 8: Cable Management

1. **Group wires by function**:
   - Power wires together
   - Motor control wires together
   - Sensor wires together
2. **Use cable ties** every 6-8 inches
3. **Label all connections** at both ends
4. **Secure loose wires** away from moving parts
5. **Check for pinch points** in crane movement

### Step 9: Initial Power-On

**⚠️ Safety Check Before Power-On:**

□ All connections double-checked  
□ No loose wires touching  
□ Buck converter verified at 5V  
□ Emergency stop accessible  
□ Motors free to move  
□ Claw area clear  

**Power-On Sequence:**

1. Ensure Arduino is disconnected
2. Connect 24V power supply to mains
3. Verify buck converter shows 5V output
4. Connect Arduino power (from buck converter)
5. Arduino should boot, display should show boot screen
6. Watch for error messages
7. Enter operator menu and run diagnostics

### Step 10: Initial Calibration

1. **Motor Direction Check**:
   - Enter Test Mode
   - Test X-axis: LEFT button should move left
   - Test Y-axis: UP button should move forward
   - Test Z-axis: UP button should move up
   - If any direction wrong, swap IN1/IN2 wires

2. **Motor Speed Check**:
   - Test all axes at normal speed
   - Adjust `motorSpeedNormal` if too fast/slow
   - Test slow speed for precision
   - Adjust `motorSpeedSlow` if needed

3. **Claw Test**:
   - Enter Test Mode → Claw Test
   - Press RIGHT to activate
   - Claw should close
   - Press LEFT to release
   - Adjust timing in settings if needed

4. **Sensor Test** (if installed):
   - Enter Test Mode → Sensor Test
   - Place object in sensor range
   - Display should show "YES"
   - Remove object, should show "NO"

5. **Home Position**:
   - Manually move crane to desired home position
   - Note position values
   - Enter operator menu → Home Position
   - Set custom home if needed

## 2.5 INITIAL CONFIGURATION

### First-Time Setup Wizard

After installation, follow these steps for initial configuration:

1. **Power on system**
   - System boots to "INSERT COIN" screen
   
2. **Enter Operator Menu**
   - Hold SELECT button for 3 seconds
   - Display shows "Operator Mode"

3. **Select Crane Style**
   - Navigate to "Crane Style"
   - Choose appropriate style for your prizes:
     - PREMIUM: Licensed plush, expensive items
     - PLUSH: Standard toys (most common)
     - PROMO: Events, high win rate
     - CANDY: Small items, precision needed
     - LIMITED: Electronics, progressive jackpot
   - Press SELECT to apply

4. **Verify Game Settings**
   - Navigate to "Game Settings"
   - Check play time (default 30s)
   - Check prize profile
   - Check drop behavior

5. **Test System**
   - Navigate to "Diagnostics"
   - Press SELECT to run full diagnostic
   - Verify all 12 tests pass
   - Address any failures

6. **Configure Payout**
   - Navigate to "Payout Control"
   - Adjust payout percentage for your needs
   - Set strong grab interval
   - Configure progressive (if using LIMITED style)

7. **Exit and Test Play**
   - Exit operator menu
   - Insert coin (press UP button)
   - Play test game
   - Verify all functions work correctly

### Recommended Initial Settings

**For Standard Arcade Operation (PLUSH style):**
- Play Time: 30 seconds
- Payout %: 33%
- Strong Grab Interval: Every 8 plays
- Prize Profile: Medium
- Drop Behavior: Home-Release
- Audio: ON, Volume 70%
- LED: Game-Sync mode

---

# SECTION 3: OPERATION

## 3.1 OPERATOR CONTROLS

### Button Functions

**During Normal Operation:**
- **UP Button**: Simulate coin insert (start game)
- **SELECT Hold (3 sec)**: Enter operator menu

**During Operator Menu:**
- **UP Button**: Navigate up in menus
- **DOWN Button**: Navigate down in menus
- **LEFT Button**: Decrease values
- **RIGHT Button**: Increase values
- **SELECT Button**: Confirm selection / Enter submenu

**During Game Play:**
- **UP Button**: Move crane forward (Y+)
- **DOWN Button**: Move crane backward (Y-)
- **LEFT Button**: Move crane left (X-)
- **RIGHT Button**: Move crane right (X+)
- **SELECT Button**: Drop claw and attempt grab

### Display Information

**Main Screen (Waiting for Coin):**
```
INSERT COIN
Hold SEL=Menu
```

**During Game:**
```
Time:25s
SEL=Drop
```

**Operator Menu:**
```
OPERATOR MENU
>Crane Style
```

**Error Screen:**
```
ERROR:3
Z Motor Stall
```

## 3.2 CRANE STYLE PROFILES

### Profile Comparison

| Setting | Premium | Plush | Promo | Candy | Limited |
|---------|---------|-------|-------|-------|---------|
| **Target Market** | High-end locations | Standard arcade | Events/parties | Precision games | High-value prizes |
| **Payout %** | 20% | 33% | 50% | 40% | 15% |
| **Play Time** | 25s | 30s | 45s | 35s | 20s |
| **Strong Grab** | Every 15 | Every 8 | Every 3 | Every 6 | Every 25 |
| **Hang Time** | 500ms | 300ms | 200ms | 500ms | 800ms |
| **Grab Time** | 1800ms | 2000ms | 2500ms | 1200ms | 2200ms |
| **Drop Method** | Home-Lower | Home-Release | Home-Release | Home-Lower | Home-Lower |
| **Mercy Rule** | 8 losses | 5 losses | 3 losses | 4 losses | 10 losses |
| **Progressive** | No | No | No | No | Yes |

### When to Use Each Profile

**PREMIUM Style:**
- Licensed character plush (Disney, Pokemon, etc.)
- Expensive merchandise ($20-50 value)
- High-end locations (malls, resorts)
- Tight payout protects high prize cost
- Longer grab time for quality win experience

**PLUSH Style (Most Common):**
- Standard plush toys ($5-15 value)
- General arcade operation
- Balanced gameplay and earnings
- Default recommended setting
- Suitable for 80% of crane operations

**PROMO Style:**
- Corporate events and parties
- Trade shows and exhibitions
- Promotional campaigns
- Branded merchandise giveaways
- High win rate attracts attention
- Extended play time for engagement

**CANDY Style:**
- Small gift card boxes
- Bulk candy with modified claw
- Precision items (keychains, figures)
- Requires careful positioning
- Quick grab for small items
- Lower prize to reduce jams

**LIMITED Style:**
- Electronics (headphones, controllers)
- High-value items ($50-200)
- Gift cards ($25-100)
- One-of-a-kind prizes
- Progressive jackpot accumulation
- Very tight payout with big wins

## 3.3 GAME SETTINGS

### Play Time Configuration
- **Range**: 15-120 seconds
- **Recommended**: 30 seconds
- **Considerations**:
  - Longer time = more skilled play possible
  - Shorter time = more plays per hour
  - Location traffic affects optimal time

### Prize Profile Settings

**Light (Profile 0):**
- Small plush, lightweight items
- Weak grip: 400ms hold
- Strong grip: 1500ms hold
- Best for soft, easily gripped prizes

**Medium (Profile 1) - Default:**
- Standard plush toys
- Weak grip: 600ms hold
- Strong grip: 2000ms hold
- All-purpose setting

**Heavy (Profile 2):**
- Dense plush, heavy items
- Weak grip: 800ms hold
- Strong grip: 2500ms hold
- Maximum claw strength

**Premium (Profile 3):**
- Licensed characters, premium toys
- Weak grip: 500ms hold
- Strong grip: 2200ms hold
- Optimized for expensive prizes

### Drop Behavior Options

**Home-Release:**
- Crane returns to home position
- Releases prize at current height
- Fastest method
- Good for plush toys that don't need careful drop
- Prize slides into chute

**Home-Lower:**
- Crane returns to home position
- Lowers to configured height
- Releases prize gently
- Good for fragile items
- Prevents prize damage
- Better prize presentation

**Direct (Future):**
- Drops prize directly into chute
- No return to home
- Fastest possible
- Requires chute under crane position

## 3.4 MENU NAVIGATION GUIDE

### Main Menu Structure

```
OPERATOR MENU
├── Crane Style
│   ├── Premium
│   ├── Plush
│   ├── Promo
│   ├── Candy
│   ├── Limited
│   ├── Custom
│   └── Back
│
├── Game Settings
│   ├── Play Time (15-120s)
│   ├── Prize Type (Light/Med/Heavy/Premium)
│   ├── Drop Method (Release/Lower/Direct)
│   └── Back
│
├── Timing Control
│   ├── Descent Speed (0-100%)
│   ├── Hang Time (0-3000ms)
│   ├── Grab Time (500-3000ms)
│   ├── Lift Speed (0-100%)
│   ├── Travel Speed (0-100%)
│   ├── Lower Time (0-3000ms)
│   └── Back
│
├── Home Position
│   ├── Use Custom (YES/NO)
│   ├── Home X (-100 to +100)
│   ├── Home Y (-100 to +100)
│   ├── Home Z (-100 to +100)
│   ├── Test Home
│   └── Back
│
├── Payout Control
│   ├── Payout % (10-70%)
│   ├── Strong Interval (1-30 plays)
│   ├── Max Losses (3-15 plays)
│   ├── Progressive (ON/OFF)
│   ├── Prog Pool (view/reset)
│   └── Back
│
├── Statistics
│   ├── Page 1: Coins, Plays
│   ├── Page 2: Wins, Win%
│   ├── Page 3: Errors, Version
│   └── Exit (SELECT)
│
├── Diagnostics
│   └── Run Full Test (12 steps)
│
├── Test Mode
│   ├── X-Axis Test
│   ├── Y-Axis Test
│   ├── Z-Axis Test
│   ├── Claw Test
│   ├── Sensor Test
│   ├── Audio Test
│   ├── LED Test
│   └── Exit
│
├── Audio/Visual
│   ├── Audio (ON/OFF)
│   ├── Volume (0-100%)
│   ├── Audio Mode (Internal/Melody/Custom)
│   ├── Prize Sensor (ON/OFF)
│   ├── Test Audio
│   └── Back
│
├── LED Effects
│   ├── LED Enable (ON/OFF)
│   ├── LED Mode (Off/Solid/Pulse/Rainbow/Chase/Strobe/GameSync)
│   ├── Brightness (0-100%)
│   ├── Effect Speed (1-10)
│   ├── Test LED
│   └── Back
│
├── Reset Stats
│   └── Confirm Reset (UP=Yes, DOWN=No)
│
└── Exit Menu
```

## 3.5 DAILY OPERATIONS

### Opening Procedures

**Morning Checklist:**
1. □ Power on machine
2. □ Verify display shows correctly
3. □ Check prize inventory
4. □ Refill prizes if needed
5. □ Test coin acceptor (if installed)
6. □ Run one test game
7. □ Clean glass and exterior
8. □ Verify emergency stop works

### During Operation

**Hourly Checks:**
- Monitor for error messages
- Check prize levels
- Observe customer interactions
- Note any unusual sounds/behavior

**Customer Service:**
- Assist customers if needed
- Explain game rules politely
- Handle disputes professionally
- Note customer feedback

### Closing Procedures

**Evening Checklist:**
1. □ Collect coins/bills
2. □ Record revenue
3. □ Check statistics (operator menu)
4. □ Note any issues in log
5. □ Clean glass and surfaces
6. □ Lock cash box
7. □ Power off machine (or leave on)
8. □ Secure location

---

# SECTION 4: CONFIGURATION

## 4.1 TIMING CONTROLS

### Understanding Timing Parameters

**Descent Speed (0-100%)**
- Controls how fast claw descends
- Lower = slower, more dramatic
- Higher = faster, more plays/hour
- Default: 70%
- Recommendation: 60-80% for most applications

**Hang Time (0-3000ms)**
- Pause after descent, before grabbing
- Allows prize to settle
- Longer time = better grip chance
- Shorter time = faster gameplay
- Default: 300ms
- Recommendations:
  - Light prizes: 200ms
  - Medium prizes: 300ms
  - Heavy prizes: 500-800ms

**Grab Time (500-3000ms)**
- How long claw holds closed
- Critical for prize retention!
- Strong grab vs weak grab durations
- Default: 2000ms (strong), 600ms (weak)
- Recommendations:
  - Adjust based on actual win rate
  - Monitor statistics after changes
  - Fine-tune by 100ms increments

**Lift Speed (0-100%)**
- How fast claw lifts after grab
- Lower = smoother, less drop
- Higher = faster gameplay
- Default: 60%
- Recommendation: 50-70%

**Travel Speed (0-100%)**
- Speed returning to home position
- Higher = faster gameplay
- Lower = dramatic presentation
- Default: 80%
- Recommendation: 70-90%

**Lower Time (0-3000ms)**
- Time to lower prize before release
- Only used if DROP_HOME_LOWER enabled
- Longer = gentler prize drop
- Default: 1000ms
- Recommendation: 800-1200ms

### Timing Optimization Guide

**For Maximum Revenue:**
- Faster speeds (80-90%)
- Shorter hang time (200ms)
- More plays per hour

**For Best Player Experience:**
- Medium speeds (60-70%)
- Longer hang time (400ms)
- Better chance at skill-based wins

**For Premium Prizes:**
- Slower speeds (50-60%)
- Longer hang time (800ms)
- Longer grab time
- Dramatic presentation

## 4.2 PAYOUT SETTINGS

### Understanding Payout Percentage

**What is Payout?**
- Target win rate for your crane
- 33% = roughly 1 win per 3 plays
- Adjusted automatically by system
- Not a guarantee, but a target

**How It Works:**
1. System tracks actual win rate
2. If below target, gives more strong grabs
3. If above target, gives more weak grabs
4. Self-balancing over time

**Recommended Payout by Location:**
- **High traffic**: 25-30% (many plays, lower payout)
- **Medium traffic**: 30-35% (balanced)
- **Low traffic**: 35-40% (attract players)
- **Events/parties**: 40-50% (fun experience)

### Strong Grab Interval

**What It Does:**
- Guarantees strong grab every N plays
- Overrides payout calculation
- Creates predictable wins
- Default: Every 8 plays

**Strategy:**
- Lower interval = more wins, lower profit
- Higher interval = fewer wins, higher profit
- Combine with mercy rule for balance

**Recommendations:**
- Premium prizes: 12-15 plays
- Standard prizes: 8-10 plays
- Promo events: 3-5 plays
- Limited prizes: 20-30 plays

### Mercy Rule (Max Consecutive Losses)

**Purpose:**
- Prevents customer frustration
- Guarantees win after X losses
- Improves player perception
- Protects repeat business

**How It Works:**
- System counts consecutive losses
- After max losses, gives strong grab
- Resets counter after any win

**Recommendations:**
- Standard arcade: 5 losses
- High-value prizes: 8-10 losses
- Events/parties: 3 losses
- Consider location demographics

## 4.3 AUDIO/VISUAL SETUP

### Audio Configuration

**Audio Modes:**

**Internal (Mode 0):**
- Simple beeps and tones
- No external files needed
- Always available
- Lowest memory usage

**Melody (Mode 1) - Recommended:**
- Built-in melodies
- Victory fanfare
- Coin insert sound
- Error alerts
- Best for most operations

**Custom (Mode 2) - Future:**
- Load audio from SD card
- Name files: COIN.WAV, WIN.WAV, etc.
- Falls back to internal if not found
- Requires SD card module

**Volume Control:**
- 0% = Muted
- 50% = Normal
- 100% = Maximum
- Adjust based on ambient noise

### LED Effect Modes

**Available Modes:**

**OFF (0):**
- All LEDs disabled
- Saves power
- Use if no LED strip installed

**SOLID (1):**
- Single solid color
- Set once, no animation
- Clean look

**PULSE (2):**
- Breathing effect
- Smooth fade in/out
- Attractive idle animation

**RAINBOW (3):**
- Cycles through all colors
- Continuous animation
- Very eye-catching

**CHASE (4):**
- Running light pattern
- Movement effect
- Dynamic appearance

**STROBE (5):**
- Flashing effect
- Attention-grabbing
- Use sparingly (may cause discomfort)

**GAME-SYNC (6) - Recommended:**
- Changes with game state
- Blue during play
- Yellow when grabbing
- Green on win
- Red on error
- Best player experience

**Effect Speed:**
- 1 = Slowest (200ms update)
- 5 = Medium (100ms update)
- 10 = Fastest (20ms update)

**Brightness:**
- Adjust for ambient lighting
- 50% good for indoor
- 100% for bright locations

## 4.4 HOME POSITION CONFIGURATION

### Why Configure Home Position?

**Default Home:**
- Bottom-left corner (0, 0, 0)
- Standard for most cranes
- Works for typical layouts

**Custom Home Needed When:**
- Drop chute not in bottom-left
- Cabinet modified from standard
- Prize layout requires offset
- Special gameplay requirements

### Setting Custom Home

**Step 1: Determine Position**
1. Enter Test Mode
2. Manually move crane to desired home
3. Note approximate position
4. Estimate offset from default

**Step 2: Configure Values**
1. Enter Operator Menu → Home Position
2. Enable "Use Custom" → YES
3. Adjust Home X (-100 to +100)
   - Negative = left of default
   - Positive = right of default
4. Adjust Home Y (-100 to +100)
   - Negative = back from default
   - Positive = forward from default
5. Adjust Home Z (-100 to +100)
   - Negative = lower than default
   - Positive = higher than default

**Step 3: Test**
1. Press SELECT on "Test Home"
2. Crane should move to new home position
3. Verify position is correct
4. Adjust values if needed
5. Repeat until perfect

**Tips:**
- Start with small adjustments (±10)
- Test after each change
- Document final values
- Take photo of final position

## 4.5 PROGRESSIVE JACKPOT SETUP

### What is Progressive Jackpot?

**Concept:**
- Accumulates money from plays
- Triggers guaranteed win at threshold
- Perfect for expensive prizes
- Increases excitement and anticipation

**How It Works:**
1. Player inserts coin
2. System adds $1 to pool
3. When pool reaches threshold (default $100):
   - Next play gets STRONG GRAB
   - 70% win chance
   - Pool resets to $0 after win

### Enabling Progressive

**Requirements:**
- Usually only for LIMITED style
- High-value prizes ($50-200)
- Electronics, gift cards, etc.
- Not recommended for standard plush

**Configuration:**
1. Set Crane Style to LIMITED
2. Enter Payout Control menu
3. Set Progressive → ON
4. Set Threshold (default 100)
   - Lower threshold = more frequent jackpots
   - Higher threshold = bigger buildup
5. Current pool is displayed
6. Can reset pool manually (LEFT button)

### Progressive Strategy

**For Maximum Excitement:**
- Display current jackpot pool amount
- Announce when jackpot is near
- Promote high-value prizes prominently
- Consider "Jackpot Play" marketing

**Threshold Guidelines:**
- $25 prize = 50 play threshold
- $50 prize = 100 play threshold
- $100 prize = 200 play threshold
- $200 prize = 400 play threshold

**Marketing Ideas:**
- "Current Jackpot: $XX"
- "Next Guaranteed Win at $100"
- "Jackpot Mode Activated!"
- Social media posts about wins

---

# SECTION 5: TROUBLESHOOTING

## 5.1 COMMON ISSUES AND SOLUTIONS

### Display Issues

**Problem: LCD is blank/no backlight**
- Check power connections
- Verify buck converter output is 5V
- Ensure LCD shield is properly seated
- Check contrast potentiometer on LCD

**Problem: Garbled text on LCD**
- Reseat LCD shield connections
- Check for loose pins
- Verify 5V power is stable
- Try uploading code again

**Problem: Buttons not responding**
- Test buttons in Test Mode
- Check analog pin A0 connection
- Verify shield is fully seated
- Try different buttons to isolate issue

### Motor Issues

**Problem: Motor doesn't move**
- Check power supply voltage (24V)
- Verify motor driver power LED is on
- Test with Test Mode
- Check motor driver connections
- Swap motor wires (may be disconnected)
- Verify ENA pin is receiving PWM

**Problem: Motor moves wrong direction**
- Swap IN1 and IN2 wires on driver
- Or reverse motor output wires
- Document change for future reference

**Problem: Motor moves erratically**
- Check for loose connections
- Verify power supply has enough current
- Check for interference on control lines
- Ensure common ground between Arduino and drivers

**Problem: Motor is weak/slow**
- Check voltage at motor during operation
- Verify power supply can deliver rated current
- Check for voltage drop in wiring
- Consider upgrading to IBT-2 drivers
- Increase motorSpeedNormal in settings

### Claw Issues

**Problem: Claw doesn't close**
- Check relay module power (LED should light)
- Verify Pin 2 output (should go HIGH)
- Test relay manually (jumper IN to VCC)
- Check claw circuit continuity
- Verify claw power supply is connected

**Problem: Claw doesn't release**
- Relay may be stuck closed
- Check relay control logic
- Verify Pin 2 returns to LOW
- May need new relay module

**Problem: Claw closes but won't grip**
- Adjust clawGrabTime (increase)
- Check claw mechanism for mechanical issues
- Verify claw is getting full 24V
- Test with different prize sizes

### Sensor Issues

**Problem: Prize sensor not detecting**
- Check sensor power (should have LED)
- Verify wiring connections
- Adjust sensor distance/sensitivity
- Test with different objects
- Try disabling sensor in settings

**Problem: Sensor always triggered**
- Check for obstruction in sensor beam
- Adjust sensitivity potentiometer
- Verify wiring is correct
- Check for short circuits

### Game Logic Issues

**Problem: No strong grabs occurring**
- Check payout settings
- Verify strong grab interval
- Monitor statistics for actual plays
- May need to lower interval

**Problem: Too many wins (losing money)**
- Increase payout percentage
- Increase strong grab interval
- Adjust clawGrabTime (reduce)
- Consider changing crane style

**Problem: Progressive not working**
- Verify Progressive is enabled
- Check crane style is LIMITED
- Verify pool is accumulating
- Check threshold setting

### System Issues

**Problem: System resets randomly**
- Check power supply stability
- Verify buck converter output is steady 5V
- Look for loose connections
- Check for memory errors in Serial Monitor

**Problem: Watchdog error**
- System hung during operation
- Check for infinite loops in custom code
- Verify timeout settings
- May indicate memory issue

**Problem: EEPROM corrupt error**
- Load default config
- Save configuration
- If persists, may need to replace Arduino

## 5.2 ERROR CODES REFERENCE

### Error Code Table

| Code | Error Name | Description | Severity | Action Required |
|------|-----------|-------------|----------|-----------------|
| 0 | ERR_NONE | No error | - | None |
| 1 | ERR_MOTOR_X_STALL | X-axis motor stalled | Medium | Check motor, driver, connections |
| 2 | ERR_MOTOR_Y_STALL | Y-axis motor stalled | Medium | Check motor, driver, connections |
| 3 | ERR_MOTOR_Z_STALL | Z-axis motor stalled | Medium | Check motor, driver, connections |
| 4 | ERR_CLAW_FAIL | Claw activation failed | Medium | Check relay, claw circuit |
| 5 | ERR_EEPROM_CORRUPT | Memory corruption | Critical | Load defaults, save config |
| 6 | ERR_PRIZE_SENSOR | Sensor malfunction | Low | Check sensor, disable if needed |
| 7 | ERR_TIMEOUT | State machine timeout | Medium | Check for stuck states |
| 8 | ERR_POSITION_LOST | Position tracking error | Medium | Recalibrate home position |
| 9 | ERR_MEMORY_LOW | Low RAM warning | High | Restart system, check for leaks |
| 10 | ERR_WATCHDOG | System hung/crashed | Critical | Restart, check for code issues |

### Error Handling Procedures

**When Error Occurs:**
1. System displays error code and message
2. Error is logged to EEPROM
3. Audio alert sounds (if enabled)
4. Game stops safely (all motors off)

**Operator Response:**
1. Note error code and time
2. Press SELECT to acknowledge
3. Press UP to attempt recovery
4. If recovery fails, contact support

**Viewing Error Log:**
1. Enter Operator Menu
2. Navigate to Statistics
3. View error count
4. Last 10 errors stored in EEPROM

## 5.3 DIAGNOSTIC PROCEDURES

### Full System Diagnostic

**Access Diagnostics:**
1. Enter Operator Menu
2. Navigate to "Diagnostics"
3. Press SELECT to start
4. Watch 12 automated tests

**Diagnostic Steps:**
1. **X-Axis Test**: Motor moves briefly
2. **Y-Axis Test**: Motor moves briefly
3. **Z-Axis Test**: Motor moves briefly
4. **Claw Test**: Relay activates, claw closes
5. **Sensor Test**: Displays sensor status
6. **Audio Test**: Plays test melody
7. **LED Test**: Cycles through colors
8. **Memory Check**: Displays free RAM
9. **EEPROM Check**: Validates checksums
10. **Version Check**: Displays firmware version
11. **Style Check**: Confirms crane style
12. **All Tests Complete**: Summary

**Interpreting Results:**
- All tests should pass
- Any failure indicates specific problem
- Note which test fails
- Refer to troubleshooting section

### Manual Component Testing

**Test Individual Motors:**
1. Enter Test Mode
2. Select motor (X, Y, or Z)
3. Use LEFT/RIGHT to move
4. Verify smooth movement
5. Listen for unusual sounds
6. Check for overheating

**Test Claw Circuit:**
1. Enter Test Mode
2. Select "Claw Test"
3. Press RIGHT to activate
4. Listen for relay click
5. Observe claw closing
6. Press LEFT to release
7. Verify full release

**Test Prize Sensor:**
1. Enter Test Mode
2. Select "Sensor Test"
3. Place object in range
4. Display should show "YES"
5. Remove object
6. Display should show "NO"
7. Adjust sensitivity if needed

## 5.4 COMPONENT TESTING

### Multimeter Testing Procedures

**Test Buck Converter Output:**
1. Set multimeter to DC voltage
2. Connect black lead to OUT-
3. Connect red lead to OUT+
4. Should read 5.0V ±0.1V
5. Adjust if necessary

**Test Motor Driver Output:**
1. Set multimeter to DC voltage
2. Disconnect motor wires
3. Activate motor in Test Mode
4. Measure voltage at OUT1 and OUT2
5. Should read close to supply voltage (24V)
6. Swap leads, voltage should reverse

**Test Relay Operation:**
1. Set multimeter to continuity mode
2. With relay OFF: COM to NO should be open
3. With relay ON: COM to NO should beep
4. Verify relay activates when Pin 2 HIGH

**Test Prize Sensor:**
1. Set multimeter to DC voltage
2. Measure sensor output
3. No object: Should read 5V
4. Object present: Should read 0V
5. If using IR, LED should light when triggered

### Voltage Testing Points

**Critical Voltage Points:**
- 24V Supply: 24V ±1V at terminals
- Buck Converter Input: 24V
- Buck Converter Output: 5.0V ±0.1V
- Arduino 5V Pin: 5.0V ±0.1V
- Motor Driver 12V Input: 24V
- Motor Outputs: 0-24V (varies with PWM)

**Testing Under Load:**
1. Measure voltage with motors running
2. Should not drop more than 1-2V
3. If drops significantly, power supply inadequate
4. May need larger supply or shorter wires

---

# SECTION 6: MAINTENANCE

## 6.1 DAILY MAINTENANCE

### Daily Checklist (5 minutes)

**Visual Inspection:**
□ Check for loose wires  
□ Verify all LEDs are functioning  
□ Inspect glass for cleanliness  
□ Check prize condition and placement  
□ Verify emergency stop is accessible  

**Functional Test:**
□ Power on system  
□ Run one test game  
□ Verify all axes move smoothly  
□ Test claw grip and release  
□ Check audio feedback  
□ Verify display is clear  

**Cleaning:**
□ Wipe down glass (inside and outside)  
□ Clean buttons and touchpoints  
□ Remove debris from playfield  
□ Dust exterior cabinet  

**Prize Management:**
□ Refill prizes as needed  
□ Arrange prizes attractively  
□ Remove damaged or won prizes  
□ Ensure prizes are accessible to claw  

## 6.2 WEEKLY MAINTENANCE

### Weekly Checklist (15 minutes)

**Electrical Inspection:**
□ Check all wire connections  
□ Inspect for signs of overheating  
□ Verify no loose terminals  
□ Check cable ties are secure  
□ Test emergency stop function  

**Mechanical Inspection:**
□ Lubricate crane rails (if applicable)  
□ Check belt tension (if belt-driven)  
□ Inspect claw mechanism  
□ Test smooth movement on all axes  
□ Listen for unusual sounds  

**Sensor Maintenance:**
□ Clean prize sensor lens  
□ Verify sensor alignment  
□ Test sensor detection  
□ Adjust sensitivity if needed  

**Statistical Review:**
□ Review statistics in operator menu  
□ Check win percentage  
□ Note any error occurrences  
□ Document revenue  
□ Adjust settings if needed  

**Deep Cleaning:**
□ Clean inside of cabinet  
□ Vacuum dust from electronics  
□ Clean motor vents  
□ Wipe down all surfaces  

## 6.3 MONTHLY MAINTENANCE

### Monthly Checklist (30-45 minutes)

**Full Diagnostic:**
□ Run complete diagnostic test  
□ Verify all 12 tests pass  
□ Address any failures  
□ Document results in log  

**Connection Audit:**
□ Check every wire connection  
□ Tighten any loose screws  
□ Inspect for corrosion  
□ Replace damaged connectors  
□ Label any unlabeled wires  

**Component Inspection:**
□ Inspect motor driver heatsinks  
□ Check relay for wear  
□ Test buck converter output voltage  
□ Verify power supply voltage  
□ Check Arduino for damage  

**Calibration:**
□ Test and recalibrate home position  
□ Verify motor directions  
□ Check claw grip strength  
□ Test sensor accuracy  
□ Adjust timing parameters if needed  

**Software Maintenance:**
□ Backup configuration to paper/file  
□ Review error log  
□ Clear old errors if resolved  
□ Update firmware if available  
□ Document any custom settings  

**Prize Optimization:**
□ Review win rate vs payout setting  
□ Analyze prize popularity  
□ Consider prize rotation  
□ Remove stale/unpopular prizes  
□ Evaluate prize costs vs revenue  

## 6.4 PARTS REPLACEMENT SCHEDULE

### Consumable Parts

**Replace Every 3-6 Months:**
- Claw fingers (if worn)
- Drive belts (if belt-driven)
- Prize sensor (if failing)

**Replace Every 6-12 Months:**
- Relay module (relay has limited cycles)
- Motor driver modules (if showing heat stress)
- Dupont jumper wires (if connections loose)

**Replace Every 1-2 Years:**
- Buck converter
- Arduino board (if errors persist)
- LCD shield
- Power supply

**Replace As Needed:**
- Motors (if stalling frequently)
- Wiring (if damaged)
- Connectors (if loose/corroded)

### Spare Parts Kit Recommended

**Essential Spares:**
- 1x Arduino Uno
- 1x LCD Shield
- 2x Motor Driver modules (same type as installed)
- 2x Relay modules
- 1x Buck converter
- 1x Prize sensor
- Assorted Dupont wires
- Heat shrink tubing
- Cable ties

**Total Cost:** $50-80 USD

---

# SECTION 7: TRAINING GUIDE

## 7.1 BASIC OPERATION TRAINING

### New Operator Training (1 hour)

**Module 1: System Overview (10 min)**
- Explain crane operation basics
- Review safety procedures
- Identify key components
- Emergency stop locations and usage

**Module 2: Daily Operations (15 min)**
- Power on procedures
- Running test games
- Refilling prizes
- Handling customer inquiries
- Revenue collection

**Module 3: Operator Menu (15 min)**
- Accessing operator menu
- Menu navigation basics
- Viewing statistics
- Basic settings changes
- Exiting menu properly

**Module 4: Troubleshooting Basics (10 min)**
- Recognizing common issues
- When to restart system
- When to call for help
- Error code awareness
- Daily checklist review

**Module 5: Hands-On Practice (10 min)**
- Supervised game plays
- Menu navigation practice
- Statistics review
- Prize refill demonstration
- Q&A session

### Training Verification Checklist

After training, operator should demonstrate:
□ Can power on system properly  
□ Can refill prizes correctly  
□ Can access operator menu  
□ Can view statistics  
□ Knows emergency stop location  
□ Can perform daily checklist  
□ Knows who to contact for issues  

## 7.2 ADVANCED CONFIGURATION

### Advanced Operator Training (2 hours)

**Module 1: Crane Style Profiles (20 min)**
- Understanding each profile
- When to use each style
- Applying profiles correctly
- Verifying profile application
- Profile modification considerations

**Module 2: Timing Optimization (30 min)**
- Understanding timing parameters
- Hang time effects on gameplay
- Grab time and win rates
- Speed optimization
- Testing timing changes
- Documenting optimal settings

**Module 3: Payout Management (30 min)**
- Understanding payout percentage
- Strong grab intervals
- Mercy rule configuration
- Progressive jackpot setup
- Monitoring and adjusting
- Revenue optimization strategies

**Module 4: Advanced Troubleshooting (20 min)**
- Running diagnostics
- Interpreting error codes
- Component testing procedures
- When to replace parts
- Preventive maintenance

**Module 5: Statistical Analysis (20 min)**
- Reading statistics accurately
- Identifying trends
- Making data-driven decisions
- Prize cost vs revenue
- Location performance analysis
- Seasonal adjustments

## 7.3 TROUBLESHOOTING TRAINING

### Diagnostic Training (1.5 hours)

**Module 1: Systematic Approach (15 min)**
- Problem identification
- Isolating the issue
- Testing hypotheses
- Documenting findings
- When to seek help

**Module 2: Tool Usage (20 min)**
- Using multimeter safely
- Voltage testing procedures
- Continuity testing
- Current measurement basics
- Interpreting readings

**Module 3: Common Issues (25 min)**
- Motor problems (hands-on)
- Claw issues (hands-on)
- Sensor problems (hands-on)
- Display issues (hands-on)
- Power problems

**Module 4: Component Testing (20 min)**
- Testing motor drivers
- Testing relay operation
- Testing sensors
- Testing motors directly
- Testing power supply

**Module 5: Real-World Scenarios (10 min)**
- Case study 1: Intermittent motor
- Case study 2: Weak claw grip
- Case study 3: False sensor triggers
- Group discussion
- Q&A

## 7.4 REVENUE OPTIMIZATION

### Revenue Maximization Training (1 hour)

**Module 1: Understanding the Numbers (15 min)**
- Cost per play calculation
- Prize cost tracking
- Win rate vs profit
- Break-even analysis
- ROI calculation

**Module 2: Payout Optimization (15 min)**
- Finding optimal payout percentage
- Balancing wins and profit
- Location-specific adjustments
- Testing different settings
- A/B testing methodology

**Module 3: Prize Selection (15 min)**
- Prize cost optimization
- Popular vs profitable prizes
- Seasonal prize rotation
- Licensed vs generic
- Bulk buying strategies

**Module 4: Location Analysis (10 min)**
- High traffic optimization
- Low traffic strategies
- Demographic considerations
- Competition awareness
- Placement within venue

**Module 5: Marketing Tactics (5 min)**
- Visual appeal enhancement
- Promotional strategies
- Social media integration
- Event tie-ins
- Customer retention

---

# SECTION 8: TECHNICAL REFERENCE

## 8.1 PIN ASSIGNMENT TABLE

### Complete Pin Mapping

| Pin | Type | Function | Direction | Notes |
|-----|------|----------|-----------|-------|
| **Digital I/O** |
| D0 | RX | Serial Receive | Input | Reserved for programming |
| D1 | TX | Serial Transmit / Audio | Output | Used for buzzer, conflicts with serial |
| D2 | GPIO | Claw Relay Control | Output | 5V output to relay IN pin |
| D3 | PWM | Motor X Enable (ENA) | Output | PWM for speed control |
| D4 | GPIO | LCD D4 | Output | LCD data line |
| D5 | GPIO | LCD D5 | Output | LCD data line |
| D6 | GPIO | LCD D6 | Output | LCD data line |
| D7 | GPIO | LCD D7 | Output | LCD data line |
| D8 | GPIO | LCD RS | Output | LCD register select |
| D9 | GPIO | LCD Enable | Output | LCD enable |
| D10 | PWM | Motor Z Enable (ENA) | Output | PWM for speed control |
| D11 | PWM | Motor Y Enable (ENA) | Output | PWM for speed control |
| D12 | GPIO | Motor Z IN1 | Output | Direction control |
| D13 | GPIO | Motor Z IN2 | Output | Direction control |
| **Analog I/O** |
| A0 | Analog | LCD Buttons | Input | Analog voltage for button detection |
| A1 | GPIO | Motor X IN1 | Output | Direction control |
| A2 | GPIO | Motor X IN2 | Output | Direction control |
| A3 | GPIO | Motor Y IN1 | Output | Direction control |
| A4 | GPIO | Motor Y IN2 | Output | Direction control |
| A5 | GPIO | Prize Sensor | Input | INPUT_PULLUP mode |
| **Power** |
| VIN | Power | Main Power Input | Input | 7-12V recommended, we use 5V from buck |
| 5V | Power | Regulated 5V Output | Output | Powers sensors and relay |
| 3.3V | Power | 3.3V Regulated | Output | Not used in this design |
| GND | Power | Ground Reference | - | Common ground for all components |

### PWM Pin Details

**PWM-Capable Pins Used:**
- Pin 3: Motor X speed control (490 Hz)
- Pin 10: Motor Z speed control (490 Hz)
- Pin 11: Motor Y speed control (490 Hz)

**PWM Parameters:**
- Frequency: 490 Hz (Arduino default)
- Resolution: 8-bit (0-255)
- 0 = stopped, 255 = full speed

### Analog Button Detection

**A0 Voltage Ranges:**
- No button: >1000 (>4.9V)
- RIGHT: 0-50 (0-0.24V)
- UP: 50-250 (0.24-1.22V)
- DOWN: 250-450 (1.22-2.20V)
- LEFT: 450-650 (2.20-3.18V)
- SELECT: 650-850 (3.18-4.15V)

## 8.2 PARTS LIST WITH LINKS

### Essential Components

**Microcontroller:**
- ELEGOO UNO R3 Board
- Amazon: [Search ELEGOO UNO R3]
- AliExpress: [Arduino Uno R3 ATmega328P]
- Price: $12-18

**Display:**
- LCD1602 Keypad Shield
- Amazon: [LCD Keypad Shield 1602]
- AliExpress: [1602 LCD shield Arduino]
- Price: $8-15

**Motor Drivers (Choose One):**

*Option 1 - Budget:*
- L298N Motor Driver Module (Need 3)
- Amazon: [L298N motor driver]
- AliExpress: [L298N dual H-bridge]
- Price: $5-8 each

*Option 2 - Recommended:*
- IBT-2 H-Bridge Driver (Need 3)
- Amazon: [IBT-2 motor driver 43A]
- AliExpress: [IBT-2 H-bridge]
- Price: $12-18 each

*Option 3 - Professional:*
- Cytron MD30C Motor Driver
- RobotShop: [Cytron MD30C]
- Price: $30-40 each

**Power Management:**
- LM2596 Buck Converter
- Amazon: [LM2596 DC-DC step down]
- AliExpress: [LM2596 adjustable]
- Price: $6-10

- 24V Power Supply (5A minimum)
- Amazon: [24V 5A power supply]
- Price: $20-35

**Relay:**
- 5V Relay Module (Single Channel)
- Amazon: [5V relay module]
- AliExpress: [relay module Arduino]
- Price: $5-10

### Optional Components

**Prize Sensor - IR:**
- E18-D80NK Infrared Sensor
- Amazon: [E18-D80NK IR sensor]
- AliExpress: [infrared proximity sensor]
- Price: $3-8

**Prize Sensor - Switch:**
- Micro Limit Switch with Lever
- Amazon: [micro limit switch]
- Price: $1-3 each

**Audio:**
- Passive Buzzer 5V
- Amazon: [passive buzzer Arduino]
- AliExpress: [5V buzzer]
- Price: $2-5

**Emergency Stop:**
- 22mm Mushroom Emergency Stop Button (NC)
- Amazon: [emergency stop button red]
- Price: $8-15

**LED Strip (Optional):**
- 12V RGB LED Strip (Common Anode)
- Amazon: [12V RGB LED strip]
- Price: $10-20 (per meter)

## 8.3 UPGRADE OPTIONS

### Performance Upgrades

**Motor Driver Upgrade:**
- **From**: L298N (2A, basic)
- **To**: IBT-2 (43A, high current)
- **Benefit**: Handle higher currents, 48V support
- **Cost**: +$30 (for 3 drivers)

**Power Supply Upgrade:**
- **From**: 24V 5A supply
- **To**: 36V 10A or 48V 10A
- **Benefit**: More motor power, faster movement
- **Cost**: +$20-40
- **Note**: Verify motors are rated for higher voltage

**Microcontroller Upgrade:**
- **From**: Arduino Uno (ATmega328P)
- **To**: Arduino Mega 2560
- **Benefit**: More pins, more memory, more features
- **Cost**: +$15-25
- **Note**: Code needs minimal changes for pin assignments

### Feature Upgrades

**SD Card Audio Module:**
- **Component**: SD card breakout board
- **Benefit**: Custom audio files, professional sounds
- **Cost**: $5-10
- **Implementation**: Requires code modification

**Real-Time Clock (RTC):**
- **Component**: DS3231 RTC module
- **Benefit**: Track operation hours, time-based events
- **Cost**: $5-10
- **Implementation**: Add to I2C bus

**WiFi Connectivity:**
- **Component**: ESP8266 or ESP32
- **Benefit**: Remote monitoring, statistics upload
- **Cost**: $10-20
- **Implementation**: Serial communication to Arduino

**Coin Acceptor:**
- **Component**: Programmable coin acceptor
- **Benefit**: Real coin operation instead of button
- **Cost**: $15-30
- **Implementation**: Connect to Arduino input pin

**Ticket Dispenser:**
- **Component**: Arcade ticket dispenser unit
- **Benefit**: Issue tickets instead of prizes
- **Cost**: $50-100
- **Implementation**: Relay control similar to claw

### Expansion Ideas

**Multi-Crane System:**
- Network multiple cranes
- Shared statistics server
- Tournament mode
- Inter-crane progressive jackpot

**Player Tracking:**
- RFID card reader
- Track individual player stats
- Loyalty rewards
- Personalized difficulty

**Mobile App Integration:**
- QR code for stats
- Remote play credits
- Social sharing
- Push notifications

## 8.4 FUTURE EXPANSION IDEAS

### Software Enhancements

**Coming in Future Versions:**

**v4.0 Planned Features:**
- Multi-language support (Spanish, French, Chinese)
- Cloud statistics sync
- Remote configuration via web interface
- Advanced AI-based payout optimization
- Player skill detection
- Automatic difficulty adjustment

**v4.5 Planned Features:**
- Tournament mode
- Time-of-day payout profiles
- Seasonal event modes
- Prize inventory tracking
- Predictive maintenance alerts
- Mobile app connectivity

### Hardware Expansion Concepts

**Limit Switch Integration:**
- Add limit switches to all axes
- Precise position feedback
- Safer operation
- Auto-calibration on startup

**Encoder Integration:**
- Add rotary encoders to motors
- Exact position tracking
- Closed-loop control
- Consistent gameplay

**Load Cell in Claw:**
- Measure actual grip force
- Detect prize weight
- Adjust grip strength automatically
- Verify win conditions

**Camera System:**
- Overhead camera
- AI prize detection
- Automatic claw positioning
- Win verification

---

# SECTION 9: BUSINESS OPTIMIZATION

## 9.1 PROVEN MONEY-MAKING CONCEPTS

### Unique Gameplay Modes

**1. "Skill Shot Sunday"**
- One day per week
- Higher payout (40-50%)
- Promotes skill-based play
- Builds reputation
- Attracts repeat customers

**Implementation:**
- Use PROMO style on Sundays
- Advertise as "Easy Win Day"
- Track effectiveness

**2. "Progressive Prize Pool"**
- Display accumulating jackpot
- High-value single prize
- Builds excitement
- Creates urgency

**Implementation:**
- Use LIMITED style
- Display current pool on sign
- Update frequently
- Announce wins on social media

**3. "Two-Claw Technique"**
- Allow second attempt if first fails
- Small additional fee
- Higher perceived value
- Actually increases revenue

**Implementation:**
- Manual feature (not automated)
- Operator grants second try
- $1 extra for second attempt
- Only after first attempt fails

**4. "Time Attack Mode"**
- Limited time event (1-2 hours)
- Rapid play, lower price
- Volume play strategy
- Creates urgency

**Implementation:**
- Reduce play time to 20s
- Reduce price by 25%
- Announce time windows
- Track plays per hour

**5. "Mystery Prize Friday"**
- Special prizes on Fridays only
- Higher value items
- Unknown prize under cover
- Builds weekly traffic

**Implementation:**
- Add premium prizes on Friday
- Cover one with fabric/box
- Reveal when won
- Social media documentation

### Rarely Seen But Effective

**6. "Trade-In Program"**
- Accept old prizes for discount
- Builds goodwill
- Controls prize circulation
- Repeat business

**Implementation:**
- Accept returned prizes
- Give $0.50-1.00 credit
- Refurbish and reuse
- Track popular prizes

**7. "Team Play Mode"**
- Two players cooperate
- One controls X/Y, other drops
- Social experience
- Higher engagement

**Implementation:**
- Manual feature
- Operator enables
- Charge 1.5x price
- Great for couples/friends

**8. "Guaranteed Win Every 100th Play"**
- Display digital counter
- Builds anticipation
- Self-promoting
- Controllable cost

**Implementation:**
- Manual counter display
- Operator grants strong grab
- Reset counter after win
- Adjust threshold for profitability

**9. "Photo Contest"**
- Players post wins on social media
- Best photo wins bonus prize
- Free advertising
- Community building

**Implementation:**
- Post contest rules
- Weekly winner
- Display winners at machine
- Build social following

**10. "Birthday Special"**
- Prove birthday for bonus play
- Creates special memories
- Word-of-mouth marketing
- Builds goodwill

**Implementation:**
- Show ID for birthday
- Free play or discount
- Birthday crown photo
- Social media post

### Revenue Optimization Strategies

**Dynamic Pricing:**
- Peak hours: Standard price
- Off-peak: Discounted plays
- Happy hour specials
- Maximize plays during slow periods

**Prize Rotation:**
- Weekly prize changes
- Seasonal themes
- Trending items
- Keep machine fresh

**Bulk Play Discounts:**
- 3 plays for $5 (vs $2 each)
- 5 plays for $8
- Encourages multiple attempts
- Higher revenue per customer

**Location-Specific Optimization:**
- Mall: Focus on popular characters
- Arcade: Skill-based rewards
- Family venue: Kid-friendly prizes
- Bar/Restaurant: Adult novelties

## 9.2 PAYOUT TABLES

### Recommended Payout Settings by Location

| Location Type | Payout % | Strong Interval | Play Time | Expected Plays/Hour | Notes |
|--------------|----------|-----------------|-----------|---------------------|-------|
| **Mall - High Traffic** | 25-28% | 12 plays | 25s | 80-100 | Tight payout, high volume |
| **Mall - Medium Traffic** | 30-33% | 8 plays | 30s | 60-80 | Balanced |
| **Arcade - Skilled Players** | 28-32% | 10 plays | 30s | 70-90 | Slightly lower for skilled |
| **Arcade - Family** | 33-35% | 8 plays | 30s | 60-80 | More wins for satisfaction |
| **Restaurant/Bar** | 30-35% | 8 plays | 30s | 30-50 | Lower volume |
| **Family Entertainment** | 35-40% | 6 plays | 35s | 50-70 | Higher wins for experience |
| **Events/Parties** | 45-50% | 3 plays | 45s | 40-60 | Maximum fun |
| **Tradeshow Promo** | 50-60% | 2-3 plays | 45-60s | Variable | Brand awareness focus |

### Prize Cost vs Payout Analysis

**Example: $1.00 per play, 30% payout target**

| Prize Cost | Plays to Break Even | Recommended Payout % | Expected Profit Margin |
|------------|---------------------|---------------------|------------------------|
| $2.00 | 2 plays | 40-50% | 15-25% |
| $3.00 | 3 plays | 35-40% | 20-30% |
| $4.00 | 4 plays | 30-35% | 25-35% |
| $5.00 | 5 plays | 25-30% | 30-40% |
| $7.50 | 7.5 plays | 20-25% | 35-45% |
| $10.00 | 10 plays | 15-20% | 40-50% |
| $15.00 | 15 plays | 12-15% | 45-55% |
| $20.00+ | 20+ plays | 10-12% | 50%+ |

**Profit Calculation Formula:**
```
Profit per Win = (Plays to Win × Price per Play) - Prize Cost
Profit Margin = (Profit per Win) / (Plays to Win × Price per Play) × 100%

Example: 
- Price: $1.00
- Payout: 30% (1 win per 3.3 plays avg)
- Prize Cost: $4.00

Profit = (3.3 × $1.00) - $4.00 = $3.30 - $4.00 = -$0.70
```

*Note: This would be unprofitable! Adjust payout to 25% or lower prize cost.*

### Seasonal Payout Adjustments

**Holiday Seasons (Higher Traffic):**
- Reduce payout by 3-5%
- Increase play prices slightly
- Premium holiday prizes
- More revenue opportunity

**Off-Season (Lower Traffic):**
- Increase payout by 3-5%
- Special promotions
- Bundle deals
- Maintain customer base

**Back-to-School:**
- Kid-friendly prizes
- Medium payout (33-35%)
- After-school specials
- Appeal to younger demographics

**Summer Vacation:**
- Extended play times
- Family-oriented prizes
- Medium-high payout (35-38%)
- Volume strategy

## 9.3 LOCATION ANALYSIS

### Site Selection Criteria

**Ideal Locations:**
✓ High foot traffic (500+ daily)  
✓ Young adult demographic (18-35)  
✓ Family-friendly environment  
✓ Good visibility within venue  
✓ Near entrance or checkout  
✓ Adequate space for queuing  
✓ Reliable electrical power  
✓ Low competition  

**Locations to Avoid:**
✗ Very low traffic (<100 daily)  
✗ Senior-focused venues  
✗ Poor visibility or back corners  
✗ High competition (3+ cranes nearby)  
✗ Unreliable power or climate  
✗ High rent vs traffic ratio  

### Performance Benchmarks

**Excellent Performance:**
- 100+ plays per day
- 30-35% actual win rate
- $80-120 daily revenue
- ROI < 6 months

**Good Performance:**
- 50-100 plays per day
- 28-33% actual win rate
- $40-80 daily revenue
- ROI 6-12 months

**Fair Performance:**
- 25-50 plays per day
- 25-30% actual win rate
- $20-40 daily revenue
- ROI 12-18 months

**Poor Performance:**
- <25 plays per day
- <25% or >40% win rate
- <$20 daily revenue
- ROI >18 months
- Consider relocation

### Competitive Analysis

**When Multiple Cranes Present:**
1. Differentiate by prize selection
2. Offer unique gameplay modes
3. Better machine condition
4. Superior customer service
5. Competitive pricing
6. Better location within venue

**Market Saturation Indicators:**
- 1 crane per 500 patrons: Good
- 1 crane per 200-500 patrons: Saturated
- 1 crane per <200 patrons: Oversaturated

## 9.4 PRIZE SELECTION GUIDE

### Prize Categories

**Character-Licensed Prizes:**
- **Pros**: High demand, brand recognition
- **Cons**: Higher cost, licensing restrictions
- **Cost**: $5-15 each
- **Best for**: Mall locations, family venues
- **Examples**: Disney, Pokemon, Marvel, Anime

**Generic Plush Toys:**
- **Pros**: Low cost, easy to source
- **Cons**: Less appealing, commodity
- **Cost**: $2-5 each
- **Best for**: High-volume locations
- **Examples**: Bears, unicorns, generic animals

**Electronics/Accessories:**
- **Pros**: High perceived value
- **Cons**: High cost, breakage risk
- **Cost**: $10-50 each
- **Best for**: Adult demographics, progressive mode
- **Examples**: Headphones, phone accessories, small gadgets

**Gift Cards:**
- **Pros**: Universal appeal, no storage
- **Cons**: Requires security, limited excitement
- **Cost**: Variable ($5-25)
- **Best for**: Adult locations, premium machines
- **Examples**: Amazon, iTunes, restaurant chains

**Seasonal/Novelty:**
- **Pros**: Timely appeal, differentiation
- **Cons**: Short shelf life
- **Cost**: $3-10 each
- **Best for**: Event-driven locations
- **Examples**: Holiday themes, trending characters

### Prize Sourcing

**Wholesale Suppliers:**
- Alibaba/AliExpress (bulk orders)
- Alibaba minimum: 50-100 units
- 4-6 week shipping
- $2-5 per plush delivered

**Domestic Wholesalers:**
- Faster shipping (1-2 weeks)
- Higher prices ($4-8 per plush)
- Better quality control
- Returns/exchanges easier

**Liquidation/Closeout:**
- Heavily discounted (50-80% off)
- Mixed quality
- Limited selection
- Excellent margins when found

### Prize Mix Strategy

**Recommended Mix for Standard Arcade:**
- 60% Generic plush ($3-5 cost)
- 25% Licensed characters ($5-10 cost)
- 10% Premium items ($10-20 cost)
- 5% Novelty/seasonal

**High-Traffic Mall:**
- 40% Generic plush
- 50% Licensed characters
- 10% Premium items

**Adult Venue (Bar/Restaurant):**
- 30% Generic plush
- 20% Licensed characters
- 40% Electronics/accessories
- 10% Gift cards

### Prize Presentation Tips

**Visual Appeal:**
- Arrange prizes by color/type
- Feature premium prizes prominently
- Keep machine full (impression of abundance)
- Rotate prize positions weekly
- Front-face character plush
- Clean and fluff prizes daily

**Prize Psychology:**
- Place "attractor prizes" at eye level
- Position licensed items near glass
- Mix sizes for visual interest
- Create "treasure hunt" feeling
- Use contrasting colors
- Avoid overcrowding

---

# SECTION 10: APPENDICES

## 10.1 BLANK LOG SHEETS

### Daily Operations Log

**Date:** ________________  **Operator:** ____________________  **Location:** ____________________

#### Opening Checklist (Start of Day)
| Task | Time | Initials | Notes |
|------|------|----------|-------|
| Power on system | | | |
| Display check | | | |
| Prize refill | | | |
| Test game | | | |
| Clean glass | | | |
| Emergency stop test | | | |

#### Coin Collection Record
| Time | Amount Collected | Bills | Coins | Total | Initials |
|------|-----------------|-------|-------|-------|----------|
| | | | | | |
| | | | | | |
| | | | | | |

**Daily Total: $_______**

#### Statistics Snapshot
| Metric | Opening | Closing | Change |
|--------|---------|---------|--------|
| Total Coins | | | |
| Total Plays | | | |
| Total Wins | | | |
| Win Percentage | | | |

#### Issues/Notes
| Time | Issue Description | Resolution | Initials |
|------|------------------|------------|----------|
| | | | |
| | | | |
| | | | |

#### Closing Checklist (End of Day)
| Task | Time | Initials | Notes |
|------|------|----------|-------|
| Collect revenue | | | |
| Record statistics | | | |
| Clean machine | | | |
| Note issues | | | |
| Lock cash box | | | |
| Power off (if needed) | | | |

---

### Weekly Maintenance Log

**Week Of:** ________________  **Maintained By:** ____________________

#### Weekly Tasks
| Task | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Notes |
|------|-----|-----|-----|-----|-----|-----|-----|-------|
| Check connections | | | | | | | | |
| Clean sensors | | | | | | | | |
| Test all axes | | | | | | | | |
| Lubricate rails | | | | | | | | |
| Cable tie check | | | | | | | | |
| Deep clean | | | | | | | | |

#### Weekly Statistics Summary
| Metric | Value | vs Last Week | Notes |
|--------|-------|--------------|-------|
| Total Plays | | | |
| Total Wins | | | |
| Win % | | | |
| Revenue | | | |
| Avg $/Day | | | |
| Error Count | | | |

#### Prize Inventory
| Prize Type | Count Start | Added | Removed | Count End |
|------------|-------------|-------|---------|-----------|
| | | | | |
| | | | | |
| | | | | |

#### Issues This Week
| Date | Issue | Action Taken | Resolved? |
|------|-------|--------------|-----------|
| | | | |
| | | | |
| | | | |

---

### Monthly Service Record

**Month:** ________________  **Year:** ______ **Technician:** ____________________

#### Monthly Diagnostic Results
| Test | Result | Notes |
|------|--------|-------|
| X-Axis Motor | □ Pass  □ Fail | |
| Y-Axis Motor | □ Pass  □ Fail | |
| Z-Axis Motor | □ Pass  □ Fail | |
| Claw Mechanism | □ Pass  □ Fail | |
| Prize Sensor | □ Pass  □ Fail | |
| Audio System | □ Pass  □ Fail | |
| LED System | □ Pass  □ Fail | |
| Memory Check | □ Pass  □ Fail | |
| EEPROM Validation | □ Pass  □ Fail | |
| Power Supply | □ Pass  □ Fail | |
| Buck Converter | □ Pass  □ Fail | |
| Emergency Stop | □ Pass  □ Fail | |

#### Voltage Measurements
| Point | Expected | Measured | Status |
|-------|----------|----------|--------|
| Power Supply Out | 24V | | |
| Buck Converter Out | 5V | | |
| Arduino 5V Pin | 5V | | |
| Motor X Driver | 24V | | |
| Motor Y Driver | 24V | | |
| Motor Z Driver | 24V | | |

#### Component Condition Assessment
| Component | Condition | Replacement Needed? | Notes |
|-----------|-----------|---------------------|-------|
| Arduino Board | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| LCD Shield | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Motor Driver X | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Motor Driver Y | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Motor Driver Z | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Relay Module | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Prize Sensor | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Buck Converter | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Power Supply | □ Good  □ Fair  □ Poor | □ Yes  □ No | |
| Wiring/Cables | □ Good  □ Fair  □ Poor | □ Yes  □ No | |

#### Calibration Record
| Parameter | Previous | New | Notes |
|-----------|----------|-----|-------|
| Home Position X | | | |
| Home Position Y | | | |
| Home Position Z | | | |
| Motor Speed Normal | | | |
| Motor Speed Slow | | | |
| Sensor Sensitivity | | | |

#### Monthly Statistics
| Metric | This Month | Last Month | Change |
|--------|------------|------------|--------|
| Total Plays | | | |
| Total Wins | | | |
| Win % | | | |
| Total Revenue | | | |
| Avg Revenue/Day | | | |
| Error Count | | | |
| Most Common Error | | | |

#### Parts Replaced This Month
| Date | Part Description | Reason | Cost |
|------|-----------------|--------|------|
| | | | |
| | | | |
| | | | |

**Total Parts Cost: $_______**

#### Recommendations for Next Month:
_________________________________________________________________________
_________________________________________________________________________
_________________________________________________________________________

**Technician Signature:** ____________________  **Date:** ________________

---

### Error Log

**Machine ID:** ________________  **Location:** ____________________

| Date/Time | Error Code | Error Description | Game State | Action Taken | Resolved? | Initials |
|-----------|------------|-------------------|------------|--------------|-----------|----------|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Error Code Reference:**
- 1: X-Axis Motor Stall
- 2: Y-Axis Motor Stall
- 3: Z-Axis Motor Stall
- 4: Claw Activation Failure
- 5: EEPROM Corruption
- 6: Prize Sensor Malfunction
- 7: State Timeout
- 8: Position Lost
- 9: Low Memory Warning
- 10: Watchdog Timeout

---

## 10.2 MACHINE INFORMATION SHEET

**CRANE CONTROL SYSTEM - MACHINE INFORMATION**

Complete this form and keep with your service manual for reference.

### Basic Information
**Machine ID/Serial Number:** ____________________  
**Installation Date:** ____________________  
**Location Name:** ____________________  
**Location Address:** ____________________  
________________________________________________________  
**Venue Contact:** ____________________  
**Venue Phone:** ____________________  

### Hardware Configuration
**Arduino Model:** □ Uno  □ Mega  □ Other: ____________  
**LCD Shield Model:** ____________________  
**Motor Driver Type:** □ L298N  □ IBT-2  □ Cytron MD30C  □ Other: ____________  
**Power Supply:** ______V, ______A, Model: ____________________  
**Prize Sensor:** □ IR  □ Microswitch  □ None  
**Audio:** □ Buzzer  □ Speaker  □ None  
**LED Strip:** □ Yes  □ No,  Type: ____________________  
**Emergency Stop:** □ Yes  □ No  

### Motor Information
**Motor Model:** ____________________  
**Motor Voltage:** ______V  
**Motor Current:** ______A per axis  
**Motor Type:** □ IG30 Gearmotor  □ Other: ____________  
**Number of Wires per Motor:** ______  

### Initial Configuration (Record After Setup)
**Crane Style:** □ Premium  □ Plush  □ Promo  □ Candy  □ Limited  □ Custom  
**Payout Percentage:** ______%  
**Play Time:** ______ seconds  
**Strong Grab Interval:** Every ______ plays  
**Home Position:** X: ______, Y: ______, Z: ______  
**Custom Home:** □ Yes  □ No  

**Current Settings (Update as changed):**
```
Motor Speed Normal: ______
Motor Speed Slow: ______
Descent Speed: ______%
Hang Time: ______ms
Grab Time: ______ms
Lift Speed: ______%
Travel Speed: ______%
Lower Time: ______ms
Claw Strength Weak: ______ms
Claw Strength Strong: ______ms
```

### Wiring Documentation
**Motor X Color Codes