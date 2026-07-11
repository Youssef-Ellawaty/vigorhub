'use client'

import { useState } from 'react'
import { Grid3x3, LayoutList, UserCheck, UserPlus, Share2, Zap } from 'lucide-react'
import type { User, Post, ProfileView, Language } from '@/lib/community/types'
import { RankBadge } from './RankBadge'
import { PostCard } from './PostCard'
import { EditProfileModal } from './EditProfileModal'
import { FollowListModal, type FollowListTab } from './FollowListModal'
import { PROFILE_GRID_IMAGES } from '@/lib/community/mock-data'

interface ProfileTabProps {
  user: User
  posts: Post[]
  currentUser: User
  lang: Language
  onFollowToggle: (userId: string) => void
  onUpdateProfile: (updated: Partial<User>) => void
  onLikePost: (postId: string) => void
  onLikeComment: (postId: string, commentId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onReportComment: (postId: string, commentId: string) => void
  onAddComment: (postId: string, content: string, parentId?: string) => void
  onViewProfile: (userId: string) => void
}

function StatCounter({
  label, labelAr, value, lang, onClick,
}: {
  label: string
  labelAr: string
  value: number
  lang: Language
  onClick?: () => void
}) {
  const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity w-full py-3"
    >
      <span className="text-xl font-bold text-foreground font-mono">{formatted}</span>
      <span className="text-xs text-muted-foreground">{lang === 'ar' ? labelAr : label}</span>
    </button>
  )
}

export function ProfileTab({
  user, posts, currentUser, lang,
  onFollowToggle, onUpdateProfile,
  onLikePost, onLikeComment, onDeleteComment, onReportComment, onAddComment, onViewProfile,
}: ProfileTabProps) {
  const [view, setView]               = useState<ProfileView>('grid')
  const [followers, setFollowers]     = useState(user.followersCount)
  const [isFollowing, setIsFollowing] = useState(user.isFollowedByCurrentUser)
  const [showEdit, setShowEdit]       = useState(false)
  const [followModal, setFollowModal] = useState<FollowListTab | null>(null)

  const userPosts  = posts.filter(p => p.authorId === user.id)
  const isOwnProfile = user.id === currentUser.id

  const xpPercent = Math.min(100, ((user.xp - user.rank.xp) / (user.rank.maxXp - user.rank.xp)) * 100)

  const handleFollowToggle = () => {
    const nowFollowing = !isFollowing
    setIsFollowing(nowFollowing)
    setFollowers(prev => nowFollowing ? prev + 1 : prev - 1)
    onFollowToggle(user.id)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ─── Modals ────────────────────────────────────────────────────────── */}
      {showEdit && isOwnProfile && (
        <EditProfileModal
          user={currentUser}
          lang={lang}
          onSave={onUpdateProfile}
          onClose={() => setShowEdit(false)}
        />
      )}

      {followModal && (
        <FollowListModal
          user={user}
          initialTab={followModal}
          lang={lang}
          currentUser={currentUser}
          onClose={() => setFollowModal(null)}
          onViewProfile={onViewProfile}
          onFollowToggle={onFollowToggle}
        />
      )}

      {/* ─── Cover ─────────────────────────────────────────────────────────── */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-16">
        <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/80 to-transparent" />

        {/* Avatar */}
        <div className="absolute -bottom-12 right-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full ring-4 ring-primary overflow-hidden">
              <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0B0F19]" />
          </div>
        </div>
      </div>

      {/* ─── Profile info card ─────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-4 mb-4">
        {/* Name + actions row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">
                {lang === 'ar' ? user.displayNameAr : user.displayName}
              </h2>
              {user.isAdmin && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{user.username}</p>
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-secondary/40 transition-all"
              >
                {lang === 'ar' ? 'تعديل الملف' : 'Edit profile'}
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  isFollowing
                    ? 'border border-primary/40 text-primary bg-primary/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {isFollowing
                  ? <><UserCheck className="w-4 h-4" />{lang === 'ar' ? 'متابَع' : 'Following'}</>
                  : <><UserPlus className="w-4 h-4" />{lang === 'ar' ? 'متابعة' : 'Follow'}</>
                }
              </button>
            )}
            <button className="p-1.5 rounded-xl border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-foreground/80 leading-relaxed mb-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' ? user.bioAr : user.bio}
        </p>

        {/* Rank + XP bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <RankBadge rank={user.rank} size="md" lang={lang} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Zap className="w-3 h-3 text-primary" />
              <span>{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${xpPercent}%`,
                background: `linear-gradient(90deg, ${user.rank.color}, #10b981)`,
                boxShadow: `0 0 8px ${user.rank.color}60`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user.xp.toLocaleString()} / {user.rank.maxXp.toLocaleString()} XP
            {lang === 'ar' ? ' للمستوى التالي' : ' to next level'}
          </p>
        </div>

        {/* Stats — tapping followers/following opens the modal */}
        <div className="grid grid-cols-3 divide-x divide-border/40 border border-border/40 rounded-xl overflow-hidden">
          <StatCounter
            label="Posts" labelAr="منشور"
            value={userPosts.length} lang={lang}
          />
          <StatCounter
            label="Followers" labelAr="متابع"
            value={followers} lang={lang}
            onClick={() => setFollowModal('followers')}
          />
          <StatCounter
            label="Following" labelAr="يتابع"
            value={user.followingCount} lang={lang}
            onClick={() => setFollowModal('following')}
          />
        </div>
      </div>

      {/* ─── Content toggle ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setView('grid')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === 'grid'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'text-muted-foreground border border-border hover:border-primary/20'
          }`}
        >
          <Grid3x3 className="w-4 h-4" />
          {lang === 'ar' ? 'شبكة' : 'Grid'}
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === 'timeline'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'text-muted-foreground border border-border hover:border-primary/20'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          {lang === 'ar' ? 'خط زمني' : 'Timeline'}
        </button>
      </div>

      {/* ─── Grid view ─────────────────────────────────────────────────────── */}
      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden mb-4">
          {PROFILE_GRID_IMAGES.map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden group cursor-pointer relative">
              <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-mono">{Math.floor(Math.random() * 200 + 50)} ♥</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Timeline view ─────────────────────────────────────────────────── */}
      {view === 'timeline' && (
        <div>
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                lang={lang}
                onLikePost={onLikePost}
                onLikeComment={onLikeComment}
                onDeleteComment={onDeleteComment}
                onReportComment={onReportComment}
                onAddComment={onAddComment}
                onViewProfile={onViewProfile}
              />
            ))
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-sm">
                {lang === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
