"use client"

export function OngoingMissions() {
  const missions = [
    {
      id: '1',
      title: 'Soの粉糖 vs 圧言榛',
      subtitle: '音響芷建A vs 尼黙ぐん',
      progress: 50,
      status: 'Awaiting Judgment',
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg text-gray-300">Ongoing Missions</h2>
      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="p-4 rounded-lg border border-cyan-500/20 bg-[#1a1d2e]/50 space-y-3"
          >
            <div>
              <div className="text-sm text-white mb-1">{mission.title}</div>
              <div className="text-xs text-gray-400">{mission.subtitle}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400">~{mission.progress}% Complete</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">{mission.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
