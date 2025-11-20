# Mission Command - Professional UI Design Specification

## Design Philosophy
Mission Command should look like **professional tactical software** that happens to be for families. Think Call of Duty's menu system meets NASA mission control - serious, polished, and clean. This is NOT a cartoonish kids app. Modern children (8+) are used to AAA game interfaces and expect the same quality.

---

## Color Palette

### Core Colors
```css
--background-primary: #000000;          /* Pure black */
--background-secondary: #0a0a0a;        /* Subtle card background */
--background-tertiary: #1a1a1a;         /* Hover states */

--border-primary: #333333;              /* Default borders */
--border-active: #00ff88;               /* Active/hover borders (neon green) */
--border-subtle: #222222;               /* Very subtle dividers */

--text-primary: #ffffff;                /* Main text */
--text-secondary: #999999;              /* Secondary text, labels */
--text-muted: #666666;                  /* Timestamps, metadata */

--accent-primary: #00ff88;              /* Primary actions, success (neon green) */
--accent-secondary: #ffcc00;            /* Warnings, points, highlights (gold) */
--accent-danger: #ff3b3b;               /* Errors, overdue, critical (red) */
--accent-info: #00d4ff;                 /* Info, links (cyan blue) */
```

### Status Colors
```css
--status-ready: #00ff88;                /* Mission ready to start */
--status-active: #00d4ff;               /* In progress */
--status-verification: #ffcc00;         /* Awaiting parent verification */
--status-complete: #00ff88;             /* Mission accomplished */
--status-overdue: #ff3b3b;              /* Past deadline */
```

### Difficulty/Threat Level Colors
```css
--difficulty-easy: #00ff88;             /* Easy missions */
--difficulty-medium: #ffcc00;           /* Medium missions */
--difficulty-hard: #ff3b3b;             /* Hard missions */
```

---

## Typography

### Fonts
```css
/* Primary font for data/mission names */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Secondary font for headings (if needed) */
font-family: 'Inter', 'Roboto', sans-serif;

/* All mission titles, operation names, and data should be monospace */
/* Navigation and UI labels can be sans-serif */
```

### Font Sizes & Weights
```css
--font-size-xs: 11px;     /* Timestamps, metadata */
--font-size-sm: 13px;     /* Secondary text */
--font-size-base: 15px;   /* Body text */
--font-size-lg: 18px;     /* Section headers */
--font-size-xl: 24px;     /* Page titles */
--font-size-2xl: 32px;    /* Large numbers (stats) */
--font-size-3xl: 48px;    /* Hero numbers */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

### Text Styles
- **Mission titles:** ALL CAPS, white, font-weight: 700
- **Status badges:** ALL CAPS, small (11px), bold
- **Section headers:** ALL CAPS, secondary text color
- **Body text:** Sentence case, 15px
- **Timestamps:** Small (11px), muted color

---

## Layout Structure

### Header (Top Bar)
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔺 MISSION COMMAND               [Sarah Williams] [COLONEL] [SN] │
│    TACTICAL OPERATIONS SYSTEM       245 POINTS  FIELD AGENT      │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: 60px
- Background: #000000
- Bottom border: 1px solid #333333
- Optional top bar above header: Red (#ff3b3b) with white text "CLASSIFIED - MISSION COMMAND SYSTEM" (15px high)

**Header Elements:**
- Left: Logo + app name (monospace, bold)
- Right: User name, rank badge, points display, profile icon
- Font size: 14px
- Text color: #ffffff

### Sidebar Navigation
```
┌──────────────────┐
│ NAVIGATION       │
├──────────────────┤
│ • COMMAND CENTER │ ← Active (green border)
│ • ACTIVE MISSIONS│
│ • PERSONNEL      │
│ • INTEL REPORTS  │
│ • OPERATIONS     │
├──────────────────┤
│ SYSTEM           │
├──────────────────┤
│ • SETTINGS       │
│ • LOGOUT         │
├──────────────────┤
│ CURRENT STATUS   │
│ Active: 12       │
│ Personnel: 24    │
│ Threat: MEDIUM   │
└──────────────────┘
```

**Specifications:**
- Width: 240px
- Background: #000000
- Right border: 1px solid #333333
- Padding: 20px
- Font: Monospace, 13px

**Navigation Items:**
- Default state: #999999 text
- Hover: #ffffff text, left border (#00ff88, 3px)
- Active: #ffffff text, background #1a1a1a, left border (#00ff88, 3px)
- Icon + text layout
- 12px margin between items

### Main Content Area
- Background: #000000
- Padding: 40px
- Max width: 1400px (centered)

---

## Components

### Stat Cards (Dashboard Overview)
```
┌────────────────────────────────┐
│ ACTIVE MISSIONS                │
│                                │
│        12                      │
│                                │
│ Awaiting completion            │
└────────────────────────────────┘
```

**Specifications:**
- Background: #0a0a0a
- Border: 1px solid #333333
- Border radius: 0px (sharp corners)
- Padding: 24px
- Text-align: center
- Hover: border color → #00ff88

**Elements:**
- Label (top): 11px, #999999, ALL CAPS
- Number (center): 48px, #ffffff, bold
- Subtext (bottom): 13px, #666666

### Mission Cards
```
┌────────────────────────────────────────────────────────────────┐
│ Operation Silent Storm                      [ACTIVE] [HIGH]    │
├────────────────────────────────────────────────────────────────┤
│ Objectives Progress                                      5/12  │
│ ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░                     │
│                                                                │
│ Target Date: 30 NOV 2025 17:00                                │
└────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: #0a0a0a
- Border: 1px solid #333333
- Padding: 20px
- Margin bottom: 16px
- Hover: border color → #00ff88, subtle shadow

