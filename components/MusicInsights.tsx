interface MusicInsightsProps {
  insights: {
    totalPlays: number
    artistDiversity: number
    explorationScore: number
    loyaltyScore: number
    memberSince?: number
    country?: string
  }
  topTracks: any[]
  topAlbums: any[]
}

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

  return (
    <div className="space-y-6 mt-8">
      {/* Music Personality */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
        <h3 className="text-xl font-semibold mb-4 text-foreground">🎵 Your Music Personality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-background/30 rounded-lg">
            <div className="text-3xl mb-2">{exploration.emoji}</div>
            <div className={`font-semibold ${exploration.color}`}>{exploration.level}</div>
            <div className="text-sm text-muted-foreground">Exploration Score: {insights.explorationScore}/100</div>
          </div>
          <div className="text-center p-4 bg-background/30 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className={`font-semibold ${loyalty.color}`}>{loyalty.level}</div>
            <div className="text-sm text-muted-foreground">Loyalty Score: {insights.loyaltyScore}/100</div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-semibold mb-4 text-foreground">📊 Profile Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          {insights.memberSince && (
            <div>
              <div className="text-2xl font-bold text-primary">{new Date().getFullYear() - insights.memberSince}</div>
              <div className="text-sm text-muted-foreground">Years on Last.fm</div>
            </div>
          )}
          <div>
            <div className="text-2xl font-bold text-primary">{Math.round(insights.totalPlays / 365)}</div>
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
