'use client'

import { useState, useRef } from 'react'
import { ImageIcon, X, Tag, Send } from 'lucide-react'
import type { User, PostCategory } from '@/lib/community/types'

interface PostCreatorProps {
  currentUser: User
  onPost: (content: string, category: PostCategory, images: string[]) => void
  lang: 'ar' | 'en'
}

const CATEGORIES: { value: PostCategory; labelAr: string; labelEn: string; color: string }[] = [
  { value: 'Bulk', labelAr: 'ضخامة', labelEn: 'Bulk', color: 'emerald' },
  { value: 'Cut', labelAr: 'تقطيع', labelEn: 'Cut', color: 'cyan' },
  { value: 'Form Check', labelAr: 'فورم تشيك', labelEn: 'Form Check', color: 'yellow' },
  { value: 'Motivation', labelAr: 'تحفيز', labelEn: 'Motivation', color: 'orange' },
  { value: 'PR', labelAr: 'رقم قياسي', labelEn: 'PR', color: 'rose' },
]

const COLOR_MAP: Record<string, string> = {
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
  yellow: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  orange: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  rose: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
}

const ACTIVE_MAP: Record<string, string> = {
  emerald: 'border-emerald-400 bg-emerald-500/25 text-emerald-300',
  cyan: 'border-cyan-400 bg-cyan-500/25 text-cyan-300',
  yellow: 'border-yellow-400 bg-yellow-500/25 text-yellow-300',
  orange: 'border-orange-400 bg-orange-500/25 text-orange-300',
  rose: 'border-rose-400 bg-rose-500/25 text-rose-300',
}

export function PostCreator({ currentUser, onPost, lang }: PostCreatorProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('Bulk')
  const [images, setImages] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const placeholder = lang === 'ar'
    ? 'شارك تمرينك، وجبتك، إنجازك... 🔥'
    : 'Share your workout, meal, achievement...'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - images.length
    files.slice(0, remaining).forEach(file => {
      const url = URL.createObjectURL(file)
      setImages(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    onPost(content.trim(), category, images)
    setContent('')
    setImages([])
  }

  return (
    <div className="glass rounded-2xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <img src={currentUser.avatar} alt={currentUser.displayName} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0F19]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{lang === 'ar' ? currentUser.displayNameAr : currentUser.displayName}</p>
          <p className="text-xs text-muted-foreground">{currentUser.username}</p>
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm leading-relaxed border border-border rounded-xl p-3 focus:border-primary/40 transition-colors"
      />

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className={`grid gap-2 mt-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Tag className="w-3 h-3" />
          {lang === 'ar' ? 'الفئة:' : 'Tag:'}
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              category === cat.value ? ACTIVE_MAP[cat.color] : COLOR_MAP[cat.color]
            }`}
          >
            {lang === 'ar' ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={images.length >= 5}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
          >
            <ImageIcon className="w-4 h-4" />
            {lang === 'ar' ? `صور (${images.length}/5)` : `Photos (${images.length}/5)`}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-emerald"
        >
          <Send className="w-4 h-4" />
          {lang === 'ar' ? 'نشر' : 'Post'}
        </button>
      </div>
    </div>
  )
}
