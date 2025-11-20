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
- **Tailwind CSS** for styling (with CSS variables for future theming)
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
  - File storage (mission photos, avatars)

### Payments & Rewards
- **Stripe** for:
  - Subscription billing ($7-12/month per family)
  - One-time reward purchases (parent pays for gift cards)
  - Payment processing
  - Webhook handling
- **Tremendous API** for digital gift card delivery
  - Roblox, Fortnite, Amazon, and 2,000+ brands
  - Instant digital delivery
  - Pay-as-you-go pricing
  - RESTful API integration

### Email Delivery
- **SendGrid** or **Postmark** for themed reward emails
  - HTML email templates (military themed)
  - 99% deliverability
  - Track opens/clicks
  - ~$0.001 per email

### Hosting
- **Vercel** for frontend deployment
- **Supabase** for backend (fully managed)

## Design Aesthetic

### MVP Theme: Military/Tactical Only
For initial launch, Mission Command will feature the **Military/Tactical theme exclusively**. The app architecture will support future themes, but we're starting with one polished experience.

**Why Military First:**
- Broadest appeal (boys and girls 8-15)
- Spy/agent theme is universally cool
- Professional aesthetic appeals to parents
- Clear differentiation from competitors
- Easy to market ("spy chores", "secret agent tasks")

**Future Themes:** Once validated, we'll add Princess/Royal, Space/Sci-Fi, Superhero, Pirate, and Ninja themes (see THEMES_SPEC.md). The codebase is built theme-agnostic from day one using CSS variables.

### Current Theme: Military/Tactical

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

#### `gift_cards` (Digital reward catalog from Tremendous)
```sql
- id (uuid, primary key)
- tremendous_product_id (text) - Tremendous API product ID
- brand_name (text) - "Roblox", "Fortnite", "Amazon", etc.
- display_name (text) - "Roblox Gift Card"
- description (text)
- category (enum: gaming/streaming/shopping/entertainment)
- denominations (array) - [10, 25, 50, 100] available amounts
- brand_logo_url (text) - Logo image
- point_cost_per_dollar (integer) - e.g., 20 points = $1
- parent_cost_markup (decimal) - Your markup percentage (e.g., 0.40 for 40%)
- is_active (boolean)
- is_featured (boolean)
- age_minimum (integer)
- sort_order (integer)
- created_at (timestamp)
```

#### `reward_redemptions`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key) - Which kid redeemed
- gift_card_id (uuid, foreign key)
- denomination (integer) - $10, $25, $50, or $100
- points_spent (integer)
- parent_cost_usd (decimal) - What parent paid
- tremendous_cost_usd (decimal) - What you paid Tremendous
- profit_usd (decimal) - Your profit margin
- stripe_payment_intent_id (text)
- tremendous_order_id (text) - Tremendous API order ID
- tremendous_reward_id (text) - Tremendous API reward ID
- gift_code (text) - The actual redemption code (encrypted)
- redemption_url (text) - Where to redeem the code
- status (enum: pending/processing/delivered/failed)
- email_sent_at (timestamp)
- redeemed_at (timestamp)
- created_at (timestamp)
```

#### `rewards` (Parent-created family rewards - free)
```sql
- id (uuid, primary key)
- family_id (uuid, foreign key)
- title (text) - "Ice cream trip", "Extra screen time", etc.
- description (text)
- cost_in_points (integer)
- reward_type (enum: experience/privilege/item)
- is_active (boolean)
- created_by (uuid, foreign key to users)
- created_at (timestamp)
```

#### `family_reward_redemptions` (Tracking custom family rewards)
```sql
- id (uuid, primary key)
- reward_id (uuid, foreign key)
- user_id (uuid, foreign key)
- points_spent (integer)
- redeemed_at (timestamp)
- fulfilled_at (timestamp) - When parent marked as given
- fulfilled_by (uuid, foreign key to users) - Which parent fulfilled it
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

