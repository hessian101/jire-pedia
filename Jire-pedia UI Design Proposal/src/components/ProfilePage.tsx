import { Trophy, Target, Flame, Crown, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

export function ProfilePage() {
  const userStats = {
    name: 'TechExplainer',
    level: 12,
    totalAttempts: 156,
    successCount: 89,
    successRate: 57,
    currentStreak: 7,
    bestStreak: 15,
    throneCrown: 3,
    totalPoints: 8420,
  };

  const recentActivity = [
    {
      id: '1',
      term: 'リファクタリング',
      score: 92,
      difficulty: 'Easy',
      date: '2時間前',
      success: true,
    },
    {
      id: '2',
      term: 'アジャイル開発',
      score: 76,
      difficulty: 'Normal',
      date: '5時間前',
      success: false,
    },
    {
      id: '3',
      term: 'REST API',
      score: 88,
      difficulty: 'Normal',
      date: '昨日',
      success: true,
    },
  ];

  const badges = [
    { name: '初挑戦', icon: '🎯', unlocked: true },
    { name: '連続7日', icon: '🔥', unlocked: true },
    { name: '王座獲得', icon: '👑', unlocked: true },
    { name: '完全制覇', icon: '⭐', unlocked: false },
    { name: 'マスター', icon: '🏆', unlocked: false },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl">マイページ</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* プロフィール */}
        <Card className="bg-gradient-to-br from-[#0077FF]/20 to-[#00FF88]/10 border-[#0077FF]/30">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20 border-2 border-[#0077FF]">
                <AvatarFallback className="bg-[#0077FF] text-2xl">
                  {userStats.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl mb-1">{userStats.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#0077FF]">Lv. {userStats.level}</Badge>
                  <Badge variant="outline" className="text-[#FFD700] border-[#FFD700]/50">
                    👑 {userStats.throneCrown}個
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-2xl text-[#0077FF]">{userStats.totalPoints}</div>
                <div className="text-sm text-gray-400">合計ポイント</div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-2xl text-[#00FF88]">{userStats.successRate}%</div>
                <div className="text-sm text-gray-400">成功率</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 統計 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6 space-y-4">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              統計
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Target className="w-5 h-5" />
                  <span>総挑戦数</span>
                </div>
                <span className="text-xl">{userStats.totalAttempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Trophy className="w-5 h-5 text-[#00FF88]" />
                  <span>成功数</span>
                </div>
                <span className="text-xl text-[#00FF88]">{userStats.successCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Flame className="w-5 h-5 text-[#FF3366]" />
                  <span>現在の連続記録</span>
                </div>
                <span className="text-xl text-[#FF3366]">{userStats.currentStreak}日</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <span>王座獲得数</span>
                </div>
                <span className="text-xl text-[#FFD700]">{userStats.throneCrown}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* バッジコレクション */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6 space-y-4">
            <h3>バッジコレクション</h3>
            <div className="grid grid-cols-5 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-[#0077FF]/20 to-[#00FF88]/10 border border-[#0077FF]/30'
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 最近の活動 */}
        <Card className="bg-white/5 border-white/10">
          <div className="p-6 space-y-4">
            <h3>最近の活動</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="bg-white/5 border-white/10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={activity.success ? 'text-[#00FF88]' : 'text-[#FF3366]'}>
                          {activity.success ? '✓' : '✗'}
                        </span>
                        <span>{activity.term}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          activity.success
                            ? 'text-[#00FF88] border-[#00FF88]/30'
                            : 'text-[#FF3366] border-[#FF3366]/30'
                        }
                      >
                        {activity.score}点
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{activity.difficulty}</span>
                      <span>•</span>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
