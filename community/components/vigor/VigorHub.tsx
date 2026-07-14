'use client'

import { useState, useCallback } from 'react'
import {
  Compass, User as UserIcon, Bell, Sun, Moon, Globe,
  Menu, X, Trophy
} from 'lucide-react'
import type {
  Post, User, AppNotification, MainTab, PostCategory, Comment, Language
} from '@/lib/community/types'

import {
  INITIAL_POSTS, INITIAL_NOTIFICATIONS, USERS, CURRENT_USER
} from '@/lib/community/mock-data'
import { ExploreFeed } from './ExploreFeed'
import { ProfileTab } from './ProfileTab'
import { NotificationsTab } from './NotificationsTab'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function deleteCommentById(comments: Comment[], targetId: string): Comment[] {
  return comments
    .filter(c => c.id !== targetId)
    .map(c => ({ ...c, replies: deleteCommentById(c.replies, targetId) }))
}

function likeCommentById(comments: Comment[], targetId: string): Comment[] {
  return comments.map(c => {
    if (c.id === targetId) {
      return {
        ...c,
        isLikedByCurrentUser: !c.isLikedByCurrentUser,
        likesCount: c.isLikedByCurrentUser ? c.likesCount - 1 : c.likesCount + 1,
      }
    }
    return { ...c, replies: likeCommentById(c.replies, targetId) }
  })
}

function addReplyToComment(
  comments: Comment[], parentId: string, newReply: Comment
): Comment[] {
  return comments.map(c => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, newReply] }
    }
    return { ...c, replies: addReplyToComment(c.replies, parentId, newReply) }
  })
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────
interface NavItemProps {
  icon: React.ReactNode
  labelAr: string
  labelEn: string
  isActive: boolean
  badge?: number
  onClick: () => void
  lang: Language
}