7. **Digital Rewards Marketplace**
   - **Two reward types:**
     - **Family Rewards:** Parents create custom rewards (ice cream, screen time, etc.) - FREE, no cost
     - **Gift Card Marketplace:** Kids redeem points for real digital gift cards (parent pays)
   
   - **Gift Card Marketplace powered by Tremendous API:**
     - **Gaming:** Roblox, Fortnite V-Bucks, Minecraft, Xbox, PlayStation, Nintendo
     - **Streaming:** Netflix, Disney+, Spotify, Apple Music
     - **Shopping:** Amazon, Target, Walmart
     - **Entertainment:** iTunes, Google Play, Steam
   
   - **Redemption Flow:**
     1. Kid browses marketplace
     2. Selects gift card (e.g., "$25 Roblox - 500 points + $10")
     3. Parent gets notification with approve/deny
     4. Parent approves → Stripe charges parent $10
     5. System calls Tremendous API to purchase $25 card (costs ~$26)
     6. **Themed military email sent instantly** with gift code
     7. Kid receives code in 2-5 minutes
   
   - **Point + Cash Hybrid Pricing:**
     - Kid must earn points threshold (proves they did work)
     - Parent pays discounted cash amount
     - Example: $25 card = 500 points + $10 cash (parent saves $15)
   
   - **Family Rewards (Custom):**
     - Parents create unlimited free rewards
     - "Ice cream trip" (100 points)
     - "Extra 30 min screen time" (50 points)
     - "Choose dinner" (150 points)
     - Pure points cost, no money

8. **Themed Reward Emails**
   - Military-themed HTML emails delivered instantly
   - Includes: Agent name, rank, mission stats, gift code, redemption instructions
   - Feels like receiving classified intel
   - "MISSION ACCOMPLISHED" celebration
   - Next missions preview to keep engagement high

9. **Recurring Missions**
   - Daily missions auto-create (make bed, brush teeth)
   - Weekly missions (clean room every Saturday)
   - Smart scheduling that doesn't overwhelm kids

### Phase 2: Premium Features & Integrations

9. **Stripe Integration**
   - Family subscription: $7-12/month (tiered pricing)
   - Gift card purchases (one-time payments when kid redeems)
   - Checkout on enlistment (subscription)
   - Checkout for reward approvals (parent pays for gift cards)
   - Webhook handling for subscription and payment events
   - Grace period for failed subscription payments

10. **Tremendous API Integration**
    - Connect to Tremendous API for digital gift card fulfillment
    - Sync available products and denominations
    - Process orders in real-time
    - Handle order status updates
    - Encrypt and store gift codes securely
    - Error handling and retry logic

11. **SendGrid Email System**
    - Themed military email templates
    - Triggered on gift card delivery
    - Personalized with kid's name, rank, stats
    - Beautiful HTML with fallback to plain text
    - Track email opens and clicks
    - Resend functionality if email fails

12. **Advanced Features (Premium Tier)**
    - Mission templates (pre-made chores library)
    - Custom badge creator
    - Family stats and analytics
    - Mission photos and verification
    - Multiple commanders (both parents)
    - Export chore completion reports
    - Wishlist feature (save favorite gift cards)
    - Gift card balance tracking

