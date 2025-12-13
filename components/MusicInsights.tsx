export default function MusicInsights({ insights, topTracks, topAlbums }: MusicInsightsProps) {
  const getExplorationLevel = (score: number) => {
    if (score >= 80) return { level: "Music Explorer", emoji: "🗺️", color: "text-purple-600" }
    if (score >= 60) return { level: "Genre Hopper", emoji: "🦘", color: "text-blue-600" }
    if (score >= 40) return { level: "Curious Listener", emoji: "🤔", color: "text-green-600" }
    if (score >= 20) return { level: "Comfort Zone", emoji: "🏠", color: "text-orange-600" }
    return { level: "Loyal Fan", emoji: "❤️", color: "text-red-600" }
  }

  const getLoyaltyLevel = (score: number) => {
    if (score >= 70) return { level: "Super Fan", color: "text-red-500" }
    if (score >= 50) return { level: "Dedicated", color: "text-orange-500" }
    if (score >= 30) return { level: "Balanced", color: "text-green-500" }
    return { level: "Explorer", color: "text-blue-500" }
  }

  const exploration = getExplorationLevel(insights.explorationScore)
  const loyalty = getLoyaltyLevel(insights.loyaltyScore)

  // ✅ FIX: calcolo fuori dal JSX
  const daysActive = insights.memberSince
    ? Math.max(1, Math.floor((Date.now() - insights.memberSince * 1000) / (1000 * 60 * 60 * 24)))
    : 1

  const avgPlaysPerDay = (insights.totalPlays / daysActive).toFixed(2)

  return (
    <div className="space-y-6 mt-8">

      {/* Profile Info */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-semibold mb-4 text-foreground">📊 Profile Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">

          {insights.memberSince && (
            <div>
              <div className="text-2xl font-bold text-primary">
                {new Date().getFullYear() - new Date(insights.memberSince * 1000).getFullYear()}
              </div>
              <div className="text-sm text-muted-foreground">Years on Last.fm</div>
              <div className="text-sm text-muted-foreground">
                {new Date(insights.memberSince * 1000).toLocaleDateString()}
              </div>
            </div>
          )}

          <div>
            <div className="text-2xl font-bold text-primary">{avgPlaysPerDay}</div>
            <div className="text-sm text-muted-foreground">Avg plays/day</div>
          </div>

          {insights.country && (
            <div>
              <div className="text-2xl font-bold text-primary">{insights.country}</div>
              <div className="text-sm text-muted-foreground">Country</div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
