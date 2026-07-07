'use client'

import { useState } from 'react'
import {
  Trophy, Users, Zap, Flame, Clock, Plus, ArrowRight, ArrowLeft,
  Crown, Shield, Dumbbell, Star, Calendar, ChevronRight, X, Check,
  Lock, Globe2, Copy, KeyRound, CheckCheck, Hash
} from 'lucide-react'
import type { League, LeagueMember, LeagueType, LeagueScoringMetric, User, Language } from '@/lib/types'
import { LEAGUES, USERS } from '@/lib/mock-data'
import { generateInviteCode } from '@/lib/utils'
import { RankBadge } from './RankBadge'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysRemaining(endsAt: Date | null): string {
  if (!endsAt) return '∞'
  const diff = Math.ceil((endsAt.getTime() - Date.now()) / 86400000)
  return diff <= 0 ? '0' : String(diff)
}

function metricLabel(metric: LeagueScoringMetric, lang: Language): string {
  const map: Record<LeagueScoringMetric, { ar: string; en: string }> = {
    xp:       { ar: 'XP مكتسب', en: 'XP Earned' },
    workouts: { ar: 'تمارين', en: 'Workouts' },
    streak:   { ar: 'يوم استمرارية', en: 'Day Streak' },
  }
  return lang === 'ar' ? map[metric].ar : map[metric].en
}

function metricIcon(metric: LeagueScoringMetric) {
  if (metric === 'xp')       return <Zap className="w-3.5 h-3.5" />
  if (metric === 'workouts') return <Dumbbell className="w-3.5 h-3.5" />
  return <Flame className="w-3.5 h-3.5" />
}

function typeIcon(type: LeagueType) {
  if (type === 'gym')       return <Shield className="w-4 h-4" />
  if (type === 'friends')   return <Users className="w-4 h-4" />
  return <Star className="w-4 h-4" />
}

function typeColor(type: LeagueType): string {
  if (type === 'gym')     return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
  if (type === 'friends') return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
  return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
}

function typeLabel(type: LeagueType, lang: Language): string {
  const map: Record<LeagueType, { ar: string; en: string }> = {
    gym:       { ar: 'جيم', en: 'Gym' },
    friends:   { ar: 'أصحاب', en: 'Friends' },
    challenge: { ar: 'تحدي', en: 'Challenge' },
  }
  return lang === 'ar' ? map[type].ar : map[type].en
}

