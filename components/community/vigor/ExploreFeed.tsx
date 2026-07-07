'use client'

import { useState } from 'react'
import { Flame, TrendingUp, Users, Zap } from 'lucide-react'
import type { Post, User, PostCategory, Comment } from '@/lib/types'
import { PostCreator } from './PostCreator'
import { PostCard } from './PostCard'

interface ExploreFeedProps {
  posts: Post[]
  currentUser: User
  lang: 'ar' | 'en'
  onAddPost: (content: string, category: PostCategory, images: string[]) => void
  onLikePost: (postId: string) => void
  onLikeComment: (postId: string, commentId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onReportComment: (postId: string, commentId: string) => void
  onAddComment: (postId: string, content: string, parentId?: string) => void
  onViewProfile: (userId: string) => void
}

type FeedFilter = 'trending' | 'latest' | 'following'

const FILTER_OPTIONS: { value: FeedFilter; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
  { value: 'trending', labelAr: 'الأكثر تداولاً', labelEn: 'Trending', icon: <Flame className="w-3.5 h-3.5" /> },
  { value: 'latest', labelAr: 'الأحدث', labelEn: 'Latest', icon: <Zap className="w-3.5 h-3.5" /> },
  { value: 'following', labelAr: 'المتابَعون', labelEn: 'Following', icon: <Users className="w-3.5 h-3.5" /> },
]

export function ExploreFeed({
  posts, currentUser, lang,
  onAddPost, onLikePost, onLikeComment, onDeleteComment, onReportComment, onAddComment, onViewProfile,
}: ExploreFeedProps) {
  const [filter, setFilter] = useState<FeedFilter>('trending')

  const filteredPosts = [...posts].sort((a, b) => {
    if (filter === 'trending') return (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount)
    if (filter === 'latest') return b.createdAt.getTime() - a.createdAt.getTime()
    if (filter === 'following') return b.author.isFollowedByCurrentUser ? 1 : -1
    return 0
  })

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post creator */}
      <PostCreator currentUser={currentUser} onPost={onAddPost} lang={lang} />

      {/* Feed filter */}
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === opt.value
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
              }`}
            >
              {opt.icon}
              {lang === 'ar' ? opt.labelAr : opt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {filteredPosts.map(post => (
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
      ))}

      {filteredPosts.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {lang === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet'}
          </p>
        </div>
      )}
    </div>
  )
}
