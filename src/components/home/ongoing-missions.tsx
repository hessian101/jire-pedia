"use client"

import { Target, Clock } from 'lucide-react'

export function OngoingMissions() {
  const missions = [
    {
      id: '1',
      title: 'Soの粉糖 vs 圧言榛',
      subtitle: '音響芷建A vs 尼黙ぐん',
      progress: 50,
      status: 'Voting',
      timeLeft: '2h 15m'
    },
    {
      id: '2',
      title: '量子コンピュータの解説',
      subtitle: 'Challenge by @tech_master',
      progress: 80,
      status: 'Drafting',
      timeLeft: '45m'
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Active Missions</h2>
      </div>

      <div className="grid gap-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                  {mission.title}
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-1">{mission.subtitle}</div>
              </div>
              <span className={`
                text-[10px] px-2 py-0.5 rounded-full border
                ${mission.status === 'Voting'
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/20'}
              `}>
                {mission.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Progress</span>
                <span>{mission.progress}%</span>
              </div>

              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-500 pt-1">
                <Clock className="w-3 h-3" />
                <span>{mission.timeLeft} remaining</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
