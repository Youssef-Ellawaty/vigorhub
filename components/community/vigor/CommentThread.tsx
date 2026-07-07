'use client'

import { useState } from 'react'
import { Heart, Trash2, CornerDownRight, Send, Flag } from 'lucide-react'
import type { Comment, User } from '@/lib/types'
import { RankBadge } from './RankBadge'

interface CommentItemProps {
  comment: Comment
  postAuthorId: string
  currentUser: User
  depth?: number
  lang: 'ar' | 'en'
  onLike: (commentId: string) => void
  onDelete: (commentId: string) => void
  onReport: (commentId: string) => void
  onReply: (commentId: string, content: string) => void
}

function timeAgo(date: Date, lang: 'ar' | 'en'): string {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return lang === 'ar' ? 'الآن' : 'now'
  if (diff < 3600) return lang === 'ar' ? `${Math.floor(diff / 60)}د` : `${Math.floor(diff / 60)}m`
  if (diff < 86400) return lang === 'ar' ? `${Math.floor(diff / 3600)}س` : `${Math.floor(diff / 3600)}h`
  return lang === 'ar' ? `${Math.floor(diff / 86400)}ي` : `${Math.floor(diff / 86400)}d`
}

function CommentItem({
  comment, postAuthorId, currentUser, depth = 0, lang,
  onLike, onDelete, onReport, onReply,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState(true)

  const canDelete =
    comment.authorId === currentUser.id ||
    postAuthorId === currentUser.id ||
    currentUser.isAdmin

  const handleReply = () => {
    if (!replyContent.trim()) return
    onReply(comment.id, replyContent.trim())
    setReplyContent('')
    setShowReplyInput(false)
  }

  return (
    <div className={`${depth > 0 ? 'mr-6 border-r border-border/40 pr-3' : ''}`}>
      <div className="flex gap-2.5 py-2.5 group">
        <img
          src={comment.author.avatar}
          alt={comment.author.displayName}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-primary/20"
        />
        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-foreground">
              {lang === 'ar' ? comment.author.displayNameAr : comment.author.displayName}
            </span>
            <RankBadge rank={comment.author.rank} size="sm" showLabel={false} />
            <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt, lang)}</span>
            {comment.author.isAdmin && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                ADMIN
              </span>
            )}
          </div>
          {/* Content */}
          <p className="text-sm text-foreground/90 leading-relaxed" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {comment.content}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.isLikedByCurrentUser ? 'text-rose-400' : 'text-muted-foreground hover:text-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.isLikedByCurrentUser ? 'fill-rose-400' : ''}`} />
              <span>{comment.likesCount}</span>
            </button>
            {depth === 0 && (
              <button
                onClick={() => setShowReplyInput(p => !p)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'رد' : 'Reply'}
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'حذف' : 'Delete'}
              </button>
            )}
            {currentUser.isAdmin && (
              <button
                onClick={() => onReport(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Flag className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'إبلاغ' : 'Report'}
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="flex items-center gap-2 mt-2">
              <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              <div className="flex-1 flex items-center gap-2 bg-input rounded-full px-3 py-1.5 border border-border">
                <input
                  type="text"
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleReply()
                  }}
                  placeholder={lang === 'ar' ? 'أضف ردك...' : 'Add a reply...'}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button onClick={handleReply} disabled={!replyContent.trim()} className="text-primary disabled:opacity-40">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div>
          <button
            onClick={() => setShowReplies(p => !p)}
            className="text-xs text-primary/80 hover:text-primary ml-9 mb-1 transition-colors"
          >
            {showReplies
              ? lang === 'ar' ? 'إخفاء الردود' : 'Hide replies'
              : lang === 'ar' ? `عرض ${comment.replies.length} ردود` : `View ${comment.replies.length} replies`}
          </button>
          {showReplies && comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              currentUser={currentUser}
              depth={depth + 1}
              lang={lang}
              onLike={onLike}
              onDelete={onDelete}
              onReport={onReport}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentThreadProps {
  comments: Comment[]
  postAuthorId: string
  postId: string
  currentUser: User
  lang: 'ar' | 'en'
  onLikeComment: (postId: string, commentId: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onReportComment: (postId: string, commentId: string) => void
  onAddComment: (postId: string, content: string, parentId?: string) => void
}

export function CommentThread({
  comments, postAuthorId, postId, currentUser, lang,
  onLikeComment, onDeleteComment, onReportComment, onAddComment,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('')

  const handleAddTop = () => {
    if (!newComment.trim()) return
    onAddComment(postId, newComment.trim())
    setNewComment('')
  }

  return (
    <div className="border-t border-border/40 pt-3 mt-1">
      {/* Top-level comment input */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
        <div className="flex-1 flex items-center gap-2 bg-input rounded-full px-3 py-2 border border-border focus-within:border-primary/40 transition-colors">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddTop()
            }}
            placeholder={lang === 'ar' ? 'أضف تعليقاً...' : 'Add a comment...'}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={handleAddTop} disabled={!newComment.trim()} className="text-primary disabled:opacity-40">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="px-4 max-h-80 overflow-y-auto space-y-0.5">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postAuthorId={postAuthorId}
            currentUser={currentUser}
            depth={0}
            lang={lang}
            onLike={(cid) => onLikeComment(postId, cid)}
            onDelete={(cid) => onDeleteComment(postId, cid)}
            onReport={(cid) => onReportComment(postId, cid)}
            onReply={(parentId, content) => onAddComment(postId, content, parentId)}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            {lang === 'ar' ? 'لا توجد تعليقات بعد. كن الأول!' : 'No comments yet. Be first!'}
          </p>
        )}
      </div>
    </div>
  )
}