**Header:**
- Mission title: 16px, bold, white, ALL CAPS
- Status badges: inline, 11px, ALL CAPS, rounded corners (4px)
  - ACTIVE: bg #00d4ff, text black
  - HIGH: bg #ffcc00, text black
  - COMPLETE: bg #00ff88, text black
  - OVERDUE: bg #ff3b3b, text white

**Progress Bar:**
- Height: 8px
- Background: #222222
- Fill: #ffffff
- Show fraction: "5/12" aligned right

**Metadata:**
- Font size: 13px
- Color: #999999
- Monospace font

### Status Badges
**Small Inline Badges:**
```css
padding: 4px 8px;
font-size: 11px;
font-weight: 700;
text-transform: uppercase;
border-radius: 4px;
display: inline-block;
margin-left: 8px;
```

**Colors by Status:**
- READY: bg #00ff88, text #000000
- ACTIVE: bg #00d4ff, text #000000
- IN PROGRESS: bg #00d4ff, text #000000
- AWAITING VERIFICATION: bg #ffcc00, text #000000
- MISSION ACCOMPLISHED: bg #00ff88, text #000000
- OVERDUE: bg #ff3b3b, text #ffffff
- EASY: bg #00ff88, text #000000
- MEDIUM: bg #ffcc00, text #000000
- HARD: bg #ff3b3b, text #ffffff

### Buttons

**Primary Button:**
```css
background: #00ff88;
color: #000000;
font-size: 14px;
font-weight: 700;
text-transform: uppercase;
padding: 12px 24px;
border: none;
border-radius: 0px;
cursor: pointer;
font-family: 'JetBrains Mono', monospace;

/* Hover */
background: #00ff88;
box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
```

**Secondary Button:**
```css
background: transparent;
color: #ffffff;
border: 1px solid #333333;
padding: 12px 24px;
font-size: 14px;
font-weight: 700;
text-transform: uppercase;

/* Hover */
border-color: #00ff88;
color: #00ff88;
```

**Danger Button:**
```css
background: #ff3b3b;
color: #ffffff;
padding: 12px 24px;
font-size: 14px;
font-weight: 700;
text-transform: uppercase;

/* Hover */
background: #ff5252;
```

### Progress Bars