13. **Notifications**
    - Push notifications for mission assignments
    - Reminders as due dates approach
    - Celebration notifications when kids complete missions
    - Parent alerts when missions need verification
    - **Redemption approval notifications:** "Agent Tommy wants to redeem 500 points for a $25 Roblox card ($10 to approve)"
    - **Instant reward notifications:** "Your gift code has been delivered! Check your email"
    - Point milestone notifications: "50 more points until you can get that Fortnite card!"

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
│   │   ├── RewardStore.jsx        # Browse family rewards + gift cards
│   │   ├── GiftCardGrid.jsx       # Display available gift cards
│   │   ├── GiftCardCard.jsx       # Individual gift card display
│   │   ├── FamilyRewardCard.jsx   # Parent-created reward display
│   │   ├── RewardForm.jsx         # Parent creates family rewards
│   │   ├── PurchaseModal.jsx      # Parent approval + Stripe payment
│   │   ├── RedemptionSuccess.jsx  # Confirmation screen with email preview
│   │   ├── Wishlist.jsx           # Kid's saved gift cards
│   │   └── RedemptionHistory.jsx  # Past redemptions (both types)
│   ├── giftcards/
│   │   ├── CategoryFilter.jsx     # Filter: Gaming, Streaming, Shopping
│   │   ├── DenominationPicker.jsx # Choose $10, $25, $50, $100
│   │   ├── FeaturedCards.jsx      # Spotlight popular cards
│   │   └── CardDetail.jsx         # Full gift card page with details
│   ├── emails/
│   │   ├── MilitaryRewardEmail.jsx    # Email template component
│   │   ├── EmailPreview.jsx       # Preview before sending
│   │   └── ResendEmail.jsx        # Resend failed emails
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
│   ├── RewardsMarketplace.jsx     # Family rewards + Gift cards
│   ├── GiftCardDetail.jsx         # Individual gift card page
│   ├── PurchaseApproval.jsx       # Parent approval flow
│   ├── RedemptionHistory.jsx      # Order history
│   ├── WishlistPage.jsx           # Saved gift cards
│   ├── FamilySettings.jsx         # Parent settings
│   └── BillingPage.jsx            # Subscription management
├── lib/
│   ├── supabase.js                # Supabase client
│   ├── stripe.js                  # Stripe utilities
│   ├── tremendous.js              # Tremendous API client
│   ├── sendgrid.js                # SendGrid email client
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
SUPABASE_SERVICE_KEY=your_service_key  # For server-side operations

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Tremendous API (Digital Gift Cards)
TREMENDOUS_API_KEY=your_tremendous_api_key
TREMENDOUS_FUNDING_SOURCE_ID=your_funding_source_id
TREMENDOUS_CAMPAIGN_ID=your_campaign_id
TREMENDOUS_BASE_URL=https://testflight.tremendous.com/api/v2  # Sandbox
# TREMENDOUS_BASE_URL=https://www.tremendous.com/api/v2  # Production

# SendGrid (Email Delivery)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=rewards@missioncommand.app
SENDGRID_TEMPLATE_ID=your_template_id

# App
VITE_APP_URL=http://localhost:5173 (or production URL)
NODE_ENV=development  # or production
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

### Theming System
- **Multiple visual themes:**
  - **Military/Tactical** (default) - spy/agent theme
  - **Princess/Royal** - castle, quests, royal decrees
  - **Space/Sci-Fi** - missions, planets, alien encounters
  - **Superhero** - save the city, villain missions
  - **Medieval/Fantasy** - knights, quests, treasure
  - **Pirate** - ship missions, treasure hunts
  - **Ninja** - stealth missions, training
- Theme affects:
  - Colors, fonts, icons
  - Mission terminology (quest vs mission vs assignment)
  - Rank names (Agent vs Princess vs Astronaut)
  - Badge designs
  - Sound effects
- Individual kid can pick their own theme
- Custom theme creator (premium feature)

### E-commerce Expansion
- **Subscription boxes:** Monthly surprise reward (physical items shipped)
- **Exclusive Mission Command merchandise:** Branded gear, apparel, accessories
- **Partner products:** Official partnerships with toy brands (Nerf, LEGO)
- **Virtual rewards:** In-game currency, Roblox/Fortnite codes
- **Experience marketplace:** Local activities (laser tag, escape rooms, etc.)
- **Gift cards:** Let kids earn Amazon/Target gift cards
- **Seasonal catalogs:** Holiday specials, back-to-school, summer items
- **Flash sales:** Limited-time deals on popular items
- **Auction system:** Kids can bid points on rare items
- **Trade-in program:** Send back old toys for points

### Gamification
- Seasonal events (Summer Challenge, Holiday Mission Marathon)
- Family tournaments/competitions
- Mystery missions with surprise rewards
- Boss battles (big chores worth mega points)
- Power-ups (2x points weekends, etc.)
- Daily login bonuses (streak rewards)
- Loot boxes (random small rewards for milestones)
- Mission chains (complete 5 related missions for bonus)

### Social Features (Privacy-Focused)
- Private family vs. family leaderboards (opt-in, friend-only)
- Share badges on social media (parent approval)
- Mission templates shared by community
- Parent forums/tips section
- Kid-to-kid messaging (heavily moderated, parent controlled)

