import type { User, Post, Comment, AppNotification, LeaderboardEntry, CommitmentRank, League } from './types'

// ─── Rank Definitions ─────────────────────────────────────────────────────────
export const RANKS: Record<string, CommitmentRank> = {
  bronze: { tier: 'Bronze', label: 'Bronze Warrior', labelAr: 'محارب البرونز', emoji: '🥉', color: '#cd7f32', xp: 0, maxXp: 500 },
  silver: { tier: 'Silver', label: 'Silver Fighter', labelAr: 'مقاتل الفضة', emoji: '🥈', color: '#c0c0c0', xp: 500, maxXp: 1500 },
  gold: { tier: 'Gold', label: 'Gold Gladiator', labelAr: 'مجلد الذهب', emoji: '🥇', color: '#ffd700', xp: 1500, maxXp: 3000 },
  diamond: { tier: 'Diamond', label: 'Diamond Athlete', labelAr: 'رياضي الماس', emoji: '💎', color: '#b9f2ff', xp: 3000, maxXp: 6000 },
  champion: { tier: 'Vigor Champion', label: 'Vigor Champion', labelAr: 'بطل فيجور', emoji: '👑', color: '#10b981', xp: 6000, maxXp: 10000 },
}

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const CURRENT_USER: User = {
  id: 'u0',
  username: '@vigor_alpha',
  displayName: 'Ahmed Al-Rashidi',
  displayNameAr: 'أحمد الراشدي',
  avatar: 'https://i.pravatar.cc/150?img=3',
  coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
  bio: '17 Years Old | STEM Dev | Bulk Mode 📈',
  bioAr: '١٧ سنة | مطور STEM | وضع الضخامة',
  rank: RANKS.diamond,
  isAdmin: false,
  followersCount: 1247,
  followingCount: 384,
  postsCount: 89,
  isFollowedByCurrentUser: false,
  isCurrentUser: true,
  xp: 4200,
}

export const USERS: User[] = [
  CURRENT_USER,
  {
    id: 'u1',
    username: '@iron_beast_pro',
    displayName: 'Khalid Al-Mansouri',
    displayNameAr: 'خالد المنصوري',
    avatar: 'https://i.pravatar.cc/150?img=11',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    bio: 'IFBB Pro | Coach | 15 Years Iron Game',
    bioAr: 'محترف IFBB | مدرب | ١٥ سنة في الحديد',
    rank: RANKS.champion,
    isAdmin: true,
    followersCount: 52300,
    followingCount: 412,
    postsCount: 891,
    isFollowedByCurrentUser: true,
    isCurrentUser: false,
    xp: 9800,
  },
  {
    id: 'u2',
    username: '@cut_queen_sara',
    displayName: 'Sara Al-Zahrawi',
    displayNameAr: 'سارة الزهراوي',
    avatar: 'https://i.pravatar.cc/150?img=47',
    coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
    bio: 'Bikini Athlete | Nutrition Coach | -30kg Journey',
    bioAr: 'رياضية بيكيني | مدربة تغذية | رحلة -٣٠ كجم',
    rank: RANKS.diamond,
    isAdmin: false,
    followersCount: 18900,
    followingCount: 723,
    postsCount: 342,
    isFollowedByCurrentUser: false,
    isCurrentUser: false,
    xp: 5100,
  },
  {
    id: 'u3',
    username: '@bulk_monster',
    displayName: 'Omar Al-Harbi',
    displayNameAr: 'عمر الحربي',
    avatar: 'https://i.pravatar.cc/150?img=15',
    coverImage: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=1200&q=80',
    bio: '120kg Power | Raw Strength | No Gear',
    bioAr: '١٢٠ كجم قوة | قوة خام | بدون معدات',
    rank: RANKS.gold,
    isAdmin: false,
    followersCount: 7340,
    followingCount: 289,
    postsCount: 156,
    isFollowedByCurrentUser: true,
    isCurrentUser: false,
    xp: 2800,
  },
  {
    id: 'u4',
    username: '@shred_king99',
    displayName: 'Faisal Al-Otaibi',
    displayNameAr: 'فيصل العتيبي',
    avatar: 'https://i.pravatar.cc/150?img=22',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
    bio: '6% Body Fat All Year | Classic Physique',
    bioAr: '٦٪ دهون طوال العام | فيزيك كلاسيكي',
    rank: RANKS.silver,
    isAdmin: false,
    followersCount: 3120,
    followingCount: 198,
    postsCount: 74,
    isFollowedByCurrentUser: false,
    isCurrentUser: false,
    xp: 1200,
  },
]