**Standard Progress Bar:**
```css
width: 100%;
height: 8px;
background: #222222;
border-radius: 0px;
overflow: hidden;

/* Fill */
background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%);
transition: width 0.3s ease;
```

**Rank Progress (with glow):**
```css
width: 100%;
height: 12px;
background: #222222;
border: 1px solid #333333;
position: relative;

/* Fill */
background: #ffcc00;
box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
```

### Input Fields

**Text Input:**
```css
background: #0a0a0a;
border: 1px solid #333333;
color: #ffffff;
padding: 12px 16px;
font-size: 14px;
font-family: 'JetBrains Mono', monospace;
border-radius: 0px;

/* Focus */
border-color: #00ff88;
outline: none;
box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
```

**Select Dropdown:**
```css
background: #0a0a0a;
border: 1px solid #333333;
color: #ffffff;
padding: 12px 16px;
font-size: 14px;
font-family: 'JetBrains Mono', monospace;
appearance: none;
background-image: url('data:image/svg+xml...');  /* Custom arrow */

/* Focus */
border-color: #00ff88;
```

### Modals/Overlays

**Modal Background:**
```css
background: rgba(0, 0, 0, 0.9);
backdrop-filter: blur(8px);
```

**Modal Content:**
```css
background: #0a0a0a;
border: 1px solid #00ff88;
padding: 40px;
max-width: 600px;
box-shadow: 0 20px 60px rgba(0, 255, 136, 0.2);
```

**Modal Header:**
```css
font-size: 24px;
font-weight: 700;
text-transform: uppercase;
color: #ffffff;
margin-bottom: 24px;
border-bottom: 1px solid #333333;
padding-bottom: 16px;
```

