'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Post, User } from '@/lib/types'
import { RankBadge } from './RankBadge'
import { CommentThread } from './CommentThread'

interface PostCardProps {
  post: Post
  currentUser: User
  lang: 'ar' | 'en'
  onLikePost: (postId: string) => void
  onLikeComment: (postId: string, commentId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onReportComment: (postId: string, commentId: string) => void
  onAddComment: (postId: string, content: string, parentId?: string) => void
  onViewProfile: (userId: string) => void
}

function timeAgo(date: Date, lang: 'ar' | 'en'): string {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return lang === 'ar' ? 'الآن' : 'now'
  if (diff < 3600) return lang === 'ar' ? `منذ ${Math.floor(diff / 60)} دقيقة` : `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return lang === 'ar' ? `منذ ${Math.floor(diff / 3600)} ساعة` : `${Math.floor(diff / 3600)}h ago`
  return lang === 'ar' ? `منذ ${Math.floor(diff / 86400)} يوم` : `${Math.floor(diff / 86400)}d ago`
}

const CATEGORY_STYLES: Record<string, string> = {
  Bulk: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  Cut: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
  'Form Check': 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  Motivation: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  PR: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
}

const CATEGORY_LABELS_AR: Record<string, string> = {
  Bulk: 'ضخامة', Cut: 'تقطيع', 'Form Check': 'فورم تشيك',
  Motivation: 'تحفيز', PR: 'رقم قياسي',
}

export function PostCard({
  post, currentUser, lang,
  onLikePost, onLikeComment, onDeleteComment, onReportComment, onAddComment, onViewProfile,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  return (
    <article className="glass rounded-2xl overflow-hidden mb-4 hover:border-primary/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => onViewProfile(post.author.id)}
          className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className="relative flex-shrink-0">
            <img
              src={post.author.avatar}
              alt={post.author.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0F19]" />
          </div>
          <div className="text-right min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground truncate">
                {lang === 'ar' ? post.author.displayNameAr : post.author.displayName}
              </span>
              {post.author.isAdmin && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono flex-shrink-0">
                  ADMIN
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <RankBadge rank={post.author.rank} size="sm" lang={lang} />
              <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt, lang)}</span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_STYLES[post.category]}`}>
            {lang === 'ar' ? CATEGORY_LABELS_AR[post.category] : post.category}
          </span>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p
          className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <img
              src={post.images[imgIndex]}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          </div>
          {post.images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex(p => Math.max(0, p - 1))}
                disabled={imgIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImgIndex(p => Math.min(post.images.length - 1, p + 1))}
                disabled={imgIndex === post.images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {post.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-primary w-3' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Engagement bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLikePost(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${
              post.isLikedByCurrentUser ? 'text-rose-400' : 'text-muted-foreground hover:text-rose-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLikedByCurrentUser ? 'fill-rose-400' : ''}`} />
            <span className="font-mono text-xs">{formatCount(post.likesCount)}</span>
          </button>
          <button
            onClick={() => setShowComments(p => !p)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-mono text-xs">{post.commentsCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="font-mono text-xs">{formatCount(post.sharesCount)}</span>
          </button>
        </div>
      </div>

      {/* Comments panel */}
      {showComments && (
        <CommentThread
          comments={post.comments}
          postAuthorId={post.authorId}
          postId={post.id}
          currentUser={currentUser}
          lang={lang}
          onLikeComment={onLikeComment}
          onDeleteComment={onDeleteComment}
          onReportComment={onReportComment}
          onAddComment={onAddComment}
        />
      )}
    </article>
  )
}
