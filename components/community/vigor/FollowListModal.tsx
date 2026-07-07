'use client'

import { useState, useMemo } from 'react'
import { X, Search, UserCheck, UserPlus, UserX } from 'lucide-react'
import type { User, Language } from '@/lib/types'
import { RankBadge } from './RankBadge'
import { USERS } from '@/lib/mock-data'

export type FollowListTab = 'followers' | 'following'

interface FollowListModalProps {
  user: User
  initialTab: FollowListTab
  lang: Language
  currentUser: User
  onClose: () => void
  onViewProfile: (userId: string) => void
  onFollowToggle: (userId: string) => void
}

// Derive mock follower/following lists from USERS based on flags
function getFollowers(user: User): User[] {
  // Users who follow this user = users whose isFollowedByCurrentUser means
  // currentUser follows them; for followers of user we use a mock heuristic:
  // users that the CURRENT_USER follows are shown as followers of the profile user
  if (user.isCurrentUser) {
    return USERS.filter(u => !u.isCurrentUser)
  }
  // For other profiles: return a subset of all users as followers
  return USERS.filter(u => u.id !== user.id).slice(0, Math.min(USERS.length - 1, 3))
}

function getFollowing(user: User): User[] {
  if (user.isCurrentUser) {
    return USERS.filter(u => u.isFollowedByCurrentUser && !u.isCurrentUser)
  }
  return USERS.filter(u => u.id !== user.id && u.isFollowedByCurrentUser).slice(0, 2)
}

export function FollowListModal({
  user, initialTab, lang, currentUser, onClose, onViewProfile, onFollowToggle,
}: FollowListModalProps) {
  const [tab, setTab]       = useState<FollowListTab>(initialTab)
  const [query, setQuery]   = useState('')
  // Track local follow state so the button updates instantly within modal
  const [followState, setFollowState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    USERS.forEach(u => { init[u.id] = u.isFollowedByCurrentUser })
    return init
  })

  const isRtl = lang === 'ar'

  const followers = useMemo(() => getFollowers(user), [user])
  const following  = useMemo(() => getFollowing(user), [user])
  const listRaw    = tab === 'followers' ? followers : following

  const list = useMemo(() => {
    if (!query.trim()) return listRaw
    const q = query.toLowerCase()
    return listRaw.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.displayNameAr.includes(q) ||
      u.username.toLowerCase().includes(q)
    )
  }, [listRaw, query])

  const handleFollowToggle = (targetId: string) => {
    setFollowState(prev => ({ ...prev, [targetId]: !prev[targetId] }))
    onFollowToggle(targetId)
  }

  const handleViewProfile = (targetId: string) => {
    onViewProfile(targetId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet — slides up on mobile, centered dialog on sm+ */}
      <div className="relative w-full max-w-sm bg-[#0B0F19] border border-border/60 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col">

        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0">
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-border/60" />
          </div>

          {/* Title + close */}
          <div className="flex items-center justify-between px-4 pb-3 pt-2 sm:pt-4 border-b border-border/40">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-foreground">
              {lang === 'ar'
                ? (user.isCurrentUser ? 'ملفي' : (lang === 'ar' ? user.displayNameAr : user.displayName))
                : (user.isCurrentUser ? 'My Profile' : user.displayName)}
            </h2>
            <div className="w-7" />
          </div>

          {/* Tabs — exactly like Instagram */}
          <div className="grid grid-cols-2 border-b border-border/40">
            {(['followers', 'following'] as FollowListTab[]).map(t => {
              const count = t === 'followers'
                ? (user.followersCount >= 1000 ? `${(user.followersCount / 1000).toFixed(1)}k` : user.followersCount)
                : (user.followingCount >= 1000 ? `${(user.followingCount / 1000).toFixed(1)}k` : user.followingCount)
              const labelAr = t === 'followers' ? 'متابعون' : 'يتابع'
              const labelEn = t === 'followers' ? 'Followers' : 'Following'
              return (
                <button
                  key={t}
                  onClick={() => { setTab(t); setQuery('') }}
                  className={`flex flex-col items-center gap-0.5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                    tab === t
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base font-bold font-mono">{count}</span>
                  <span className="text-xs">{lang === 'ar' ? labelAr : labelEn}</span>
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="px-3 py-2.5 border-b border-border/30">
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── List ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <UserX className="w-10 h-10 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">
                {query
                  ? (lang === 'ar' ? 'لا نتائج' : 'No results')
                  : (tab === 'followers'
                    ? (lang === 'ar' ? 'لا متابعين بعد' : 'No followers yet')
                    : (lang === 'ar' ? 'لا يتابع أحدًا' : 'Not following anyone')
                  )
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {list.map(u => {
                const isFollowing = followState[u.id] ?? u.isFollowedByCurrentUser
                const isMe = u.id === currentUser.id

                return (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                    {/* Avatar */}
                    <button onClick={() => handleViewProfile(u.id)} className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-border hover:ring-primary/40 transition-all"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0B0F19]" />
                      </div>
                    </button>

                    {/* Info */}
                    <button
                      onClick={() => handleViewProfile(u.id)}
                      className="flex-1 min-w-0 text-right"
                    >
                      <p className="text-sm font-semibold text-foreground leading-tight truncate">
                        {lang === 'ar' ? u.displayNameAr : u.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{u.username}</p>
                      <div className="mt-0.5">
                        <RankBadge rank={u.rank} size="sm" showLabel lang={lang} />
                      </div>
                    </button>

                    {/* Follow button — hidden for current user */}
                    {!isMe && (
                      <button
                        onClick={() => handleFollowToggle(u.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isFollowing
                            ? 'border border-border text-foreground hover:border-destructive/40 hover:text-destructive hover:bg-destructive/5'
                            : 'bg-primary text-primary-foreground hover:opacity-90'
                        }`}
                      >
                        {isFollowing
                          ? <><UserCheck className="w-3.5 h-3.5" />{lang === 'ar' ? 'متابَع' : 'Following'}</>
                          : <><UserPlus className="w-3.5 h-3.5" />{lang === 'ar' ? 'متابعة' : 'Follow'}</>
                        }
                      </button>
                    )}
                    {isMe && (
                      <span className="text-xs text-muted-foreground px-2 py-1 rounded-xl border border-border font-mono flex-shrink-0">
                        {lang === 'ar' ? 'أنت' : 'You'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