### Advanced Features
- AI-suggested mission assignments based on kid's age/history
- Voice-activated mission acceptance ("Alexa, accept my missions")
- Apple Watch / smart watch integration
- Calendar sync for mission due dates
- Photo verification with AI (did they really clean the room?)
- Allowance auto-payment integration (Venmo, PayPal, Greenlight)
- Chore rotation automation
- Weather-based mission adjustments (rain = no lawn mowing)
- School schedule integration (more missions on weekends)
- Smart home integration (complete mission → earn smart light colors, game time unlock)

### Parent Tools
- Chore completion analytics and insights
- Family progress reports (weekly/monthly PDF exports)
- A/B test mission rewards (find optimal point values)
- Budget tracker for marketplace purchases
- Export data for taxes (if paying allowance)
- Multi-language support
- Customizable point values
- Age-based mission recommendations
- Printable mission checklists (for offline use)
- Batch mission creator

### Mobile Experience
- Native iOS/Android apps (React Native)
- Better push notifications
- Offline mode (complete missions without internet, sync later)
- Widget showing today's missions
- Lock screen mission reminders
- Barcode scanner (scan items for missions)

### Integrations
- Google Calendar / Apple Calendar sync
- Apple Home/Google Home integration
- IFTTT integration for automation
- Greenlight debit card (allowance automation)
- Educational platforms (Khan Academy, Duolingo missions)
- Fitness trackers (FitBit, Apple Health - exercise missions)

## Monetization Notes

### Revenue Streams

#### 1. Subscription Revenue (Predictable MRR)
**Tiered Pricing:**
- **Free Tier:** 1 kid, 5 active missions max, basic badges, family custom rewards only (no gift cards)
- **Basic Plan:** $7/month - 3 kids, unlimited missions, all badges, full gift card marketplace access
- **Premium Plan:** $12/month - Unlimited kids, priority support, advanced analytics, exclusive gift cards

**Recommended: Single Premium Tier**
- **Family Plan:** $7/month - Unlimited kids, all features, full marketplace access
- Simple, clear value proposition
- Easy to explain to parents

#### 2. Digital Gift Card Revenue (High-Margin Transactions)
**How It Works:**
- Kid earns points by completing missions (chores)
- Kid redeems points for gift cards in marketplace
- Parent pays cash to approve the reward
- You buy gift card from Tremendous API and deliver instantly

**Pricing Example:**
- Kid wants: $25 Roblox Gift Card
- Points required: 500 RP (proves they did the work)
- Parent pays: $35
- Your cost: $26.25 (Tremendous charges $25 + 5% fee)
- Stripe fee: $1.32 (3% of $35)
- Email cost: $0.001
- **Your profit:** $7.42 per transaction (21% margin)

**Why Parent Pays More Than Face Value:**
- Points are the "earning" mechanism (kid did chores)
- Parent pays for the actual reward
- $35 feels fair for $35 worth of chores done
- Kid gets $25 card, you keep $7.42 profit

**Alternative Lower-Price Model:**
- Parent pays: $30 (instead of $35)
- Your profit: $2.42 per transaction (8% margin)
- Lower margin but more attractive to parents
- Higher conversion rate

**Gift Card Catalog Tiers:**
- **Low tier:** $10 cards → Parent pays $15 → Profit $3
- **Mid tier:** $25 cards → Parent pays $35 → Profit $7.42
- **High tier:** $50 cards → Parent pays $65 → Profit $12
- **Premium tier:** $100 cards → Parent pays $125 → Profit $21

---

### Revenue Projections

#### Scenario: 1,000 Active Families

**Subscription Revenue:**
- 800 families @ $7/month = $5,600/month
- 200 families on free tier = $0
- **Total Subscription MRR:** $5,600/month = $67,200/year

**Digital Gift Card Revenue:**
- 50% of paid families redeem 1 card/month = 400 redemptions
- Average denomination: $25
- Average parent payment: $35
- Average profit per order: $7.42
- **Monthly gift card profit:** $2,968
- **Annual gift card profit:** $35,616

