import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const terms = [
  {
    word: "光合成",
    category: "理科",
    subcategory: "生物",
    officialDef: "植物が光エネルギーを使って水と二酸化炭素から糖を合成する過程",
    ngWords: ["光合成", "植物", "光", "エネルギー", "葉緑体"],
    tags: ["高校生物", "中学理科"],
  },
  {
    word: "民主主義",
    category: "社会",
    subcategory: "政治",
    officialDef: "国民が主権を持ち、政治的決定に参加する政治体制",
    ngWords: ["民主主義", "democracy", "主権", "国民"],
    tags: ["中学公民", "高校政治経済"],
  },
  {
    word: "円周率",
    category: "数学",
    subcategory: "幾何",
    officialDef: "円の円周の長さと直径の比を表す定数で、約3.14159...",
    ngWords: ["円周率", "π", "パイ", "3.14"],
    tags: ["中学数学"],
  },
  {
    word: "重力",
    category: "理科",
    subcategory: "物理",
    officialDef: "質量を持つ物体間に働く引力",
    ngWords: ["重力", "gravity", "引力", "万有引力"],
    tags: ["中学理科", "高校物理"],
  },
  {
    word: "憲法",
    category: "社会",
    subcategory: "法律",
    officialDef: "国家の基本的な組織や統治の原理を定めた最高法規",
    ngWords: ["憲法", "constitution", "最高法規"],
    tags: ["中学公民"],
  },
  {
    word: "微分",
    category: "数学",
    subcategory: "解析",
    officialDef: "関数の変化率を求める数学的操作",
    ngWords: ["微分", "derivative", "導関数", "傾き"],
    tags: ["高校数学"],
  },
  {
    word: "DNA",
    category: "理科",
    subcategory: "生物",
    officialDef: "デオキシリボ核酸。遺伝情報を担う生体高分子",
    ngWords: ["DNA", "デオキシリボ核酸", "遺伝子", "核酸"],
    tags: ["高校生物"],
  },
  {
    word: "三権分立",
    category: "社会",
    subcategory: "政治",
    officialDef: "立法・行政・司法の三つの権力を分離し、相互に抑制させる制度",
    ngWords: ["三権分立", "立法", "行政", "司法"],
    tags: ["中学公民"],
  },
  {
    word: "ピタゴラスの定理",
    category: "数学",
    subcategory: "幾何",
    officialDef: "直角三角形において、斜辺の平方が他の二辺の平方の和に等しいという定理",
    ngWords: ["ピタゴラス", "直角三角形", "斜辺", "平方"],
    tags: ["中学数学"],
  },
  {
    word: "化学反応",
    category: "理科",
    subcategory: "化学",
    officialDef: "物質が別の物質に変化する現象",
    ngWords: ["化学反応", "反応", "化学", "変化"],
    tags: ["中学理科"],
  },
  {
    word: "GDP",
    category: "社会",
    subcategory: "経済",
    officialDef: "国内総生産。一定期間に国内で生産された財・サービスの付加価値の総額",
    ngWords: ["GDP", "国内総生産", "総生産", "経済"],
    tags: ["高校政治経済"],
  },
  {
    word: "因数分解",
    category: "数学",
    subcategory: "代数",
    officialDef: "多項式を複数の多項式の積の形に変形すること",
    ngWords: ["因数分解", "因数", "分解", "多項式"],
    tags: ["中学数学"],
  },
  {
    word: "細胞分裂",
    category: "理科",
    subcategory: "生物",
    officialDef: "一つの細胞が二つ以上の細胞に分かれる現象",
    ngWords: ["細胞分裂", "細胞", "分裂", "mitosis"],
    tags: ["中学理科", "高校生物"],
  },
  {
    word: "需要と供給",
    category: "社会",
    subcategory: "経済",
    officialDef: "市場における買い手の購入意欲と売り手の販売意欲の関係",
    ngWords: ["需要", "供給", "市場", "価格"],
    tags: ["中学公民", "高校政治経済"],
  },
  {
    word: "確率",
    category: "数学",
    subcategory: "統計",
    officialDef: "ある事象が起こる可能性を数値で表したもの",
    ngWords: ["確率", "probability", "可能性", "割合"],
    tags: ["中学数学"],
  },
  {
    word: "電流",
    category: "理科",
    subcategory: "物理",
    officialDef: "電荷の流れ。単位時間あたりに通過する電荷の量",
    ngWords: ["電流", "電気", "電荷", "アンペア"],
    tags: ["中学理科", "高校物理"],
  },
  {
    word: "人権",
    category: "社会",
    subcategory: "法律",
    officialDef: "人間が生まれながらに持つ基本的な権利",
    ngWords: ["人権", "権利", "基本的", "human rights"],
    tags: ["中学公民"],
  },
  {
    word: "関数",
    category: "数学",
    subcategory: "代数",
    officialDef: "ある変数の値が決まると、別の変数の値が一意に定まる対応関係",
    ngWords: ["関数", "function", "変数", "対応"],
    tags: ["中学数学", "高校数学"],
  },
  {
    word: "酸化",
    category: "理科",
    subcategory: "化学",
    officialDef: "物質が酸素と化合する反応、または電子を失う反応",
    ngWords: ["酸化", "酸素", "oxidation", "さび"],
    tags: ["中学理科", "高校化学"],
  },
  {
    word: "インフレーション",
    category: "社会",
    subcategory: "経済",
    officialDef: "物価が持続的に上昇する経済現象",
    ngWords: ["インフレーション", "インフレ", "物価", "上昇"],
    tags: ["高校政治経済"],
  },
]

