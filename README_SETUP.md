# Mission Command - Setup Guide

A military-themed gamified chores app for kids built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `supabase-schema.sql`
4. Go to **Project Settings** > **API** and copy:
   - Project URL
   - Anon/Public Key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## Features Implemented

### Phase 1 - Core Functionality
- ✅ Family enlistment & authentication
- ✅ Command Center dashboard (Commander & Agent views)
- ✅ Mission components (cards, lists)
- ✅ Points & ranking system
- ✅ Agent profiles with rank badges
- ✅ Rewards store placeholder
- ✅ Military-themed UI with custom styling
- ✅ Responsive layout with sidebar navigation

### Database Schema
- ✅ Families table
- ✅ Users/Agents table
- ✅ Missions/Chores table
- ✅ Achievements table
- ✅ Rewards table
- ✅ Reward redemptions table
- ✅ Row Level Security (RLS) policies

## Next Steps

### To Complete the App:

1. **Mission Management**
   - Add mission creation modal/form
   - Implement mission status updates
   - Add photo upload for mission proof
   - Build mission verification flow

2. **Achievements System**
   - Create achievement checking logic
   - Build badge display components
   - Add celebration animations

3. **Rewards System**
   - Build reward creation form
   - Implement point redemption logic
   - Add redemption history

4. **Real-time Features**
   - Set up Supabase real-time subscriptions
   - Add live mission updates
   - Implement push notifications

5. **Stripe Integration**
   - Set up Stripe account
   - Implement checkout flow
   - Add webhook handlers
   - Build billing management page

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── missions/        # Mission-related components
│   ├── agents/          # Agent/user components
│   └── dashboard/       # Dashboard widgets
├── pages/               # Main application pages
├── lib/                 # Third-party library configs
├── store/               # Zustand state management
├── utils/               # Utility functions
└── App.tsx              # Main app component
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Database & Auth**: Supabase
- **Animations**: canvas-confetti
- **Date Handling**: date-fns

## Design Aesthetic

- **Theme**: Kid-friendly secret agent HQ
- **Colors**:
  - Navy (#1a2332) - Primary background
  - Tactical Green (#3d8b40) - Action colors
  - Gold (#ffc107) - Achievements & highlights
  - Mission colors for status indicators
- **Fonts**:
  - Headers: Bangers, Bebas Neue
  - Body: Inter

## Key Concepts

### Terminology
- Chore → **Mission**
- Parent → **Commander**
- Kid → **Agent**
- Complete → **Mission Accomplished**
- Points → **Rank Points**
- Rewards → **Commendations**

### Ranks (Progressive)
1. 👶 Recruit (0-50 points)
2. 🎖️ Junior Agent (51-150 points)
3. ⭐ Field Agent (151-300 points)
4. 💎 Elite Agent (301-500 points)
5. 🏆 Master Agent (501-1000 points)
6. 👑 Legendary Agent (1000+ points)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Support

For issues or questions, refer to:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Mission Success!** 🎖️
