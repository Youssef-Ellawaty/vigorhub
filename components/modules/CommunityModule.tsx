'use client'

import dynamic from 'next/dynamic'
import type { Language } from '@/community/lib/types'

// Dynamically import the VigorHub component
const VigorHub = dynamic(() => import('@/community/components/vigor/VigorHub'), { ssr: false })

interface CommunityModuleProps {
  lang: Language
  isDark: boolean
}

export default function CommunityModule({ lang, isDark }: CommunityModuleProps) {
  return <VigorHub />
}