const badges = [
  // Beginner badges
  {
    name: "はじめの一歩",
    nameEn: "First Step",
    description: "最初の説明に挑戦した",
    category: "beginner",
    iconName: "👶",
    condition: "初回プレイ完了",
    rarity: "common",
  },
  {
    name: "継続は力なり",
    nameEn: "Consistency",
    description: "3日連続でログインした",
    category: "beginner",
    iconName: "📅",
    condition: "3日連続ログイン",
    rarity: "common",
  },
  {
    name: "チャレンジャー",
    nameEn: "Challenger",
    description: "10回挑戦した",
    category: "beginner",
    iconName: "🎯",
    condition: "10回プレイ",
    rarity: "common",
  },

  // Expert badges
  {
    name: "説明の達人",
    nameEn: "Explanation Master",
    description: "50回成功した",
    category: "expert",
    iconName: "🎓",
    condition: "50回成功",
    rarity: "rare",
  },
  {
    name: "完璧主義者",
    nameEn: "Perfectionist",
    description: "HARD難易度で10回成功した",
    category: "expert",
    iconName: "💎",
    condition: "HARD 10回成功",
    rarity: "epic",
  },
  {
    name: "レジェンド",
    nameEn: "Legend",
    description: "100回成功した伝説の説明者",
    category: "expert",
    iconName: "👑",
    condition: "100回成功",
    rarity: "legendary",
  },

  // Social badges
  {
    name: "いいね職人",
    nameEn: "Like Master",
    description: "他のユーザーに10回いいねした",
    category: "social",
    iconName: "❤️",
    condition: "10回いいね",
    rarity: "common",
  },
  {
    name: "コメンテーター",
    nameEn: "Commentator",
    description: "10回コメントした",
    category: "social",
    iconName: "💬",
    condition: "10回コメント",
    rarity: "common",
  },
  {
    name: "人気者",
    nameEn: "Popular",
    description: "自分の説明が50いいねを獲得した",
    category: "social",
    iconName: "⭐",
    condition: "50いいね獲得",
    rarity: "rare",
  },
  {
    name: "改善マスター",
    nameEn: "Improvement Master",
    description: "改善提案が5回採用された",
    category: "social",
    iconName: "🔧",
    condition: "5回改善採用",
    rarity: "epic",
  },

  // Special badges
  {
    name: "ストリークキング",
    nameEn: "Streak King",
    description: "30日連続でログインした",
    category: "special",
    iconName: "🔥",
    condition: "30日連続ログイン",
    rarity: "epic",
  },
  {
    name: "デイリーチャンピオン",
    nameEn: "Daily Champion",
    description: "デイリーチャレンジを30回完了した",
    category: "special",
    iconName: "🏆",
    condition: "30回デイリー完了",
    rarity: "rare",
  },
  {
    name: "博識",
    nameEn: "Knowledgeable",
    description: "全カテゴリーで成功した",
    category: "special",
    iconName: "📚",
    condition: "全カテゴリー成功",
    rarity: "rare",
  },
  {
    name: "エリート",
    nameEn: "Elite",
    description: "レベル50に到達した",
    category: "special",
    iconName: "💫",
    condition: "レベル50",
    rarity: "legendary",
  },
]

async function main() {
  console.log('シードデータの投入を開始します...')

  // Terms
  console.log('\n用語データの投入中...')
  for (const term of terms) {
    await prisma.term.upsert({
      where: { word: term.word },
      update: {},
      create: term,
    })
    console.log(`✓ ${term.word} を作成しました`)
  }
  console.log(`✅ ${terms.length}個の用語を投入しました`)

  // Badges
  console.log('\nバッジデータの投入中...')
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    })
    console.log(`✓ ${badge.name} を作成しました`)
  }
  console.log(`✅ ${badges.length}個のバッジを投入しました`)
}

main()
  .catch((e) => {
    console.error('❌ エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