### Success/Completion Overlay
```
╔════════════════════════════════════════════════╗
║                                                ║
║         MISSION ACCOMPLISHED                   ║
║                                                ║
║            +25 POINTS AWARDED                  ║
║                                                ║
║          RANK PROGRESS: 83%                    ║
║          ████████████████████░░                ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**Specifications:**
- Full screen overlay: rgba(0, 0, 0, 0.95)
- Center card: 600px wide
- Background: #0a0a0a
- Border: 2px solid #00ff88
- Box shadow: 0 0 40px rgba(0, 255, 136, 0.4)
- Text: White, centered, bold
- Auto-dismiss after 3 seconds with fade out
- Optional: Subtle particle effect or glow animation

---

## Kid-Specific Additions (Without Breaking the Design)

### Agent Avatar/Profile Icon
- Small circular avatar in header (32px)
- Border: 2px solid based on rank color
  - Recruit: #666666
  - Field Agent: #00ff88
  - Elite Agent: #ffcc00
  - Master Agent: #ff3b3b

### Rank Badge (Next to Username)
```css
display: inline-block;
padding: 4px 10px;
background: #1a1a1a;
border: 1px solid #00ff88;
font-size: 11px;
text-transform: uppercase;
margin-left: 12px;
```

### Points Display
- In header, right side
- Format: "245 POINTS"
- Color: #ffcc00 (gold)
- Font size: 14px, bold

### Streak Indicator (Optional)
- Small flame icon or number in sidebar
- "5 DAY STREAK 🔥"
- Color: #ff6b35 (orange)

### Achievement Badges (Profile Page)
- Grid of small badge cards
- 80px x 80px each
- Background: #0a0a0a
- Border: 1px solid #333333
- Icon/emoji centered
- Badge name below (11px, #999999)
- Locked badges: 50% opacity, grayscale

---

## Animation & Interactions

### Hover States
- All interactive elements (cards, buttons, nav items): 
  - Transition: 0.2s ease
  - Border color change or glow effect
  
### Loading States
- Skeleton screens with subtle shimmer
- Background: #0a0a0a → #1a1a1a gradient animation
- No spinners, use progress bars when possible

### Page Transitions
- Fade in: 0.3s ease
- No slide animations (too playful)

### Mission Completion
1. Button click → instant feedback (border glow)
2. 200ms delay
3. Full-screen overlay fades in (0.4s)
4. Success message appears with scale animation (0.3s)
5. Hold for 2 seconds
6. Fade out (0.4s)
7. Return to updated dashboard

---

## Responsive Breakpoints

### Desktop (1200px+)
- Sidebar visible
- Multi-column card layouts
- Full stat dashboard

### Tablet (768px - 1199px)
- Collapsible sidebar (hamburger menu)
- 2-column card layouts
- Simplified header

### Mobile (< 768px)
- Hidden sidebar (hamburger menu only)
- Single-column layout
- Stacked navigation
- Larger touch targets (48px minimum)
- Bottom navigation bar for quick actions

---

## Icons

### Style
- Use minimal line icons (Lucide, Heroicons, or Feather)
- Stroke width: 2px
- Size: 20px default, 16px for small contexts
- Color: Match text color (#ffffff or #999999)

### Common Icons Needed
- Target (missions)
- Check (completed)
- Clock (deadline)
- User (personnel)
- Star (rank/points)
- Trophy (achievements)
- Gift (rewards)
- Camera (photo upload)
- Alert (overdue)
- Info (details)

---

## Special Considerations for Kids

### Readability
- Minimum font size: 13px on mobile
- High contrast always (WCAG AA compliant)
- Clear focus states for accessibility

### Touch Targets
- Minimum 44px x 44px on mobile
- Adequate spacing between interactive elements

### Feedback
- Every action gets immediate visual feedback
- Success states are celebratory (but not cartoonish)
- Errors are clear and helpful

### Parent vs. Kid Views
**Parent (Commander) View:**
- Full control panel
- Analytics and insights
- Verification queue
- Settings access

**Kid (Agent) View:**
- Simplified to "Your Missions"
- Focus on completing tasks
- Gamification elements more prominent
- Can't access settings or billing

---

## Implementation Notes for Claude Code

When building components, always:
1. Use Tailwind CSS for styling (define custom colors in tailwind.config.js)
2. Maintain monospace fonts for data/mission names
3. Keep borders sharp (border-radius: 0) for that tactical feel
4. Use subtle hover effects (border glow, not dramatic changes)
5. Status badges should be small and unobtrusive
6. Progress bars should be prominent and clear
7. Test on dark backgrounds only
8. Ensure high contrast for all text
9. Add smooth transitions (0.2s - 0.3s)
10. Keep it professional - avoid cutesy animations

---

## Example Component Code

### Mission Card Component (React + Tailwind)
```jsx
<div className="bg-[#0a0a0a] border border-[#333333] p-5 mb-4 
                hover:border-[#00ff88] transition-colors duration-200">
  {/* Header */}
  <div className="flex justify-between items-start mb-4">
    <h3 className="text-white font-bold text-lg uppercase tracking-wide font-mono">
      Operation Silent Storm
    </h3>
    <div className="flex gap-2">
      <span className="bg-[#00d4ff] text-black px-2 py-1 text-xs font-bold uppercase rounded">
        Active
      </span>
      <span className="bg-[#ffcc00] text-black px-2 py-1 text-xs font-bold uppercase rounded">
        Medium
      </span>
    </div>
  </div>
  
  {/* Progress */}
  <div className="mb-3">
    <div className="flex justify-between text-sm text-[#999999] mb-2 font-mono">
      <span className="uppercase text-xs">Objectives Progress</span>
      <span>5/12</span>
    </div>
    <div className="h-2 bg-[#222222] rounded-none overflow-hidden">
      <div className="h-full bg-white" style={{width: '42%'}}></div>
    </div>
  </div>
  
  {/* Metadata */}
  <div className="text-[#999999] text-sm font-mono">
    Target Date: 30 NOV 2025 17:00
  </div>
</div>
```

---

## Final Notes

This design balances:
✅ Professional aesthetic that appeals to older kids/teens
✅ Clean, organized information architecture
✅ Subtle gamification without being childish
✅ Accessibility and readability
✅ Modern UI trends (dark mode, minimalism, tactical/military theme)

The key is: **treat the kids like they're using professional software, because that's what they're used to from AAA games.**
