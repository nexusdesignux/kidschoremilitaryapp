# Demo Mode - Test Accounts

The app includes a built-in demo mode that allows you to explore all features without needing to set up Supabase!

## How to Use Demo Mode

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Click on any of the demo account cards to auto-fill credentials
4. Click "ACCESS COMMAND CENTER" to login

## Available Demo Accounts

### Commander Account (Parent View)
- **Email**: `commander@demo.com`
- **Password**: `demo123`
- **Name**: Sarah Johnson
- **Role**: Commander (Parent)
- **Features**: Full access to create missions, verify completions, manage agents, create rewards

### Agent Account 1 (Kid View)
- **Email**: `agent1@demo.com`
- **Password**: `demo123`
- **Name**: Tommy Johnson
- **Role**: Agent (Kid)
- **Rank**: Field Agent (245 points)
- **Features**: View assigned missions, complete missions, redeem rewards, track progress

### Agent Account 2 (Kid View)
- **Email**: `agent2@demo.com`
- **Password**: `demo123`
- **Name**: Emma Johnson
- **Role**: Agent (Kid)
- **Rank**: Junior Agent (125 points)
- **Features**: View assigned missions, complete missions, redeem rewards, track progress

## Demo Data Included

### Missions (6 total)
1. **Operation: Clean Room** - Pending, assigned to Tommy, Medium difficulty (25 points)
2. **Mission: Take Out Trash** - In Progress, assigned to Emma, Easy difficulty (10 points)
3. **Kitchen Duty: Dishes** - Awaiting Verification, assigned to Tommy, Medium difficulty (25 points)
4. **Homework Protocol** - Completed, assigned to Emma, Hard difficulty (50 points)
5. **Pet Care: Feed Max** - Completed, assigned to Tommy, Easy difficulty (10 points)
6. **Outdoor Operations: Mow Lawn** - Pending, Unassigned, Hard difficulty (50 points, $5 bonus)

### Achievements (4 badges earned)
- Tommy: First Mission, Week Warrior, Century Club
- Emma: First Mission

### Rewards (4 available)
- Ice Cream Trip (50 points)
- Extra Screen Time 30 min (30 points)
- Movie Night Pick (75 points)
- New Toy $20 budget (200 points)

## What You Can Test

### As Commander
- ✅ View all family missions across all agents
- ✅ See mission statistics (active, completed, overdue)
- ✅ View all agents and their progress
- ✅ Access family settings
- ✅ Browse rewards store
- ✅ View leaderboard/rankings

### As Agent (Kid)
- ✅ View your assigned missions only
- ✅ See your rank and points progress
- ✅ View personal achievement badges
- ✅ Check streak counter
- ✅ Browse available rewards
- ✅ See points needed to next rank

## Switching Between Accounts

1. Logout from current account (click "EXIT" in header)
2. You'll return to the login page
3. Select a different demo account
4. Login to explore from that perspective

## Demo Mode Features

- All data is stored in browser localStorage (persists across page refreshes)
- No Supabase setup required
- Perfect for testing, demos, and exploration
- Real-time mission filtering based on role
- Fully functional UI with all animations and interactions

## Limitations

Demo mode is read-only for most operations to showcase the UI. The following features show placeholder data but don't persist changes:
- Creating new missions
- Completing missions
- Redeeming rewards
- Adding new agents
- Updating profiles

For full functionality including database persistence, follow the setup guide in `README_SETUP.md` to configure Supabase.

---

**Enjoy exploring Mission Command!** 🎖️
