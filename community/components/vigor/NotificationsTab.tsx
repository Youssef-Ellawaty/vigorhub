'use client'

import { UserPlus, Heart, MessageCircle, CornerDownRight, CheckCheck, User } from 'lucide-react'
import type { AppNotification, User as UserType } from '@/lib/types'
import { RankBadge } from './RankBadge'

interface NotificationsTabProps {
  notifications: AppNotification[]
  currentUser: UserType
  lang: 'ar' | 'en'
  onMarkAllRead: () => void
  onFollowBack: (userId: string) => void
  onViewProfile: (userId: string) => void
}

function timeAgo(date: Date, lang: 'ar' | 'en'): string {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return lang === 'ar' ? 'الآن' : 'now'
  if (diff < 3600) return lang === 'ar' ? `${Math.floor(diff / 60)} دق` : `${Math.floor(diff / 60)}m`
  if (diff < 86400) return lang === 'ar' ? `${Math.floor(diff / 3600)} ساعة` : `${Math.floor(diff / 3600)}h`
  return lang === 'ar' ? `${Math.floor(diff / 86400)} يوم` : `${Math.floor(diff / 86400)}d`
}

const TYPE_CONFIG = {
  follow: {
    icon: UserPlus,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    getTextAr: (actor: UserType) => `بدأ ${actor.displayNameAr} بمتابعتك`,
    getTextEn: (actor: UserType) => `${actor.displayName} started following you`,
  },
  like: {
    icon: Heart,
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/15',
    borderClass: 'border-rose-500/30',
    getTextAr: (actor: UserType) => `أعجب ${actor.displayNameAr} بمنشورك`,
    getTextEn: (actor: UserType) => `${actor.displayName} liked your post`,
  },
  comment: {
    icon: MessageCircle,
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/15',
    borderClass: 'border-cyan-500/30',
    getTextAr: (actor: UserType) => `علّق ${actor.displayNameAr} على منشورك`,
    getTextEn: (actor: UserType) => `${actor.displayName} commented on your post`,
  },
  reply: {
    icon: CornerDownRight,
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    getTextAr: (actor: UserType) => `ردّ ${actor.displayNameAr} على تعليقك`,
    getTextEn: (actor: UserType) => `${actor.displayName} replied to your comment`,
  },
}

interface NotificationItemProps {
  notif: AppNotification
  lang: 'ar' | 'en'
  onFollowBack: (userId: string) => void
  onViewProfile: (userId: string) => void
}

function NotificationItem({ notif, lang, onFollowBack, onViewProfile }: NotificationItemProps) {
  const config = TYPE_CONFIG[notif.type]
  const IconComponent = config.icon

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
      notif.isRead
        ? 'glass opacity-60 hover:opacity-80'
        : 'bg-primary/5 border border-primary/20 shadow-lg shadow-primary/5'
    }`}>
      {/* Notification type icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border ${config.bgClass} ${config.borderClass}`}>
        <IconComponent className={`w-4 h-4 ${config.colorClass}`} />
      </div>

      {/* Actor avatar */}
      <button onClick={() => onViewProfile(notif.actor.id)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
        <img
          src={notif.actor.avatar}
          alt={notif.actor.displayName}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <button
            onClick={() => onViewProfile(notif.actor.id)}
            className="font-bold hover:text-primary transition-colors"
          >
            {lang === 'ar' ? notif.actor.displayNameAr : notif.actor.displayName}
          </button>
          {' '}
          <span className="text-foreground/70">
            {lang === 'ar'
              ? config.getTextAr(notif.actor).replace(/^[^ ]+ /, '')
              : config.getTextEn(notif.actor).replace(/^[^ ]+ /, '')}
          </span>
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <RankBadge rank={notif.actor.rank} size="sm" showLabel={false} />
          <span className="text-xs text-muted-foreground font-mono">{timeAgo(notif.createdAt, lang)}</span>
          {!notif.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </div>
      </div>

      {/* CTA actions */}
      {notif.type === 'follow' && (
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={() => onFollowBack(notif.actor.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all glow-emerald whitespace-nowrap"
          >
            <UserPlus className="w-3 h-3" />
            {lang === 'ar' ? 'رد الفولو' : 'Follow Back'}
          </button>
          <button
            onClick={() => onViewProfile(notif.actor.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors whitespace-nowrap"
          >
            <User className="w-3 h-3" />
            {lang === 'ar' ? 'الملف' : 'Profile'}
          </button>
        </div>
      )}
      {notif.type !== 'follow' && (
        <button
          onClick={() => onViewProfile(notif.actor.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex-shrink-0"
        >
          <User className="w-3 h-3" />
          {lang === 'ar' ? 'الملف' : 'Profile'}
        </button>
      )}
    </div>
  )
}

export function NotificationsTab({
  notifications, currentUser, lang,
  onMarkAllRead, onFollowBack, onViewProfile,
}: NotificationsTabProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length
  const newNotifs = notifications.filter(n => !n.isRead)
  const readNotifs = notifications.filter(n => n.isRead)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
          </h2>
          {unreadCount > 0 && (
            <p className="text-sm text-primary font-mono">
              {unreadCount} {lang === 'ar' ? 'إشعار جديد' : 'new notification(s)'}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            {lang === 'ar' ? 'قراءة الكل' : 'Mark all read'}
          </button>
        )}
      </div>

      {/* New notifications */}
      {newNotifs.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3 px-1">
            {lang === 'ar' ? '— جديد —' : '— NEW —'}
          </p>
          <div className="space-y-2">
            {newNotifs.map(n => (
              <NotificationItem
                key={n.id}
                notif={n}
                lang={lang}
                onFollowBack={onFollowBack}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Read notifications */}
      {readNotifs.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3 px-1">
            {lang === 'ar' ? '— سابقاً —' : '— EARLIER —'}
          </p>
          <div className="space-y-2">
            {readNotifs.map(n => (
              <NotificationItem
                key={n.id}
                notif={n}
                lang={lang}
                onFollowBack={onFollowBack}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <CheckCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications yet'}
          </p>
        </div>
      )}
    </div>
  )
}