**Total Annual Revenue:** $102,816 from 1,000 families

#### Scenario: 5,000 Active Families

**Subscription Revenue:**
- 4,000 families @ $7/month = $28,000/month = $336,000/year
- 1,000 families free tier

**Digital Gift Card Revenue:**
- 50% redeem 1 card/month = 2,000 redemptions
- $7.42 average profit × 2,000 = $14,840/month
- **Annual gift card profit:** $178,080

**Total Annual Revenue:** $514,080 from 5,000 families

#### Scenario: 10,000 Active Families (Scale)

**Subscription Revenue:**
- 8,000 families @ $7/month = $56,000/month = $672,000/year

**Digital Gift Card Revenue:**
- 4,000 redemptions/month × $7.42 = $29,680/month
- **Annual gift card profit:** $356,160

**Total Annual Revenue:** $1,028,160/year

---

### Cost Structure

**Monthly Operating Costs (5,000 families):**
- Supabase Pro: $25/mo
- Vercel Pro: $20/mo
- SendGrid (10K emails): $20/mo
- Stripe fees (subscriptions): ~$1,000/mo (3% of $28K)
- Tremendous balance: $0 (pay as you go)
- Domain & misc: $20/mo
- Customer support: $100/mo (part-time)
- **Total fixed costs:** ~$1,185/mo

**Variable Costs:**
- Stripe fees on gift cards: Included in margin calculations
- Tremendous fees: Included in margin calculations
- Email delivery: $0.001 per email (negligible)

**Net Profit (5,000 families):**
- Total revenue: $42,840/month
- Operating costs: -$1,185/month
- **Net monthly profit:** $41,655
- **Annual net profit:** $499,860

**Profit Margins:**
- Subscription: 96% margin (SaaS standard)
- Gift cards: 21% margin (retail standard)
- **Blended margin:** 91% (incredible)

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
claude code "Create Mission Command: a military-themed chores app for kids. Use React, Vite, Tailwind CSS, and Supabase. Follow the design spec in DESIGN_SPEC.md for professional tactical styling."
```

Then iterate with these prompts:

**Phase 1: Core App (Week 1-2)**
- "Create the family enlistment flow where parents sign up and add kids as agents"
- "Build the Command Center dashboard showing active missions, points, rank"
- "Implement mission creation and assignment system for parents"
- "Add mission completion flow with parent verification"
- "Build the points and ranking system with level-up animations"
- "Create achievement badge system that auto-awards milestones"

**Phase 2: Digital Rewards Marketplace (Week 3-4)**
- "Build the gift card marketplace showing Roblox, Fortnite, Amazon cards"
- "Implement redemption flow: kid selects card, parent gets notification to approve"
- "Integrate Stripe for parent payment when approving gift card redemptions"
- "Integrate Tremendous API to purchase and deliver digital gift cards"
- "Create themed military email template for reward delivery"
- "Integrate SendGrid to send reward emails with gift codes"

**Phase 3: Polish & Launch (Week 5-6)**
- "Add family custom rewards (parent-created, no cost)"
- "Implement wishlist feature for gift cards"
- "Add redemption history page"
- "Create parent dashboard with family analytics"
- "Implement recurring missions (daily/weekly auto-create)"
- "Add push notifications for mission reminders and reward approvals"

**Key Implementation Notes:**
- Start with DESIGN_SPEC.md for exact visual styling (professional military aesthetic)
- Use TREMENDOUS_INTEGRATION.md for complete API integration guide
- Reference THEMES_SPEC.md for future theme expansion (not MVP)
- Start with Tremendous testflight (sandbox) and Stripe test mode
- Launch with 10-15 gift card brands, expand after validation

---

**Remember:** This is not just a chore app—it's an instant rewards platform that makes kids EXCITED to do chores because they can earn REAL Roblox and Fortnite gift cards. The military theme makes it feel cool and official. The instant email delivery makes it magical. Parents love it because kids actually do chores. You love it because you profit $7+ per transaction with 90%+ margins. MISSION SUCCESS! 🎖️
