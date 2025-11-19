-- Mission Command Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Families Table
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trial')),
  trial_ends_at TIMESTAMP WITH TIME ZONE
);

-- Users/Family Members Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('commander', 'lieutenant', 'agent')),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  avatar_url TEXT,
  agent_code TEXT NOT NULL UNIQUE,
  rank_points INTEGER DEFAULT 0,
  current_rank TEXT DEFAULT 'RECRUIT',
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions/Chores Table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  rank_points INTEGER DEFAULT 10,
  field_bonus DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Achievements/Badges Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL
);

-- Rank History Table
CREATE TABLE IF NOT EXISTS rank_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  old_rank TEXT,
  new_rank TEXT NOT NULL,
  ranked_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Photos Table
CREATE TABLE IF NOT EXISTS mission_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cost_in_points INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward Redemptions Table
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_spent INTEGER NOT NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Families Policies
CREATE POLICY "Users can view their own family"
  ON families FOR SELECT
  USING (id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Commanders can update their family"
  ON families FOR UPDATE
  USING (id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role IN ('commander', 'lieutenant')));

-- Users Policies
CREATE POLICY "Users can view members of their family"
  ON users FOR SELECT
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Commanders can insert family members"
  ON users FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role IN ('commander', 'lieutenant')));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Missions Policies
CREATE POLICY "Users can view missions from their family"
  ON missions FOR SELECT
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Commanders can create missions"
  ON missions FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role IN ('commander', 'lieutenant')));

CREATE POLICY "Commanders can update any mission"
  ON missions FOR UPDATE
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role IN ('commander', 'lieutenant')));

CREATE POLICY "Agents can update their own missions"
  ON missions FOR UPDATE
  USING (assigned_to = auth.uid());

-- Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (user_id = auth.uid());

-- Rewards Policies
CREATE POLICY "Users can view rewards in their family"
  ON rewards FOR SELECT
  USING (family_id IN (SELECT family_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Commanders can create rewards"
  ON rewards FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM users WHERE id = auth.uid() AND role IN ('commander', 'lieutenant')));

-- Reward Redemptions Policies
CREATE POLICY "Users can view their own redemptions"
  ON reward_redemptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can redeem rewards"
  ON reward_redemptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_users_family_id ON users(family_id);
CREATE INDEX idx_missions_family_id ON missions(family_id);
CREATE INDEX idx_missions_assigned_to ON missions(assigned_to);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_rewards_family_id ON rewards(family_id);
CREATE INDEX idx_reward_redemptions_user_id ON reward_redemptions(user_id);
