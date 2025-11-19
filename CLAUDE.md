# Mission Command - Military-Themed Chores App for Kids

## Project Overview
Mission Command is a gamified chores app for families that makes household tasks feel like secret military operations. Kids don't do chores—they complete missions. Parents don't assign tasks—they deploy agents. The entire experience is styled like classified military software from action movies, making everyday responsibilities feel exciting and important.

**Core Hook:** Kids love feeling like secret agents. Parents love getting chores done. Everyone wins.

## Core Concept & Terminology

### Military Hierarchy (Family Roles)
- **Commander** = Parent/Guardian
- **Lieutenant** = Older sibling (optional, for families with teens)
- **Agent** = Kid/Child doing chores

### Military Verbiage
- **Chore** → **Mission**
- **Chore List** → **Mission Brief**
- **Complete Chore** → **Mission Accomplished**
- **Sign Up** → **Enlist** (parents enlist their family)
- **Login** → **Access Granted**
- **Dashboard** → **Command Center**
- **Allowance** → **Mission Pay / Field Bonus**
- **Rewards** → **Commendations / Medals**
- **Streak** → **Combat Record**
- **Points** → **Rank Points / XP**
- **Weekly Allowance** → **Weekly Field Pay**
- **Chore Chart** → **Operations Board**
- **Reminder** → **Briefing Alert**
- **Complete** → **Secure / Accomplished**
- **Overdue** → **Mission Critical**

## Tech Stack

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** or **React Context** for state management
- **date-fns** for date handling

### Backend & Services
- **Supabase** for:
  - PostgreSQL database
  - Authentication (enlistment system)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Auto-generated REST APIs

### Payments
- **Stripe** for subscription billing ($5/month per user)

### Hosting
- **Vercel** for frontend deployment
- **Supabase** for backend (fully managed)

## Design Aesthetic

