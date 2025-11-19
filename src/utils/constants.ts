// Mission Categories
export const MISSION_CATEGORIES = {
  CLEANING: { id: 'cleaning', label: 'CLEANING OPS', icon: '🧹' },
  DISHES: { id: 'dishes', label: 'KITCHEN DUTY', icon: '🍽️' },
  LAUNDRY: { id: 'laundry', label: 'LAUNDRY MISSION', icon: '👕' },
  PETS: { id: 'pets', label: 'PET CARE', icon: '🐕' },
  OUTDOOR: { id: 'outdoor', label: 'OUTDOOR OPERATIONS', icon: '🌳' },
  HOMEWORK: { id: 'homework', label: 'HOMEWORK PROTOCOL', icon: '📚' },
  ROOM: { id: 'room', label: 'ROOM INSPECTION', icon: '🛏️' },
  OTHER: { id: 'other', label: 'SPECIAL OPS', icon: '⭐' },
} as const

// Difficulty Levels
export const DIFFICULTY = {
  EASY: { id: 'easy', label: 'EASY', points: 10, color: 'mission-green' },
  MEDIUM: { id: 'medium', label: 'MEDIUM', points: 25, color: 'gold' },
  HARD: { id: 'hard', label: 'HARD', points: 50, color: 'mission-red' },
} as const

// Mission Statuses
export const MISSION_STATUS = {
  PENDING: { id: 'pending', label: 'READY', icon: '🟢', color: 'mission-green' },
  IN_PROGRESS: { id: 'in_progress', label: 'IN PROGRESS', icon: '🔵', color: 'mission-blue' },
  AWAITING_VERIFICATION: { id: 'awaiting_verification', label: 'AWAITING VERIFICATION', icon: '🟡', color: 'gold' },
  COMPLETED: { id: 'completed', label: 'MISSION ACCOMPLISHED', icon: '✅', color: 'tactical' },
  OVERDUE: { id: 'overdue', label: 'MISSION CRITICAL', icon: '🔴', color: 'mission-red' },
  VERIFIED: { id: 'verified', label: 'VERIFIED', icon: '⭐', color: 'gold-light' },
} as const

// Rank System
export const RANKS = [
  { id: 1, name: 'RECRUIT', minPoints: 0, maxPoints: 50, icon: '👶', color: 'gray' },
  { id: 2, name: 'JUNIOR AGENT', minPoints: 51, maxPoints: 150, icon: '🎖️', color: 'blue' },
  { id: 3, name: 'FIELD AGENT', minPoints: 151, maxPoints: 300, icon: '⭐', color: 'tactical' },
  { id: 4, name: 'ELITE AGENT', minPoints: 301, maxPoints: 500, icon: '💎', color: 'purple' },
  { id: 5, name: 'MASTER AGENT', minPoints: 501, maxPoints: 1000, icon: '🏆', color: 'gold' },
  { id: 6, name: 'LEGENDARY AGENT', minPoints: 1001, maxPoints: Infinity, icon: '👑', color: 'gold-light' },
]

// Achievement Badges
export const ACHIEVEMENTS = {
  FIRST_MISSION: {
    id: 'first_mission',
    name: 'First Mission',
    description: 'Complete your first mission',
    icon: '🥇',
    requirement: 1,
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: '7-day streak',
    icon: '🔥',
    requirement: 7,
  },
  CENTURY_CLUB: {
    id: 'century_club',
    name: 'Century Club',
    description: 'Earn 100 points',
    icon: '💯',
    requirement: 100,
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete mission before due date 5 times',
    icon: '⏰',
    requirement: 5,
  },
  PHOTO_PROOF_PRO: {
    id: 'photo_proof_pro',
    name: 'Photo Proof Pro',
    description: 'Upload 10 mission photos',
    icon: '📸',
    requirement: 10,
  },
  CLEAN_SWEEP: {
    id: 'clean_sweep',
    name: 'Clean Sweep',
    description: 'Complete all missions in a week',
    icon: '🧽',
    requirement: 1,
  },
  SPEEDSTER: {
    id: 'speedster',
    name: 'Speedster',
    description: 'Complete 5 missions in one day',
    icon: '🚀',
    requirement: 5,
  },
  SHARPSHOOTER: {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: '10 missions completed early',
    icon: '🎯',
    requirement: 10,
  },
  ALL_STAR: {
    id: 'all_star',
    name: 'All-Star',
    description: 'Reach Elite Agent rank',
    icon: '🌟',
    requirement: 1,
  },
}

// User Roles
export const ROLES = {
  COMMANDER: 'commander',
  LIEUTENANT: 'lieutenant',
  AGENT: 'agent',
} as const

// Recurrence Patterns
export const RECURRENCE_PATTERNS = {
  DAILY: 'daily',
  WEEKLY_MONDAY: 'weekly_monday',
  WEEKLY_TUESDAY: 'weekly_tuesday',
  WEEKLY_WEDNESDAY: 'weekly_wednesday',
  WEEKLY_THURSDAY: 'weekly_thursday',
  WEEKLY_FRIDAY: 'weekly_friday',
  WEEKLY_SATURDAY: 'weekly_saturday',
  WEEKLY_SUNDAY: 'weekly_sunday',
  WEEKLY_WEEKEND: 'weekly_weekend',
  WEEKLY_WEEKDAY: 'weekly_weekday',
}
