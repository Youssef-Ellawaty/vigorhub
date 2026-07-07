'use client'

import dynamic from 'next/dynamic'
import type { Language, Theme } from '@/lib/types'

// Dynamically import the VigorHub component
const VigorHub = dynamic(() => import('@/community/components/vigor/VigorHub'), { ssr: false })

interface CommunityModuleProps {
  lang: Language
  theme: Theme
}

export default function CommunityModule({ lang, theme }: CommunityModuleProps) {
  return <VigorHub />
}