const RANK_MEDALS: Record<number, { medal: string; glow: string; bg: string }> = {
  1: { medal: '#FFD700', glow: 'shadow-[0_0_12px_rgba(255,215,0,0.4)]', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  2: { medal: '#C0C0C0', glow: 'shadow-[0_0_8px_rgba(192,192,192,0.3)]', bg: 'bg-slate-400/10 border-slate-400/20' },
  3: { medal: '#CD7F32', glow: 'shadow-[0_0_8px_rgba(205,127,50,0.3)]', bg: 'bg-amber-700/10 border-amber-700/20' },
}

// ─── Copy Code Button ─────────────────────────────────────────────────────────
function CopyCodeButton({ code, lang }: { code: string; lang: Language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
        copied
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-border bg-secondary/40 text-foreground hover:border-primary/30 hover:bg-secondary/60'
      }`}
    >
      <span className="tracking-widest">{code}</span>
      {copied
        ? <CheckCheck className="w-3.5 h-3.5 text-primary" />
        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      }
    </button>
  )
}

// ─── League Card ──────────────────────────────────────────────────────────────
function LeagueCard({
  league, lang, onOpen, currentUser,
}: {
  league: League
  lang: Language
  onOpen: () => void
  currentUser: User
}) {
  const myEntry = league.members.find(m => m.user.id === currentUser.id)
  const topThree = league.members.slice(0, 3)

  return (
    <div className="glass rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all group">
      {/* Top bar */}
      <button onClick={onOpen} className="w-full text-right px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 justify-end flex-wrap mb-1">
              <h3 className="text-sm font-bold text-foreground truncate">
                {lang === 'ar' ? league.nameAr : league.name}
              </h3>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${typeColor(league.type)}`}>
                {typeIcon(league.type)}
                {typeLabel(league.type, lang)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 text-right">
              {lang === 'ar' ? league.descriptionAr : league.description}
            </p>
          </div>
        </div>
      </button>

      {/* Mini podium */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 justify-end mb-3">
          {topThree.map((m) => {
            const deco = RANK_MEDALS[m.rank]
            return (
              <div key={m.user.id} className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-muted-foreground">{m.score.toLocaleString()}</span>
                <img
                  src={m.user.avatar}
                  alt={m.user.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                  style={{ outline: `2px solid ${deco?.medal ?? '#444'}`, outlineOffset: '1px' }}
                />
              </div>
            )
          })}
        </div>

        {/* Footer row: stats + invite code */}
        <div className="flex items-center justify-between gap-2">
          <CopyCodeButton code={league.inviteCode} lang={lang} />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Users className="w-3 h-3" />
              <span>{league.members.length}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Clock className="w-3 h-3" />
              <span>{daysRemaining(league.endsAt)}{lang === 'ar' ? ' يوم' : 'd'}</span>
            </div>
            {myEntry && (
              <span className="text-xs font-mono text-primary">
                #{myEntry.rank}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Join by Code Modal ───────────────────────────────────────────────────────
function JoinByCodeModal({
  lang, leagues, currentUser, onClose, onJoin,
}: {
  lang: Language
  leagues: League[]
  currentUser: User
  onClose: () => void
  onJoin: (league: League) => void
}) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'found' | 'notfound' | 'already'>('idle')
  const [found, setFound] = useState<League | null>(null)

  const handleSearch = () => {
    const upper = code.trim().toUpperCase()
    if (!upper) return
    const match = leagues.find(l => l.inviteCode === upper)
    if (!match) { setStatus('notfound'); setFound(null); return }
    if (match.isCurrentUserMember) { setStatus('already'); setFound(match); return }
    setStatus('found')
    setFound(match)
  }

  const handleJoin = () => {
    if (found) { onJoin(found); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-sm overflow-hidden border border-border/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold text-foreground">
            {lang === 'ar' ? 'انضم بكود الدوري' : 'Join by Invite Code'}
          </h2>
          <div className="w-7" />
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground text-center">
            {lang === 'ar'
              ? 'أدخل الكود المكون من 6 أحرف الذي شاركه معك منشئ الدوري'
              : 'Enter the 6-character code shared by the league creator'}
          </p>

          {/* Code input */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 6)); setStatus('idle'); setFound(null) }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch() }}
              placeholder={lang === 'ar' ? 'مثال: IRON42' : 'e.g. IRON42'}
              maxLength={6}
              className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:border-primary/50 tracking-widest text-center uppercase"
              dir="ltr"
            />
          </div>

          {/* Results */}
          {status === 'notfound' && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-xs text-destructive">
              {lang === 'ar' ? 'لا يوجد دوري بهذا الكود' : 'No league found with this code'}
            </div>
          )}

          {status === 'already' && found && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-xs text-primary">
              {lang === 'ar' ? `أنت بالفعل عضو في "${found.nameAr}"` : `You are already a member of "${found.name}"`}
            </div>
          )}

          {status === 'found' && found && (
            <div className="rounded-xl border border-border/60 bg-secondary/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${typeColor(found.type)}`}>
                    {typeIcon(found.type)}
                    {typeLabel(found.type, lang)}
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {lang === 'ar' ? found.nameAr : found.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right line-clamp-2">
                  {lang === 'ar' ? found.descriptionAr : found.description}
                </p>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="font-mono">{found.members.length} {lang === 'ar' ? 'عضو' : 'members'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {metricIcon(found.scoringMetric)}
                  <span>{metricLabel(found.scoringMetric, lang)}</span>
                </div>
              </div>
              <div className="px-4 pb-3">
                <button
                  onClick={handleJoin}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {lang === 'ar' ? 'انضم للدوري' : 'Join League'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── League Detail View ───────────────────────────────────────────────────────
function LeagueDetail({
  league, lang, onBack, currentUser, onViewProfile,
}: {
  league: League
  lang: Language
  onBack: () => void
  currentUser: User
  onViewProfile: (userId: string) => void
}) {
  const isRtl = lang === 'ar'
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const myEntry = league.members.find(m => m.user.id === currentUser.id)
  const topEntry = league.members[0]
  const myProgress = myEntry && topEntry
    ? Math.round((myEntry.score / Math.max(topEntry.score, 1)) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
        >
          <BackIcon className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-foreground">
              {lang === 'ar' ? league.nameAr : league.name}
            </h2>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${typeColor(league.type)}`}>
              {typeIcon(league.type)}
              {typeLabel(league.type, lang)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lang === 'ar' ? league.descriptionAr : league.description}
          </p>
        </div>
      </div>

      {/* Invite code banner — prominent, always shown */}
      <div className="glass rounded-2xl px-4 py-3 border border-border/50 flex items-center justify-between gap-3">
        <CopyCodeButton code={league.inviteCode} lang={lang} />
        <div className="text-right">
          <p className="text-xs font-semibold text-foreground">
            {lang === 'ar' ? 'كود الدوري' : 'League Invite Code'}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === 'ar' ? 'شاركه مع أصحابك للانضمام' : 'Share with friends to join'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Hash className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Users className="w-4 h-4 text-cyan-400" />, value: league.members.length, labelAr: 'عضو', labelEn: 'Members' },
          { icon: <Clock className="w-4 h-4 text-amber-400" />, value: daysRemaining(league.endsAt), labelAr: 'يوم متبقي', labelEn: 'Days Left' },
          { icon: metricIcon(league.scoringMetric), value: league.scoringMetric.toUpperCase(), labelAr: 'معيار التقييم', labelEn: 'Scoring', className: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className={`text-sm font-bold font-mono ${s.className ?? 'text-foreground'}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{lang === 'ar' ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      {/* My position */}
      {myEntry && (
        <div className="glass rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{lang === 'ar' ? 'مستواي في الدوري' : 'My Standing'}</span>
            <span className="text-lg font-bold font-mono text-primary">#{myEntry.rank}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-mono">{myEntry.score.toLocaleString()} {metricLabel(league.scoringMetric, lang)}</span>
            <span>{myProgress}% {lang === 'ar' ? 'من المتصدر' : 'of leader'}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${myProgress}%` }} />
          </div>
        </div>
      )}

      {/* Full ranking list */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-bold text-foreground">
            {lang === 'ar' ? 'الترتيب الكامل' : 'Full Rankings'}
          </h3>
        </div>
        <div className="divide-y divide-border/30">
          {league.members.map((member) => {
            const deco = RANK_MEDALS[member.rank]
            const isMe = member.user.id === currentUser.id
            const topScore = league.members[0].score

            return (
              <div
                key={member.user.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isMe ? 'bg-primary/5' : 'hover:bg-secondary/30'
                }`}
              >
                {/* Rank cell */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border font-bold text-sm ${
                    deco ? deco.bg : 'bg-secondary/30 border-border text-muted-foreground'
                  }`}
                  style={deco ? { color: deco.medal } : {}}
                >
                  {member.rank === 1 ? <Crown className="w-4 h-4" /> : `${member.rank}`}
                </div>

                {/* Avatar */}
                <button onClick={() => onViewProfile(member.user.id)} className="flex-shrink-0">
                  <img
                    src={member.user.avatar}
                    alt={member.user.displayName}
                    className={`w-10 h-10 rounded-full object-cover ring-2 transition-all ${
                      isMe ? 'ring-primary' : 'ring-border hover:ring-primary/50'
                    }`}
                  />
                </button>

                {/* Info + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-end">
                    {isMe && <span className="text-xs text-primary font-mono">{lang === 'ar' ? 'أنت' : 'You'}</span>}
                    <p className="text-sm font-semibold text-foreground truncate">
                      {lang === 'ar' ? member.user.displayNameAr : member.user.displayName}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round((member.score / Math.max(topScore, 1)) * 100)}%`,
                          background: deco ? deco.medal : '#10b981',
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 flex items-center gap-1">
                      {metricIcon(league.scoringMetric)}
                      {member.score.toLocaleString()}
                    </span>
                  </div>
                </div>

                <RankBadge rank={member.user.rank} size="sm" showLabel={false} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Create League Form ───────────────────────────────────────────────────────
interface CreateLeagueFormProps {
  lang: Language
  currentUser: User
  onCancel: () => void
  onCreate: (league: League) => void
}

function CreateLeagueForm({ lang, currentUser, onCancel, onCreate }: CreateLeagueFormProps) {
  const [name, setName]           = useState('')
  const [description, setDesc]    = useState('')
  const [type, setType]           = useState<LeagueType>('friends')
  const [metric, setMetric]       = useState<LeagueScoringMetric>('workouts')
  const [isPrivate, setIsPrivate] = useState(true)
  const [invites, setInvites]     = useState<User[]>([])
  const [generatedCode]           = useState(() => generateInviteCode())

  const isRtl = lang === 'ar'

  const toggleInvite = (user: User) => {
    setInvites(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const members = [
      { user: currentUser, score: 0, rank: 1, joinedAt: new Date() },
      ...invites.map((u, i) => ({ user: u, score: 0, rank: i + 2, joinedAt: new Date() })),
    ]
    const newLeague: League = {
      id: `l${Date.now()}`,
      inviteCode: generatedCode,
      name: name.trim(),
      nameAr: name.trim(),
      description: description.trim(),
      descriptionAr: description.trim(),
      type,
      scoringMetric: metric,
      createdBy: currentUser,
      members,
      createdAt: new Date(),
      endsAt: new Date(Date.now() + 86400000 * 30),
      isCurrentUserMember: true,
    }
    onCreate(newLeague)
  }

  const typeOptions: { value: LeagueType; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { value: 'gym',       labelAr: 'دوري جيم',   labelEn: 'Gym League',    icon: <Shield className="w-4 h-4" /> },
    { value: 'friends',   labelAr: 'شلة أصحاب',  labelEn: 'Friend Group',  icon: <Users className="w-4 h-4" /> },
    { value: 'challenge', labelAr: 'تحدي مفتوح', labelEn: 'Open Challenge', icon: <Star className="w-4 h-4" /> },
  ]

  const metricOptions: { value: LeagueScoringMetric; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { value: 'xp',       labelAr: 'XP مكتسب',        labelEn: 'XP Earned',   icon: <Zap className="w-4 h-4" /> },
    { value: 'workouts', labelAr: 'عدد التمارين',    labelEn: 'Workouts',    icon: <Dumbbell className="w-4 h-4" /> },
    { value: 'streak',   labelAr: 'أيام الاستمرارية', labelEn: 'Streak Days', icon: <Flame className="w-4 h-4" /> },
  ]

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold text-foreground">
          {lang === 'ar' ? 'إنشاء دوري جديد' : 'Create New League'}
        </h2>
        <div className="w-7" />
      </div>

      <div className="p-5 space-y-5">
        {/* Auto-generated invite code preview */}
        <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <CopyCodeButton code={generatedCode} lang={lang} />
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">
                {lang === 'ar' ? 'كود الدوري التلقائي' : 'Auto-generated Code'}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === 'ar' ? 'سيُحفظ مع الدوري في الداتابيز' : 'Will be saved with the league in DB'}
              </p>
            </div>
            <KeyRound className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 text-right">
            {lang === 'ar' ? 'اسم الدوري' : 'League Name'}
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={lang === 'ar' ? 'مثال: تحدي جيم النور' : 'e.g. Iron Gym July Battle'}
            className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-right"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 text-right">
            {lang === 'ar' ? 'وصف (اختياري)' : 'Description (optional)'}
          </label>
          <textarea
            value={description}
            onChange={e => setDesc(e.target.value)}
            rows={2}
            placeholder={lang === 'ar' ? 'اشرح قوانين ومدة الدوري...' : 'Describe the rules and duration...'}
            className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none text-right"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 text-right">
            {lang === 'ar' ? 'نوع الدوري' : 'League Type'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  type === opt.value
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {opt.icon}
                {lang === 'ar' ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Metric */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 text-right">
            {lang === 'ar' ? 'معيار التقييم' : 'Scoring Metric'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {metricOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setMetric(opt.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  metric === opt.value
                    ? 'border-primary/60 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                {opt.icon}
                {lang === 'ar' ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsPrivate(p => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              isPrivate
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground'
            }`}
          >
            {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
            {lang === 'ar'
              ? (isPrivate ? 'خاص (بكود فقط)' : 'عام')
              : (isPrivate ? 'Private (code only)' : 'Public')}
          </button>
          <span className="text-xs text-muted-foreground">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</span>
        </div>

        {/* Invite members */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 text-right">
            {lang === 'ar' ? 'دعوة أعضاء' : 'Invite Members'}
          </label>
          <div className="space-y-1.5">
            {USERS.filter(u => !u.isCurrentUser).map(user => {
              const selected = !!invites.find(u2 => u2.id === user.id)
              return (
                <button
                  key={user.id}
                  onClick={() => toggleInvite(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    selected ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {lang === 'ar' ? user.displayNameAr : user.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.username}</p>
                  </div>
                  <RankBadge rank={user.rank} size="sm" showLabel={false} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {lang === 'ar' ? 'إنشاء الدوري' : 'Create League'}
        </button>
      </div>
    </div>
  )
}

// ─── Main LeaderboardTab ──────────────────────────────────────────────────────
type LeaderboardView = 'list' | 'detail' | 'create'
type LeagueFilter = 'mine' | 'gym' | 'friends' | 'challenge'

interface LeaderboardTabProps {
  lang: Language
  currentUser: User
  onViewProfile: (userId: string) => void
}

export function LeaderboardTab({ lang, currentUser, onViewProfile }: LeaderboardTabProps) {
  const [view, setView]                     = useState<LeaderboardView>('list')
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [leagues, setLeagues]               = useState<League[]>(LEAGUES)
  const [filter, setFilter]                 = useState<LeagueFilter>('mine')
  const [showJoinModal, setShowJoinModal]   = useState(false)

  // Only show leagues the user is a member of — filtered further by type tab
  const myLeagues = leagues.filter(l => l.isCurrentUserMember)
  const filtered = filter === 'mine'
    ? myLeagues
    : myLeagues.filter(l => l.type === filter)

  const filters: { value: LeagueFilter; labelAr: string; labelEn: string }[] = [
    { value: 'mine',      labelAr: 'دورياتي',  labelEn: 'My Leagues' },
    { value: 'gym',       labelAr: 'جيم',      labelEn: 'Gym' },
    { value: 'friends',   labelAr: 'أصحاب',    labelEn: 'Friends' },
    { value: 'challenge', labelAr: 'تحدي',     labelEn: 'Challenge' },
  ]

  const handleCreate = (league: League) => {
    setLeagues(prev => [league, ...prev])
    setView('list')
    setFilter('mine')
  }

  const handleJoin = (leagueToJoin: League) => {
    setLeagues(prev => prev.map(l => {
      if (l.id !== leagueToJoin.id) return l
      const newMember = { user: currentUser, score: 0, rank: l.members.length + 1, joinedAt: new Date() }
      return { ...l, isCurrentUserMember: true, members: [...l.members, newMember] }
    }))
    setFilter('mine')
  }

  const openDetail = (league: League) => {
    setSelectedLeague(league)
    setView('detail')
  }

  if (view === 'detail' && selectedLeague) {
    // Get the latest league state (may have been mutated)
    const latestLeague = leagues.find(l => l.id === selectedLeague.id) ?? selectedLeague
    return (
      <LeagueDetail
        league={latestLeague}
        lang={lang}
        currentUser={currentUser}
        onBack={() => setView('list')}
        onViewProfile={onViewProfile}
      />
    )
  }

  if (view === 'create') {
    return (
      <CreateLeagueForm
        lang={lang}
        currentUser={currentUser}
        onCancel={() => setView('list')}
        onCreate={handleCreate}
      />
    )
  }

  // ─── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {showJoinModal && (
        <JoinByCodeModal
          lang={lang}
          leagues={leagues}
          currentUser={currentUser}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoin}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:border-primary/30 hover:text-foreground transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            {lang === 'ar' ? 'انضم بكود' : 'Join by Code'}
          </button>
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {lang === 'ar' ? 'إنشاء دوري' : 'New League'}
          </button>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground text-right">
            {lang === 'ar' ? 'لوحة الشرف' : 'Hall of Honor'}
          </h1>
          <p className="text-xs text-muted-foreground text-right mt-0.5">
            {lang === 'ar' ? 'دورياتك وتحدياتك' : 'Your leagues & challenges'}
          </p>
        </div>
      </div>

      {/* Summary pill */}
      {myLeagues.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">
            {lang === 'ar' ? 'مشارك في' : 'Active in'}
          </span>
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            {myLeagues.length} {lang === 'ar' ? 'دوري' : 'leagues'}
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-row-reverse">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              filter === f.value
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'text-muted-foreground border-border hover:text-foreground hover:border-border/80'
            }`}
          >
            {lang === 'ar' ? f.labelAr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Leagues list — member-only */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center space-y-4">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto opacity-30" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {lang === 'ar' ? 'لا توجد دوريات هنا' : 'No leagues here yet'}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === 'ar'
                ? 'انشئ دوريًا جديدًا أو انضم لدوري عن طريق الكود'
                : 'Create a new league or join one with an invite code'}
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-xs hover:border-primary/30 hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" />{lang === 'ar' ? 'انضم بكود' : 'Join by Code'}</span>
            </button>
            <button
              onClick={() => setView('create')}
              className="px-4 py-2 rounded-xl border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-colors"
            >
              {lang === 'ar' ? 'أنشئ دوري' : 'Create League'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(league => (
            <LeagueCard
              key={league.id}
              league={league}
              lang={lang}
              currentUser={currentUser}
              onOpen={() => openDetail(league)}
            />
          ))}
        </div>
      )}

      {/* Global top performers */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono">
              {new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-bold text-foreground">
              {lang === 'ar' ? 'المتصدرون عالميا' : 'Global Top Performers'}
            </h3>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {leagues[0]?.members.map((member) => {
            const deco = RANK_MEDALS[member.rank]
            return (
              <button
                key={member.user.id}
                onClick={() => onViewProfile(member.user.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors group"
              >
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <RankBadge rank={member.user.rank} size="sm" showLabel={false} />
                <div className="flex-1 text-right min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {lang === 'ar' ? member.user.displayNameAr : member.user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{member.user.xp.toLocaleString()} XP</p>
                </div>
                <img src={member.user.avatar} alt={member.user.displayName} className="w-9 h-9 rounded-full object-cover ring-1 ring-border group-hover:ring-primary/40 transition-all flex-shrink-0" />
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border font-bold text-sm ${deco ? deco.bg : 'bg-secondary/30 border-border'}`}
                  style={deco ? { color: deco.medal } : { color: '#888' }}
                >
                  {member.rank === 1 ? <Crown className="w-4 h-4" /> : `#${member.rank}`}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