// ─── Mock Comments ────────────────────────────────────────────────────────────
const makeComment = (
  id: string, postId: string, author: User, content: string,
  parentCommentId: string | null = null, replies: Comment[] = []
): Comment => ({
  id, postId, parentCommentId, author, authorId: author.id,
  content, likesCount: Math.floor(Math.random() * 40), isLikedByCurrentUser: false,
  createdAt: new Date(Date.now() - Math.random() * 3600000 * 24), replies,
})

// ─── Mock Posts ───────────────────────────────────────────────────────────────
export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u1',
    author: USERS[1],
    content: 'صباح القوة والعزيمة يا وحوش! اليوم أكملنا جلسة الصدر الأسطورية — 180 كجم بنش بريس × 3 تكرارات. الطريق للقمة لا يتوقف 🔥\n\nMorning of strength, beasts! Completed legendary chest session — 180kg bench press × 3 reps. The road to the top never stops.',
    category: 'Bulk',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    ],
    likesCount: 847,
    isLikedByCurrentUser: false,
    commentsCount: 3,
    sharesCount: 112,
    comments: [
      makeComment('c1', 'p1', USERS[2], 'وحش يا أستاذ خالد! الله يعطيك العافية 💪', null, [
        makeComment('c1r1', 'p1', USERS[3], 'ولا يهمك، هو دايم وحش!', 'c1'),
      ]),
      makeComment('c2', 'p1', USERS[4], 'Coach! What was your pre-workout today?', null, [
        makeComment('c2r1', 'p1', USERS[1], 'Just black coffee and iron will 😤', 'c2'),
      ]),
      makeComment('c3', 'p1', CURRENT_USER, 'الإلهام الحقيقي! رح أجرب هالروتين', null, []),
    ],
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'p2',
    authorId: 'u2',
    author: USERS[2],
    content: 'الحمية والانضباط أهم من أي مكمل في العالم! ٣ أشهر تقطيع، ٨ كجم دهون أقل، والعضل محافظ عليه 100٪ ✨\n\nDiet and discipline beat any supplement! 3 months cut, -8kg fat, muscle fully preserved. Consistency is the secret.',
    category: 'Cut',
    images: [
      'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80',
    ],
    likesCount: 1203,
    isLikedByCurrentUser: true,
    commentsCount: 2,
    sharesCount: 234,
    comments: [
      makeComment('c4', 'p2', USERS[1], 'سارة دايما تثبت إن الإرادة أقوى من كل شيء!', null, []),
      makeComment('c5', 'p2', CURRENT_USER, 'What was your daily calorie deficit?', null, [
        makeComment('c5r1', 'p2', USERS[2], '400-500 kcal deficit max, never starve yourself!', 'c5'),
      ]),
    ],
    createdAt: new Date(Date.now() - 3600000 * 6),
  },
  {
    id: 'p3',
    authorId: 'u3',
    author: USERS[3],
    content: 'فورم تشيك! شوفوا السكوات ٢٠٠ كجم — هل العمق تمام؟ ابوني برأيكم الصريح 🙏\n\nForm Check! 200kg squat — is the depth good? Give me your honest feedback!',
    category: 'Form Check',
    images: [
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&q=80',
      'https://images.unsplash.com/photo-1567598508481-65985588e295?w=600&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    ],
    likesCount: 456,
    isLikedByCurrentUser: false,
    commentsCount: 2,
    sharesCount: 67,
    comments: [
      makeComment('c6', 'p3', USERS[1], 'العمق ممتاز يا عمر! بس ركز على الركبة ما تروح للداخل', null, [
        makeComment('c6r1', 'p3', USERS[3], 'شكراً يا كوتش! راح أصلح هذي النقطة', 'c6'),
      ]),
      makeComment('c7', 'p3', USERS[4], 'Solid depth bro! Knees need a bit more external rotation', null, []),
    ],
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    id: 'p4',
    authorId: 'u4',
    author: USERS[4],
    content: 'PR جديد اليوم! ديدلفت 220 كجم × 1 تكرار نظيف 🔥 كل يوم أثبت إن اللا ممكن يصير ممكن!\n\nNew PR today! 220kg deadlift × 1 clean rep. Every day proving the impossible becomes possible!',
    category: 'PR',
    images: [],
    likesCount: 892,
    isLikedByCurrentUser: false,
    commentsCount: 1,
    sharesCount: 145,
    comments: [
      makeComment('c8', 'p4', USERS[3], 'عاش يا فيصل! ماذا كان وزنك قبل سنة؟', null, [
        makeComment('c8r1', 'p4', USERS[4], 'كان 160 كجم بس! 60 كجم زيادة في سنة', 'c8'),
      ]),
    ],
    createdAt: new Date(Date.now() - 3600000 * 18),
  },
]

