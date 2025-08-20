"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart } from "lucide-react"
import { useState, useEffect } from "react"

interface Artist {
  name: string
  playcount: string
}

interface DataVisualizationsProps {
  artists: Artist[]
  topTracks: any[]
  insights: any
  username: string
}

export default function DataVisualizations({ artists, topTracks, insights, username }: DataVisualizationsProps) {
  const [genreData, setGenreData] = useState([{ name: "Loading...", percentage: 100, color: "bg-primary" }])

  const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY

  useEffect(() => {
    if (username) {
      fetchTopTracksAndTags()
    }
  }, [username])

  const fetchTopTracksAndTags = async () => {
    try {
      const tracksResponse = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${API_KEY}&format=json&limit=20`,
      )
      const tracksData = await tracksResponse.json()

      if (tracksData.error || !tracksData.toptracks?.track) {
        return
      }

      const tracks = tracksData.toptracks.track
      const tagCounts = new Map()

      for (const track of tracks.slice(0, 10)) {
        try {
          const tagsResponse = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`,
          )
          const tagsData = await tagsResponse.json()

          if (tagsData.toptags?.tag) {
            const trackTags = Array.isArray(tagsData.toptags.tag) ? tagsData.toptags.tag : [tagsData.toptags.tag]

            trackTags.slice(0, 3).forEach((tag: { name: string }, index: number) => {
              const weight = 3 - index
              const tagName = tag.name.toLowerCase()
              tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + weight)
            })
          }
        } catch (error) {
          console.error(`Error fetching tags for ${track.name}:`, error)
        }
      }

      const sortedTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)

      if (sortedTags.length > 0) {
        const totalWeight = sortedTags.reduce((sum, [, weight]) => sum + weight, 0)
        const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"]

        const newGenreData = sortedTags.map(([tag, weight], index) => ({
          name: tag.charAt(0).toUpperCase() + tag.slice(1),
          percentage: Math.round((weight / totalWeight) * 100),
          color: colors[index],
        }))

        setGenreData(newGenreData)
      }
    } catch (error) {
      console.error("Error fetching tracks and tags:", error)
    }
  }

  const generateListeningHeatmap = () => {
    const weeks = 52
    const days = 7
    const heatmapData = []

    const totalPlays = artists.reduce((sum, artist) => sum + Number.parseInt(artist.playcount), 0)
    const avgDailyPlays = Math.floor(totalPlays / (weeks * days))

    for (let week = 0; week < weeks; week++) {
      const weekData = []
      for (let day = 0; day < days; day++) {
        const baseIntensity = Math.floor(avgDailyPlays / 50)
        const randomVariation = Math.floor(Math.random() * 3)
        const intensity = Math.min(4, Math.max(0, baseIntensity + randomVariation))
        weekData.push(intensity)
      }
      heatmapData.push(weekData)
    }
    return heatmapData
  }

  const calculateDiversityTimeline = () => {
    const timeline = []
    const totalArtists = artists.length

    for (let i = 0; i < Math.min(10, totalArtists); i++) {
      const artist = artists[i]
      const plays = Number.parseInt(artist.playcount)
      const topArtistPlays = Number.parseInt(artists[0].playcount)

      timeline.push({
        artist: artist.name,
        plays: plays,
        percentage: (plays / topArtistPlays) * 100,
      })
    }
    return timeline
  }

  const heatmapData = generateListeningHeatmap()
  const diversityData = calculateDiversityTimeline()

  // Varianti per le animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Ritardo tra le animazioni dei figli
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-primary mb-2">📊 Garden Analytics</h2>
        <p className="text-muted-foreground">Deep insights into your musical ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Distribution Flower */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-secondary" />
                Musical Flower Petals
              </CardTitle>
              <p className="text-sm text-muted-foreground">Top genres from your track tags</p>
            </CardHeader>
            <CardContent>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-8 border-muted flex items-center justify-center">
                  <span className="text-2xl">🌻</span>
                </div>
                {genreData.map((genre, index) => {
                  const angle = index * 90 - 90
                  const x = Math.cos((angle * Math.PI) / 180) * 80
                  const y = Math.sin((angle * Math.PI) / 180) * 80
                  return (
                    <motion.div
                      key={genre.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5, type: "spring" }}
                      className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        left: `calc(50% + ${x}px - 16px)`,
                        top: `calc(50% + ${y}px - 16px)`,
                        backgroundColor: genre.color.includes("red")
                          ? "#ef4444"
                          : genre.color.includes("blue")
                            ? "#3b82f6"
                            : genre.color.includes("green")
                              ? "#22c55e"
                              : "#a855f7",
                      }}
                    >
                      {genre.percentage}%
                    </motion.div>
                  )
                })}
              </div>
              <div className="space-y-2">
                {genreData.map((genre) => (
                  <motion.div
                    key={genre.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + genreData.indexOf(genre) * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${genre.color}`} />
                      <span className="text-sm">{genre.name}</span>
                    </div>
                    <Badge variant="outline">{genre.percentage}%</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Artist Diversity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Plant Diversity Spectrum
              </CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of your top artists</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diversityData.slice(0, 8).map((item, index) => (
                  <motion.div
                    key={item.artist}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate flex-1 mr-2">{item.artist}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.plays.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 1 }}
                        className={`h-2 rounded-full ${index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : index < 3
                            ? "bg-gradient-to-r from-green-400 to-blue-500"
                            : "bg-gradient-to-r from-purple-400 to-pink-500"
                          }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}