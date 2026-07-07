'use client'

import type { CommitmentRank } from '@/lib/types'

interface RankBadgeProps {
  rank: CommitmentRank
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  lang?: 'ar' | 'en'
}

export function RankBadge({ rank, size = 'md', showLabel = true, lang = 'ar' }: RankBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-semibold border ${sizeClasses[size]}`}
      style={{
        color: rank.color,
        borderColor: `${rank.color}40`,
        backgroundColor: `${rank.color}15`,
      }}
    >
      <span>{rank.emoji}</span>
      {showLabel && (
        <span>{lang === 'ar' ? rank.labelAr : rank.label}</span>
      )}
    </span>
  )
}