// ─── Mock Notifications ───────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'follow',
    actor: USERS[1],
    isRead: false,
    createdAt: new Date(Date.now() - 60000 * 5),
  },
  {
    id: 'n2',
    type: 'like',
    actor: USERS[2],
    postId: 'p1',
    isRead: false,
    createdAt: new Date(Date.now() - 60000 * 15),
  },
  {
    id: 'n3',
    type: 'comment',
    actor: USERS[3],
    postId: 'p2',
    commentId: 'c6',
    isRead: false,
    createdAt: new Date(Date.now() - 60000 * 30),
  },
  {
    id: 'n4',
    type: 'reply',
    actor: USERS[4],
    postId: 'p1',
    commentId: 'c2r1',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'n5',
    type: 'follow',
    actor: USERS[2],
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    id: 'n6',
    type: 'like',
    actor: USERS[4],
    postId: 'p3',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 8),
  },
]

// ─── Mock Leaderboard ─────────────────────────────────────────────────────────
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: USERS[1], workoutsThisMonth: 28, currentStreak: 42 },
  { rank: 2, user: USERS[2], workoutsThisMonth: 26, currentStreak: 38 },
  { rank: 3, user: USERS[0], workoutsThisMonth: 24, currentStreak: 31 },
  { rank: 4, user: USERS[3], workoutsThisMonth: 21, currentStreak: 25 },
  { rank: 5, user: USERS[4], workoutsThisMonth: 19, currentStreak: 18 },
]

// ─── Mock Leagues ─────────────────────────────────────────────────────────────
export const LEAGUES: League[] = [
  {
    id: 'l1',
    inviteCode: 'IRON42',
    name: 'Iron Brothers GYM',
    nameAr: 'دوري أخوة الحديد',
    description: 'Monthly XP battle between gym members. Who trains hardest wins.',
    descriptionAr: 'مباراة XP شهرية بين أعضاء الجيم. من يتدرب أكثر يفوز.',
    type: 'gym',
    scoringMetric: 'xp',
    createdBy: USERS[1],
    isCurrentUserMember: true,
    createdAt: new Date(Date.now() - 86400000 * 20),
    endsAt: new Date(Date.now() + 86400000 * 10),
    members: [
      { user: USERS[1], score: 9800, rank: 1, joinedAt: new Date(Date.now() - 86400000 * 20) },
      { user: USERS[2], score: 5100, rank: 2, joinedAt: new Date(Date.now() - 86400000 * 18) },
      { user: USERS[0], score: 4200, rank: 3, joinedAt: new Date(Date.now() - 86400000 * 15) },
      { user: USERS[3], score: 2800, rank: 4, joinedAt: new Date(Date.now() - 86400000 * 12) },
      { user: USERS[4], score: 1200, rank: 5, joinedAt: new Date(Date.now() - 86400000 * 10) },
    ],
  },
  {
    id: 'l2',
    inviteCode: 'SQUAD7',
    name: 'Squad Goals — July Challenge',
    nameAr: 'تحدي الأصحاب — يوليو',
    description: 'A 30-day workout-count challenge between the crew. Every session counts.',
    descriptionAr: 'تحدي ٣٠ يوم على عدد التمارين بين الشلة. كل جلسة تحسب.',
    type: 'friends',
    scoringMetric: 'workouts',
    createdBy: USERS[0],
    isCurrentUserMember: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    endsAt: new Date(Date.now() + 86400000 * 25),
    members: [
      { user: USERS[3], score: 21, rank: 1, joinedAt: new Date(Date.now() - 86400000 * 5) },
      { user: USERS[0], score: 19, rank: 2, joinedAt: new Date(Date.now() - 86400000 * 5) },
      { user: USERS[4], score: 17, rank: 3, joinedAt: new Date(Date.now() - 86400000 * 4) },
    ],
  },
  {
    id: 'l3',
    inviteCode: 'STRK99',
    name: 'Streak Masters',
    nameAr: 'دوري الاستمرارية',
    description: 'Who can maintain the longest workout streak? Longest streak at end-of-month wins.',
    descriptionAr: 'من يحافظ على أطول سلسلة تمارين؟ الأطول في نهاية الشهر يفوز.',
    type: 'challenge',
    scoringMetric: 'streak',
    createdBy: USERS[2],
    isCurrentUserMember: false,
    createdAt: new Date(Date.now() - 86400000 * 30),
    endsAt: new Date(Date.now() + 86400000 * 1),
    members: [
      { user: USERS[1], score: 42, rank: 1, joinedAt: new Date(Date.now() - 86400000 * 30) },
      { user: USERS[2], score: 38, rank: 2, joinedAt: new Date(Date.now() - 86400000 * 30) },
      { user: USERS[3], score: 25, rank: 3, joinedAt: new Date(Date.now() - 86400000 * 28) },
    ],
  },
]

// ─── Grid images for profile ──────────────────────────────────────────────────
export const PROFILE_GRID_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80',
  'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&q=80',
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
  'https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80',
]
