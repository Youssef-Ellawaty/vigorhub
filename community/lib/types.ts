// ─── Commitment Rank Tiers ───────────────────────────────────────────────────
export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Vigor Champion'

export interface CommitmentRank {
  tier: RankTier
  label: string
  labelAr: string
  emoji: string
  color: string
  xp: number
  maxXp: number
}

// ─── Post Category Tags ───────────────────────────────────────────────────────
export type PostCategory = 'Bulk' | 'Cut' | 'Form Check' | 'Motivation' | 'PR'

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  username: string
  displayName: string
  displayNameAr: string
  avatar: string
  coverImage: string
  bio: string
  bioAr: string
  rank: CommitmentRank
  isAdmin: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowedByCurrentUser: boolean
  isCurrentUser: boolean
  xp: number
}

// ─── Comment ──────────────────────────────────────────────────────────────────
export interface Comment {
  id: string
  postId: string
  parentCommentId: string | null
  authorId: string
  author: User
  content: string
  likesCount: number
  isLikedByCurrentUser: boolean
  createdAt: Date
  replies: Comment[]
}

// ─── Post ─────────────────────────────────────────────────────────────────────
export interface Post {
  id: string
  authorId: string
  author: User
  content: string
  category: PostCategory
  images: string[]
  likesCount: number
  isLikedByCurrentUser: boolean
  commentsCount: number
  sharesCount: number
  comments: Comment[]
  createdAt: Date
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType = 'follow' | 'like' | 'comment' | 'reply'

export interface AppNotification {
  id: string
  type: NotificationType
  actor: User
  postId?: string
  commentId?: string
  isRead: boolean
  createdAt: Date
}

// ─── Leaderboard Entry ────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number
  user: User
  workoutsThisMonth: number
  currentStreak: number
}

// ─── League / Tournament ──────────────────────────────────────────────────────
export type LeagueType = 'gym' | 'friends' | 'challenge'
export type LeagueScoringMetric = 'xp' | 'workouts' | 'streak'

export interface LeagueMember {
  user: User
  score: number          // value for the chosen metric
  rank: number
  joinedAt: Date
}

export interface League {
  id: string
  inviteCode: string     // 6-char uppercase alphanumeric — required to join
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  type: LeagueType
  scoringMetric: LeagueScoringMetric
  createdBy: User
  members: LeagueMember[]
  createdAt: Date
  endsAt: Date | null    // null = ongoing
  isCurrentUserMember: boolean
}

// ─── App State ────────────────────────────────────────────────────────────────
export type MainTab = 'explore' | 'profile' | 'notifications' | 'leaderboard'
export type ProfileView = 'grid' | 'timeline'
export type Language = 'ar' | 'en'
