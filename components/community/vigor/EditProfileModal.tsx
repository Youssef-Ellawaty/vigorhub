'use client'

import { useState, useRef } from 'react'
import { X, Camera, Check, AlertCircle } from 'lucide-react'
import type { User, Language } from '@/lib/types'

interface EditProfileModalProps {
  user: User
  lang: Language
  onSave: (updated: Partial<User>) => void
  onClose: () => void
}

interface FormState {
  displayName: string
  displayNameAr: string
  username: string
  bio: string
  bioAr: string
  avatar: string
  coverImage: string
}

function FieldRow({
  label, labelAr, lang, children,
}: { label: string; labelAr: string; lang: Language; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center min-h-[52px] gap-4 px-0">
        <div className="w-28 flex-shrink-0 text-right">
          <span className="text-sm font-semibold text-foreground">
            {lang === 'ar' ? labelAr : label}
          </span>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

export function EditProfileModal({ user, lang, onSave, onClose }: EditProfileModalProps) {
  const [form, setForm] = useState<FormState>({
    displayName: user.displayName,
    displayNameAr: user.displayNameAr,
    username: user.username,
    bio: user.bio,
    bioAr: user.bioAr,
    avatar: user.avatar,
    coverImage: user.coverImage,
  })
  const [usernameError, setUsernameError] = useState('')
  const avatarInputRef   = useRef<HTMLInputElement>(null)
  const coverInputRef    = useRef<HTMLInputElement>(null)

  const isRtl = lang === 'ar'

  const validateUsername = (val: string) => {
    if (!val.startsWith('@')) return lang === 'ar' ? 'يجب أن يبدأ بـ @' : 'Must start with @'
    if (val.length < 3) return lang === 'ar' ? 'قصير جدا' : 'Too short'
    if (/\s/.test(val)) return lang === 'ar' ? 'لا مسافات' : 'No spaces allowed'
    return ''
  }

  const handleUsernameChange = (val: string) => {
    setForm(p => ({ ...p, username: val }))
    setUsernameError(validateUsername(val))
  }

  const handleImageFile = (file: File, field: 'avatar' | 'coverImage') => {
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target?.result) {
        setForm(p => ({ ...p, [field]: e.target!.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    const err = validateUsername(form.username)
    if (err) { setUsernameError(err); return }
    onSave({
      displayName:   form.displayName.trim() || user.displayName,
      displayNameAr: form.displayNameAr.trim() || user.displayNameAr,
      username:      form.username.trim() || user.username,
      bio:           form.bio.trim(),
      bioAr:         form.bioAr.trim(),
      avatar:        form.avatar,
      coverImage:    form.coverImage,
    })
    onClose()
  }

  const isChanged = JSON.stringify(form) !== JSON.stringify({
    displayName: user.displayName,
    displayNameAr: user.displayNameAr,
    username: user.username,
    bio: user.bio,
    bioAr: user.bioAr,
    avatar: user.avatar,
    coverImage: user.coverImage,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0B0F19] border border-border/60 rounded-2xl overflow-hidden shadow-2xl mt-8 mx-4 max-h-[92vh] flex flex-col">
        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!isChanged || !!usernameError}
            className="text-sm font-bold text-primary hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {lang === 'ar' ? 'حفظ' : 'Save'}
          </button>
          <h2 className="text-sm font-bold text-foreground">
            {lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Scrollable body ─────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">
          {/* Cover photo editor */}
          <div className="relative h-36 bg-secondary/30">
            <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => coverInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 text-white"
              >
                <div className="w-9 h-9 rounded-full bg-black/60 border border-white/30 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">
                  {lang === 'ar' ? 'تغيير الغلاف' : 'Change Cover'}
                </span>
              </button>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f, 'coverImage') }}
            />

            {/* Avatar on top of cover */}
            <div className="absolute -bottom-10 right-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#0B0F19]">
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f, 'avatar') }}
                />
              </div>
            </div>
          </div>

          {/* Avatar URL shortcut below spacer */}
          <div className="px-4 pt-14 pb-1">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="text-xs text-primary hover:underline font-medium float-right"
            >
              {lang === 'ar' ? 'تغيير الصورة الشخصية' : 'Change profile photo'}
            </button>
            <div className="clear-both" />
          </div>

          {/* ─── Fields ──────────────────────────────────────────────── */}
          <div className="px-4 pb-6 pt-2 space-y-0">
            {/* Display name (EN) */}
            <FieldRow label="Name" labelAr="الاسم (EN)" lang={lang}>
              <input
                value={form.displayName}
                onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                placeholder="Your name in English"
                dir="ltr"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
              />
            </FieldRow>

            {/* Display name (AR) */}
            <FieldRow label="Name (AR)" labelAr="الاسم (ع)" lang={lang}>
              <input
                value={form.displayNameAr}
                onChange={e => setForm(p => ({ ...p, displayNameAr: e.target.value }))}
                placeholder="اسمك بالعربي"
                dir="rtl"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 text-right"
              />
            </FieldRow>

            {/* Username */}
            <FieldRow label="Username" labelAr="اليوزرنيم" lang={lang}>
              <div>
                <input
                  value={form.username}
                  onChange={e => handleUsernameChange(e.target.value)}
                  placeholder="@username"
                  dir="ltr"
                  className={`w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 font-mono ${
                    usernameError ? 'text-destructive' : ''
                  }`}
                />
                {usernameError && (
                  <p className="flex items-center gap-1 text-xs text-destructive pb-1">
                    <AlertCircle className="w-3 h-3" />
                    {usernameError}
                  </p>
                )}
              </div>
            </FieldRow>

            {/* Bio (EN) */}
            <FieldRow label="Bio" labelAr="البايو (EN)" lang={lang}>
              <textarea
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Write something about yourself..."
                dir="ltr"
                rows={3}
                maxLength={150}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 resize-none leading-relaxed"
              />
            </FieldRow>

            {/* Bio (AR) */}
            <FieldRow label="Bio (AR)" labelAr="البايو (ع)" lang={lang}>
              <textarea
                value={form.bioAr}
                onChange={e => setForm(p => ({ ...p, bioAr: e.target.value }))}
                placeholder="اكتب شيئاً عن نفسك..."
                dir="rtl"
                rows={3}
                maxLength={150}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 resize-none leading-relaxed text-right"
              />
            </FieldRow>
          </div>

          {/* Character counter for bio */}
          <div className="px-4 pb-4 flex justify-end">
            <span className="text-xs text-muted-foreground font-mono">
              {Math.max(form.bio.length, form.bioAr.length)}/150
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