### Visual Style
- **Theme:** Kid-friendly secret agent HQ / spy headquarters
- **Tone:** Fun, exciting, empowering (not scary or too serious)
- **Color Palette:**
  - Primary: Deep navy (#1a2332)
  - Secondary: Tactical green (#3d8b40, #52b556)
  - Accent: Gold/achievement (#ffc107, #ffeb3b)
  - Kid-friendly pops: Orange (#ff6b35), Blue (#4a90e2)
  - Text: Bright white and light grays for readability
  - Success: Mission green (#4caf50)
  - Alert: Warning red (#ff5252)
  
### Typography
- **Headers:** Bold, action-style fonts (Bangers, Bebas Neue, Bungee)
- **Body:** Clean, readable fonts (Roboto, Inter) - kids need legibility
- **Emphasis:** All caps for mission titles and achievements
- **Age-appropriate:** Large text sizes, clear hierarchy

### UI Elements
- Cartoon-style rank badges and medals
- Bright "MISSION ACCOMPLISHED" success screens with confetti
- Progress bars styled as loading bars with military stripes
- Kid-friendly avatars (customizable agent characters)
- Star ratings for missions (1-5 stars based on effort)
- Achievement badges that unlock over time
- Animated mission completion celebrations
- Simple iconography (clear symbols for different chore types)
- Dark theme that's exciting, not scary (think spy kids, not horror)

### Inspiration
Think: Spy Kids, Agent Cody Banks, Kim Possible, Club Penguin secret agent missions, Pokémon badge collecting

## Database Schema

### Tables

#### `families` (Households/Units)
```sql
- id (uuid, primary key)
- name (text) - Family name (e.g., "Smith Squadron")
- created_at (timestamp)
- stripe_customer_id (text)
- subscription_status (enum: active/cancelled/past_due/trial)
- trial_ends_at (timestamp)
```

#### `users` (Family Members)
```sql
- id (uuid, primary key)
- email (text, unique) - Parent's email
- full_name (text)
- role (enum: commander/lieutenant/agent)
- family_id (uuid, foreign key)
- avatar_url (text) - Custom agent avatar
- agent_code (text) - Fun ID like "AGENT-7349"
- rank_points (integer) - Accumulated XP
- current_rank (text) - "Recruit", "Field Agent", "Elite Agent", etc.
- date_of_birth (date) - For age-appropriate missions
- created_at (timestamp)
- last_active (timestamp)
```

#### `missions` (Chores)
```sql
- id (uuid, primary key)
- family_id (uuid, foreign key)
- title (text) - e.g., "Operation: Clean Room"
- description (text) - What needs to be done
- category (enum: cleaning/dishes/laundry/pets/outdoor/homework/other)
- difficulty (enum: easy/medium/hard) - Affects points earned
- status (enum: pending/in_progress/completed/verified)
- created_by (uuid, foreign key to users) - Which parent assigned it
- assigned_to (uuid, foreign key to users) - Which kid
- due_date (date) - When it needs to be done
- recurring (boolean) - Is this a daily/weekly chore?
- recurrence_pattern (text) - "daily", "weekly_monday", "weekly_weekend", etc.
- rank_points (integer) - How many points it's worth (10-100)
- field_bonus (decimal) - Optional monetary reward
- is_verified (boolean) - Parent checked it off
- created_at (timestamp)
- completed_at (timestamp) - When kid marked it done
- verified_at (timestamp) - When parent verified
```

#### `achievements` (Badges/Medals)
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- badge_type (text) - "streak_7_day", "first_mission", "100_points", etc.
- earned_at (timestamp)
- badge_name (text) - "Week Warrior", "Rookie Success", etc.
- badge_icon (text) - Emoji or icon identifier
```

#### `rank_history` (Level-ups)
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- old_rank (text)
- new_rank (text)
- ranked_up_at (timestamp)
```

#### `mission_photos` (Proof of completion - optional)
```sql
- id (uuid, primary key)
- mission_id (uuid, foreign key)
- user_id (uuid, foreign key)
- photo_url (text) - Supabase storage URL
- uploaded_at (timestamp)
```

#### `rewards` (Parent-created incentives)
```sql
- id (uuid, primary key)
- family_id (uuid, foreign key)
- title (text) - "Ice cream trip", "Extra screen time", etc.
- cost_in_points (integer) - How many points to redeem
- created_by (uuid, foreign key to users)
- is_active (boolean)
- created_at (timestamp)
```

#### `reward_redemptions`
```sql
- id (uuid, primary key)
- reward_id (uuid, foreign key)
- user_id (uuid, foreign key)
- redeemed_at (timestamp)
- points_spent (integer)
```

## Key Features

### Phase 1: Core Functionality (Build First)

1. **Family Enlistment & Authentication**
   - Parent creates family account ("Enlist Your Squad")
   - Parent adds kids as agents with custom avatars
   - Each kid gets a unique agent code
   - Parent is the Commander, kids are Agents
   - Simple PIN or password for kid login

2. **Command Center (Dashboard)**
   - **For Parents:** Overview of all missions, completion rates, which kid needs nudging
   - **For Kids:** Their active missions, points earned, current rank, next badge
   - Daily mission briefing
   - Streak tracker (days in a row completing missions)
   - Quick stats (missions completed this week, total points, next rank)

3. **Mission Assignment**
   - Parents create missions (chores) with details
   - Assign to specific kid or "open to any agent"
   - Set difficulty (easy/medium/hard) which affects points
   - Add optional field bonus (allowance money)
   - Set due date and recurring pattern
   - Add photo requirement for proof (optional)

4. **Mission Completion Flow**
   - Kid views mission brief
   - Kid accepts mission (changes status to "In Progress")
   - Kid completes mission and marks as done
   - Optional: Upload photo as proof
   - Parent gets notification to verify
   - Parent approves → Kid gets points + celebration screen!
   - Parent rejects → Kid can retry

5. **Points & Ranking System**
   - Kids earn rank points for completing missions
   - Automatic rank progression (Recruit → Field Agent → Elite Agent → Master Agent)
   - Level-up celebrations with animations
   - Leaderboard for families with multiple kids (friendly competition)

6. **Achievement Badges**
   - Auto-award badges for milestones:
     - "First Mission" - Complete your first mission
     - "Week Warrior" - 7-day streak
     - "Century Club" - Earn 100 points
     - "Early Bird" - Complete mission before due date
     - "Photo Proof" - Upload 10 mission photos
     - "Clean Sweep" - Complete all missions in a week
   - Display badges on agent profile

7. **Rewards Store**
   - Parents create custom rewards (ice cream, extra screen time, toy, etc.)
   - Set point cost for each reward
   - Kids browse rewards and redeem points
   - Parent gets notification when kid redeems
   - Redemption history tracking

8. **Recurring Missions**
   - Daily missions auto-create (make bed, brush teeth)
   - Weekly missions (clean room every Saturday)
   - Smart scheduling that doesn't overwhelm kids

### Phase 2: Premium Features & Payments

9. **Stripe Integration**
   - $5/month per family (unlimited agents)
   - 14-day free trial
   - Checkout on enlistment
   - Webhook handling for subscription events
   - Grace period for failed payments

10. **Advanced Features (Premium)**
    - Mission templates (pre-made chores library)
    - Custom badge creator
    - Family stats and insights
    - Allowance tracking and payment schedules
    - Mission photos and verification
    - Multiple commanders (both parents)
    - Export chore completion reports

11. **Notifications**
    - Push notifications for mission assignments
    - Reminders as due dates approach
    - Celebration notifications when kids complete missions
    - Parent alerts when missions need verification

## User Roles & Permissions

### Commander (Parent/Guardian)
- Full access to family account
- Create, assign, and verify missions
- Add/remove agents (kids)
- Manage rewards and allowance
- View all stats and completion history
- Manage billing and subscription
- Customize recurring missions
- Approve/reject mission completions

### Lieutenant (Older Teen - Optional)
- Can create missions for younger siblings
- Can verify mission completions
- Cannot manage billing or family settings
- Great for teaching responsibility to older kids

### Agent (Kid/Child)
- View assigned missions
- Accept and complete missions
- Upload proof photos
- Earn points and badges
- Redeem rewards
- View own stats and rank
- Cannot see other agents' points (unless parent enables leaderboard)

## Development Roadmap

### Sprint 1: Foundation
- [ ] Initialize Vite + React project
- [ ] Set up Tailwind CSS with military color scheme
- [ ] Create base layout with military styling
- [ ] Implement custom fonts and UI components
- [ ] Build reusable components (buttons, cards, badges, forms)

### Sprint 2: Authentication & Supabase
- [ ] Set up Supabase project
- [ ] Configure authentication
- [ ] Create database tables with RLS policies
- [ ] Build enlistment flow (signup)
- [ ] Build access flow (login)
- [ ] Implement organization creation

### Sprint 3: Core Features
- [ ] Build Command Center dashboard
- [ ] Create mission list and detail views
- [ ] Implement mission creation and editing
- [ ] Build objective management
- [ ] Add personnel assignment system

### Sprint 4: Real-time & Intel
- [ ] Implement real-time subscriptions for missions
- [ ] Build intel reports system
- [ ] Add activity feed
- [ ] Create notification system (optional)

### Sprint 5: Polish & UX
- [ ] Add loading states and animations
- [ ] Implement error handling
- [ ] Create empty states with military flair
- [ ] Add search and filtering
- [ ] Mobile responsiveness

### Sprint 6: Stripe Integration
- [ ] Set up Stripe account and products
- [ ] Implement checkout flow
- [ ] Build webhook handlers
- [ ] Add billing management page
- [ ] Implement subscription status checks

### Sprint 7: Deployment
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Test production environment
- [ ] Monitor and iterate

## Component Structure

```
src/
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── Button.jsx             # Action buttons with kid-friendly styling
│   │   ├── Card.jsx               # Mission cards
│   │   ├── Badge.jsx              # Achievement badges, rank badges
│   │   ├── Input.jsx              # Form inputs
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── ProgressBar.jsx        # XP/points progress
│   │   └── ConfettiCelebration.jsx # Mission completion animation
│   ├── layout/
│   │   ├── Header.jsx             # Top nav with agent rank/avatar
│   │   ├── Sidebar.jsx            # Main navigation
│   │   └── Layout.jsx             # Different layouts for parent vs kid view
│   ├── missions/
│   │   ├── MissionCard.jsx        # Chore overview card
│   │   ├── MissionDetail.jsx      # Full mission view
│   │   ├── MissionForm.jsx        # Create/edit chore (parent)
│   │   ├── MissionList.jsx        # List of missions
│   │   ├── MissionVerify.jsx      # Parent verification interface
│   │   └── PhotoUpload.jsx        # Proof photo component
│   ├── agents/
│   │   ├── AgentCard.jsx          # Kid profile card
│   │   ├── AgentAvatar.jsx        # Customizable avatar
│   │   ├── RankBadge.jsx          # Display current rank
│   │   ├── AgentStats.jsx         # Points, rank, streak
│   │   └── AddAgentForm.jsx       # Parent adds kids
│   ├── achievements/
│   │   ├── BadgeDisplay.jsx       # Show earned badges
│   │   ├── BadgeCard.jsx          # Individual badge
│   │   └── LevelUpAnimation.jsx   # Rank progression celebration
│   ├── rewards/
│   │   ├── RewardStore.jsx        # Browse available rewards
│   │   ├── RewardCard.jsx         # Individual reward
│   │   ├── RewardForm.jsx         # Parent creates rewards
│   │   └── RedemptionHistory.jsx  # Past redemptions
│   └── dashboard/
│       ├── ParentDashboard.jsx    # Commander view
│       ├── KidDashboard.jsx       # Agent view
│       ├── StatsWidget.jsx        # Quick stats
│       └── StreakTracker.jsx      # Daily streak display
├── pages/
│   ├── Enlistment.jsx             # Family signup
│   ├── Login.jsx                  # Login (parent or kid)
│   ├── CommandCenter.jsx          # Main dashboard (role-based)
│   ├── MissionBriefing.jsx        # Mission detail page
│   ├── AgentProfile.jsx           # Kid's profile and stats
│   ├── RewardsPage.jsx            # Rewards store
│   ├── FamilySettings.jsx         # Parent settings
│   └── BillingPage.jsx            # Subscription management
├── lib/
│   ├── supabase.js                # Supabase client
│   ├── stripe.js                  # Stripe utilities
│   └── achievements.js            # Badge logic and definitions
├── hooks/
│   ├── useMissions.js
│   ├── useAgent.js
│   ├── useAchievements.js
│   ├── useRewards.js
│   └── useAuth.js
└── utils/
    ├── constants.js               # Mission categories, ranks, badges
    ├── points.js                  # Point calculation logic
    └── helpers.js
```

## Sample UI Copy

### Dashboard Headlines
- "WELCOME BACK, AGENT [NAME]! 🎖️"
- "MISSIONS ACTIVE: 3 | RANK: FIELD AGENT | POINTS: 245"
- "STREAK: 5 DAYS 🔥 KEEP GOING!"
- "NEW MISSION BRIEFING AVAILABLE"

### Mission Statuses
- 🟢 READY (not started yet)
- 🔵 IN PROGRESS
- 🟡 AWAITING VERIFICATION (kid marked done, parent needs to check)
- ✅ MISSION ACCOMPLISHED
- 🔴 OVERDUE
- ⭐ VERIFIED (parent approved)

### Buttons & CTAs (Kid View)
- "ACCEPT MISSION"
- "MARK COMPLETE"
- "UPLOAD PROOF"
- "VIEW REWARDS"
- "CHECK RANK"

### Buttons & CTAs (Parent View)
- "DEPLOY MISSION"
- "ASSIGN AGENT"
- "VERIFY COMPLETION"
- "CREATE REWARD"
- "ADD AGENT"

### Mission Categories
- 🧹 CLEANING OPS
- 🍽️ KITCHEN DUTY
- 👕 LAUNDRY MISSION
- 🐕 PET CARE
- 🌳 OUTDOOR OPERATIONS
- 📚 HOMEWORK PROTOCOL
- 🛏️ ROOM INSPECTION

### Ranks (Progressive)
1. 👶 Recruit (0-50 points)
2. 🎖️ Junior Agent (51-150 points)
3. ⭐ Field Agent (151-300 points)
4. 💎 Elite Agent (301-500 points)
5. 🏆 Master Agent (501-1000 points)
6. 👑 Legendary Agent (1000+ points)

### Achievement Badges
- 🥇 "First Mission" - Complete your first mission
- 🔥 "Week Warrior" - 7-day streak
- 💯 "Century Club" - Earn 100 points
- ⏰ "Early Bird" - Complete before due date 5 times
- 📸 "Photo Proof Pro" - Upload 10 photos
- 🧽 "Clean Sweep" - Complete all missions in a week
- 🚀 "Speedster" - Complete 5 missions in one day
- 🎯 "Sharpshooter" - 10 missions completed early
- 🌟 "All-Star" - Reach Elite Agent rank

### Empty States
- "NO ACTIVE MISSIONS - AWAITING NEW ASSIGNMENTS"
- "AGENT ROSTER EMPTY - RECRUIT YOUR FIRST AGENT"
- "NO REWARDS YET - TIME TO CREATE SOME!"
- "ZERO BADGES EARNED - START YOUR FIRST MISSION!"

### Success Messages
- "🎉 MISSION ACCOMPLISHED! +25 POINTS!"
- "✨ YOU'VE RANKED UP TO FIELD AGENT!"
- "🏆 NEW BADGE UNLOCKED: WEEK WARRIOR!"
- "💰 REWARD REDEEMED: ICE CREAM TRIP!"
- "📸 PROOF UPLOADED - AWAITING COMMANDER APPROVAL"

### Parent Success Messages
- "✅ MISSION DEPLOYED TO AGENT [NAME]"
- "👍 MISSION VERIFIED - [CHILD] EARNED 25 POINTS"
- "🎁 NEW REWARD CREATED: EXTRA SCREEN TIME"
- "👤 AGENT [NAME] HAS BEEN ENLISTED"

### Error Messages
- "⚠️ MISSION BRIEFING INCOMPLETE - PLEASE ADD DETAILS"
- "❌ PHOTO UPLOAD FAILED - TRY AGAIN"
- "🔒 ACCESS DENIED - COMMANDER LOGIN REQUIRED"

### Gamification Messages
- "KEEP IT UP! YOU'RE 5 POINTS FROM RANKING UP!"
- "YOU'RE ON A 3-DAY STREAK! 🔥"
- "COMPLETE 2 MORE MISSIONS TO UNLOCK SPEEDSTER BADGE"
- "YOU'VE EARNED 50 POINTS THIS WEEK! 💪"

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
VITE_APP_URL=http://localhost:5173 (or production URL)
```

## Supabase Row Level Security (RLS) Policies

### Families
- Users can only read their own family data
- Only commanders can update family settings

### Users (Family Members)
- Users can read all members in their family
- Only commanders can add/remove agents
- Agents can update their own avatar and profile (limited fields)

### Missions (Chores)
- Users can only see missions from their family
- Commanders can create, update, delete any mission
- Agents can only see missions assigned to them (or unassigned missions)
- Agents can update status of their own missions (accept, complete)
- Only commanders can verify missions

### Achievements
- Users can only see their own achievements
- System automatically creates achievement records (via Supabase functions)

### Rewards
- Users can read all rewards in their family
- Only commanders can create/update/delete rewards
- Agents can create redemption records for themselves

### Mission Photos
- Users can only upload photos for their own missions
- All family members can view photos within their family

## Stripe Setup

1. Create Stripe account
2. Create a **Product**: "Mission Command Family Plan"
3. Create a **Price**: $5/month recurring (per family, unlimited agents)
4. Create a **Trial Period**: 14 days free
5. Set up webhook endpoint: `https://your-app.com/api/webhooks/stripe`
6. Listen for events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end` (send reminder 3 days before trial ends)

## Pricing Strategy
- **Free Trial:** 14 days, no credit card required upfront (optional: require CC for trial)
- **Monthly:** $5/month per family (unlimited kids/agents)
- **Annual:** $50/year (save $10) - 2 months free
- **Freemium Option:** Consider free tier with limits (2 agents, 10 missions/month) to drive adoption

## Deployment Checklist

- [ ] Push code to GitHub repository
- [ ] Create Vercel project and connect to GitHub
- [ ] Add environment variables in Vercel
- [ ] Deploy Supabase project to production
- [ ] Update Supabase RLS policies
- [ ] Configure Stripe webhook in production
- [ ] Test enlistment flow end-to-end
- [ ] Test subscription payment
- [ ] Test mission creation and real-time updates
- [ ] Set up custom domain (optional)
- [ ] Add monitoring (Vercel Analytics, Sentry)

## Future Enhancements (Post-MVP)

### Gamification
- Seasonal events (Summer Challenge, Holiday Mission Marathon)
- Family tournaments/competitions
- Mystery missions with surprise rewards
- Boss battles (big chores worth mega points)
- Power-ups (2x points weekends, etc.)

### Social Features
- Share badges on social media
- Family vs. Family leaderboards (opt-in, privacy-focused)
- Mission templates shared by community
- Parent forums/tips section

### Advanced Features
- AI-suggested mission assignments based on kid's age/history
- Voice-activated mission acceptance ("Alexa, accept my missions")
- Apple Watch / smart watch integration
- Calendar sync for mission due dates
- Photo verification with AI (did they really clean the room?)
- Allowance auto-payment integration (Venmo, PayPal)
- Chore rotation automation
- Weather-based mission adjustments (rain = no lawn mowing)
- School schedule integration (more missions on weekends)

### Parent Tools
- Chore completion analytics and insights
- Family progress reports (weekly/monthly)
- Export data (for taxes if paying allowance)
- Multi-language support
- Customizable point values
- Age-based mission recommendations
- Printable mission checklists (for offline use)

### Mobile Experience
- Native iOS/Android apps (React Native)
- Push notifications
- Offline mode (complete missions without internet, sync later)
- Widget showing today's missions

### Integrations
- Google Calendar sync
- Apple Home/Google Home integration
- IFTTT integration for automation
- Smart home rewards (complete missions → earn smart light colors, etc.)

## Monetization Notes

### Pricing Tiers
- **Free Trial:** 14 days, unlimited features
- **Monthly Plan:** $5/month per family (unlimited kids)
- **Annual Plan:** $50/year (save $10 = 2 months free)
- **Lifetime:** $199 one-time (optional premium offering)

### Freemium Consideration (Alternative Model)
- **Free Tier:** 2 kids, 10 active missions max, basic badges
- **Premium Tier:** $5/month - unlimited kids, unlimited missions, all badges, rewards store, mission photos, analytics

### Revenue Projections
- Target: 1,000 paying families in Year 1
- Average revenue per family: $5/month
- Monthly Recurring Revenue (MRR): $5,000
- Annual Recurring Revenue (ARR): $60,000
- With 5,000 families: $25,000/month = $300,000/year

### Customer Acquisition
- Target market: Parents with kids aged 5-15
- Marketing channels:
  - Parenting blogs and podcasts
  - Facebook parent groups
  - TikTok/Instagram parenting influencers
  - Google Ads (search: "chore app for kids")
  - App Store optimization
  - Reddit (r/parenting, r/Mommit)
  - YouTube (parenting channels)
- Referral program: "Recruit a Family" - get 1 month free

### Churn Prevention
- Email reminders before trial ends
- Success milestones ("Your kids have completed 50 missions!")
- Parent testimonials and case studies
- Regular feature updates and seasonal events
- Excellent customer support

## Key Principles for Development

1. **Kid-First Design**: Everything should be exciting and rewarding for kids - they're the primary users who need to stay engaged
2. **Parent-Friendly Management**: Parents need quick, easy tools to assign chores and verify completion - no complex workflows
3. **Military Theme as Fun**: The military aesthetic should feel like spy kids playing secret agents, not actual military seriousness
4. **Positive Reinforcement**: Focus on earning rewards and ranking up, not punishment or shame
5. **Simple & Clear**: Kids as young as 5-6 should be able to navigate their agent dashboard
6. **Instant Gratification**: Fast animations, immediate feedback, celebration screens
7. **Safe & Appropriate**: No scary imagery, age-appropriate content, COPPA compliant
8. **Mobile-First**: Kids will use this on tablets/phones, parents on phones/computers
9. **Gamification Balance**: Fun enough to engage kids, but still teaching real responsibility
10. **Family Privacy**: Keep family data secure, no social features that expose kids publicly

## Getting Started with Claude Code

You can start building this project by opening your terminal and running:

```bash
claude code "Create Mission Command: a gamified chores app for families with kids. Use React, Vite, Tailwind CSS, and Supabase. Style it with a fun military/secret agent theme."
```

Then iterate with prompts like:
- "Style the app with a kid-friendly secret agent aesthetic - think Spy Kids movie"
- "Create the family enlistment flow where parents sign up and add their kids as agents"
- "Build the agent dashboard showing active missions, points, rank, and badges"
- "Create the parent dashboard to assign missions and verify completions"
- "Add the points and ranking system with celebration animations"
- "Build the achievement badge system with auto-awards"
- "Create the rewards store where kids can redeem points"
- "Add Supabase authentication and database integration"
- "Integrate Stripe for $5/month family subscriptions with 14-day free trial"
- "Add mission photo upload for proof of completion"

---

**Remember:** This app should make kids EXCITED to do chores. Keep the theme fun, the rewards motivating, and the experience magical. When a kid completes a mission, they should feel like a real secret agent who just saved the world (or at least cleaned their room). MISSION SUCCESS! 🎖️