function NavItem({ icon, labelAr, labelEn, isActive, badge, onClick, lang }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/20 text-primary border border-primary/40 glow-emerald'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
      }`}
    >
      {icon}
      <span>{lang === 'ar' ? labelAr : labelEn}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold font-mono">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}

// ─── Main VigorHub Component ──────────────────────────────────────────────────
export function VigorHub() {
  const [activeTab, setActiveTab] = useState<MainTab>('explore')
  const [lang, setLang] = useState<Language>('ar')
  const [darkMode, setDarkMode] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [viewingUser, setViewingUser] = useState<User>(CURRENT_USER)
  const [users, setUsers] = useState<User[]>(USERS)
  const [currentUser] = useState<User>(CURRENT_USER)

  const unreadCount = notifications.filter(n => !n.isRead).length

  // ─── Tab & Profile navigation ───────────────────────────────────────────────
  const handleViewProfile = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setViewingUser(user)
      setActiveTab('profile')
    }
  }, [users])

  // ─── Post actions ────────────────────────────────────────────────────────────
  const handleAddPost = useCallback((content: string, category: PostCategory, images: string[]) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: currentUser.id,
      author: currentUser,
      content,
      category,
      images,
      likesCount: 0,
      isLikedByCurrentUser: false,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
      createdAt: new Date(),
    }
    setPosts(prev => [newPost, ...prev])
  }, [currentUser])

  const handleLikePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        isLikedByCurrentUser: !p.isLikedByCurrentUser,
        likesCount: p.isLikedByCurrentUser ? p.likesCount - 1 : p.likesCount + 1,
      }
    }))
  }, [])

  // ─── Comment actions ─────────────────────────────────────────────────────────
  const handleLikeComment = useCallback((postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, comments: likeCommentById(p.comments, commentId) }
    }))
  }, [])

  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const filtered = deleteCommentById(p.comments, commentId)
      return { ...p, comments: filtered, commentsCount: p.commentsCount - 1 }
    }))
  }, [])

  const handleReportComment = useCallback((_postId: string, commentId: string) => {
    // In production this would fire an API call
    console.log('[v0] Report submitted for comment:', commentId)
  }, [])

  const handleAddComment = useCallback((postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      parentCommentId: parentId ?? null,
      author: currentUser,
      authorId: currentUser.id,
      content,
      likesCount: 0,
      isLikedByCurrentUser: false,
      createdAt: new Date(),
      replies: [],
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      if (!parentId) {
        return { ...p, comments: [newComment, ...p.comments], commentsCount: p.commentsCount + 1 }
      }
      return {
        ...p,
        comments: addReplyToComment(p.comments, parentId, newComment),
        commentsCount: p.commentsCount + 1,
      }
    }))
  }, [currentUser])

  // ─── Notification actions ────────────────────────────────────────────────────
  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }, [])

  const handleFollowBack = useCallback((userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isFollowedByCurrentUser: true } : u
    ))
    setNotifications(prev => prev.map(n =>
      n.actor.id === userId ? { ...n, isRead: true } : n
    ))
    handleViewProfile(userId)
  }, [handleViewProfile])

  // ─── Profile update ──────────────────────────────────────────────────────────
  const handleUpdateProfile = useCallback((updated: Partial<User>) => {
    setUsers(prev => prev.map(u =>
      u.id === currentUser.id ? { ...u, ...updated } : u
    ))
    setViewingUser(prev =>
      prev.id === currentUser.id ? { ...prev, ...updated } : prev
    )
  }, [currentUser.id])

  // ─── Follow toggle ───────────────────────────────────────────────────────────
  const handleFollowToggle = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u
      const nowFollowing = !u.isFollowedByCurrentUser
      return {
        ...u,
        isFollowedByCurrentUser: nowFollowing,
        followersCount: nowFollowing ? u.followersCount + 1 : u.followersCount - 1,
      }
    }))
    setViewingUser(prev => {
      if (prev.id !== userId) return prev
      const nowFollowing = !prev.isFollowedByCurrentUser
      return {
        ...prev,
        isFollowedByCurrentUser: nowFollowing,
        followersCount: nowFollowing ? prev.followersCount + 1 : prev.followersCount - 1,
      }
    })
  }, [])

  // ─── Theme toggle ────────────────────────────────────────────────────────────
  const toggleDarkMode = () => {
    setDarkMode(p => {
      const next = !p
      // dark = default (no class). light = add 'light' class, remove 'dark'
      document.documentElement.classList.toggle('light', !next)
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  const isRtl = lang === 'ar'

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-emerald overflow-hidden">
              <img src="/logo.jpg" alt="VigorHub Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight glow-emerald-text">
              VigorHub
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem
              icon={<Compass className="w-4 h-4" />}
              labelAr="اكتشف"
              labelEn="Explore"
              isActive={activeTab === 'explore'}
              onClick={() => setActiveTab('explore')}
              lang={lang}
            />
            <NavItem
              icon={<UserIcon className="w-4 h-4" />}
              labelAr="ملفي"
              labelEn="My Profile"
              isActive={activeTab === 'profile' && viewingUser.isCurrentUser}
              onClick={() => { setViewingUser(currentUser); setActiveTab('profile') }}
              lang={lang}
            />
            <NavItem
              icon={<Bell className="w-4 h-4" />}
              labelAr="الإشعارات"
              labelEn="Notifications"
              isActive={activeTab === 'notifications'}
              badge={unreadCount}
              onClick={() => setActiveTab('notifications')}
              lang={lang}
            />
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors font-mono"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Current user avatar */}
            <button
              onClick={() => { setViewingUser(currentUser); setActiveTab('profile') }}
              className="relative"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/50 hover:ring-primary transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-[#0B0F19]" />
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(p => !p)}
              className="md:hidden p-2 rounded-xl border border-border text-muted-foreground"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 px-4 py-3 flex flex-col gap-1">
            {[
              { tab: 'explore' as MainTab, iconEl: <Compass className="w-4 h-4" />, ar: 'اكتشف', en: 'Explore', badge: 0 },
              { tab: 'profile' as MainTab, iconEl: <UserIcon className="w-4 h-4" />, ar: 'ملفي', en: 'My Profile', badge: 0 },
              { tab: 'notifications' as MainTab, iconEl: <Bell className="w-4 h-4" />, ar: 'الإشعارات', en: 'Notifications', badge: unreadCount },
            ].map(item => (
              <button
                key={item.tab}
                onClick={() => {
                  if (item.tab === 'profile') setViewingUser(currentUser)
                  setActiveTab(item.tab)
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.tab
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                {item.iconEl}
                {lang === 'ar' ? item.ar : item.en}
                {item.badge > 0 && (
                  <span className="mr-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── Main Content Layout ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <main>
          {activeTab === 'explore' && (
            <ExploreFeed
              posts={posts}
              currentUser={currentUser}
              lang={lang}
              onAddPost={handleAddPost}
              onLikePost={handleLikePost}
              onLikeComment={handleLikeComment}
              onDeleteComment={handleDeleteComment}
              onReportComment={handleReportComment}
              onAddComment={handleAddComment}
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              user={viewingUser}
              posts={posts}
              currentUser={currentUser}
              lang={lang}
              onFollowToggle={handleFollowToggle}
              onUpdateProfile={handleUpdateProfile}
              onLikePost={handleLikePost}
              onLikeComment={handleLikeComment}
              onDeleteComment={handleDeleteComment}
              onReportComment={handleReportComment}
              onAddComment={handleAddComment}
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              currentUser={currentUser}
              lang={lang}
              onMarkAllRead={handleMarkAllRead}
              onFollowBack={handleFollowBack}
              onViewProfile={handleViewProfile}
            />
          )}
        </main>
      </div>

      {/* ─── Mobile bottom nav ────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border/40 px-4 py-2">
        <div className="flex items-center justify-around">
          {[
            { tab: 'explore' as MainTab, icon: <Compass className="w-5 h-5" />, ar: 'اكتشف', en: 'Explore' },
            { tab: 'profile' as MainTab, icon: <UserIcon className="w-5 h-5" />, ar: 'ملفي', en: 'Profile' },
            { tab: 'notifications' as MainTab, icon: <Bell className="w-5 h-5" />, ar: 'الإشعارات', en: 'Notifs' },
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => {
                if (item.tab === 'profile') setViewingUser(currentUser)
                setActiveTab(item.tab)
              }}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                activeTab === item.tab ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs">{lang === 'ar' ? item.ar : item.en}</span>
              {item.tab === 'notifications' && unreadCount > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
