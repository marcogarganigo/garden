  "use client"

  import type React from "react"
  import { motion, AnimatePresence } from "framer-motion"

  import { useState } from "react"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Card, CardContent } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { Loader2, Music, Sparkles, Leaf, MessageSquare } from "lucide-react"
  import { GitHubIcon } from "@/components/icons/Github"
  import PlantCard from "./PlantCard"
  import GardenStats from "./GardenStats"
  import MusicInsights from "./MusicInsights"
  import DataVisualizations from "./DataVisualizations"
  import GardenLevel from "./GardenLevel"
  import { ArtistModal } from "./ArtistModal"

  interface Artist {
    name: string
    playcount: string
    url: string
    image?: Array<{ "#text": string; size: string }>
  }

  interface LastFmResponse {
    topartists: {
      artist: Artist[]
    }
    error?: number
    message?: string
  }

  interface UserInfoResponse {
    user: {
      name: string
      playcount: string
      track_count: string
      artist_count: string
      registered: {
        unixtime: string
      }
      country?: string
      image?: Array<{ "#text": string; size: string }>
    }
    error?: number
    message?: string
  }

  interface TopTracksResponse {
    toptracks: {
      track: Array<{
        name: string
        playcount: string
        artist: { name: string }
      }>
    }
    error?: number
  }

  interface TopAlbumsResponse {
    topalbums: {
      album: Array<{
        name: string
        playcount: string
        artist: { name: string }
      }>
    }
    error?: number
  }

  interface RecentTracksResponse {
    recenttracks: {
      track: Array<{
        name: string
        artist: { "#text": string }
        album?: { "#text": string }
        "@attr"?: { nowplaying: string }
      }>
    }
    error?: number
  }

  export default function MusicalGarden() {
    const [username, setUsername] = useState("")
    const [displayedUsername, setDisplayedUsername] = useState("")
    const [artists, setArtists] = useState<Artist[]>([])
    const [userStats, setUserStats] = useState<{ totalPlays: number; artistCount: number; tracksCount: number; userInfo?: any } | null>(null)
    const [musicInsights, setMusicInsights] = useState<any>(null)
    const [topTracks, setTopTracks] = useState<any[]>([])
    const [topAlbums, setTopAlbums] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [gardenCreated, setGardenCreated] = useState(false)

    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
    const [artistDetails, setArtistDetails] = useState<any>(null)
    const [artistTopTracks, setArtistTopTracks] = useState<any[]>([])
    const [isModalLoading, setIsModalLoading] = useState(false)

    const API_KEY = atob(process.env.NEXT_PUBLIC_LASTFM_API_KEY || "")

    const FEEDBACK_URL = "https://github.com/marcogarganigo/garden/issues/new/choose";
    const GITHUB_URL = "https://github.com/marcogarganigo/garden";
    
    const fetchUserInfo = async (user: string) => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${API_KEY}&format=json`
      try {
        const response = await fetch(url)
        const data: UserInfoResponse = await response.json()

        if (data.error) {
          return null
        }

        return {
          totalPlays: Number.parseInt(data.user.playcount),
          tracksCount: Number.parseInt(data.user.track_count),
          artistCount: Number.parseInt(data.user.artist_count),
          memberSince: data.user.registered ? Number.parseInt(data.user.registered.unixtime) : null,
          country: data.user.country || null,
          userInfo: {
            name: data.user.name,
            image: data.user.image,
          },
        }
      } catch (err) {
        console.error("Error fetching user info:", err)
        return null
      }
    }

    const fetchTopTracks = async (user: string) => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${API_KEY}&format=json&limit=10`

      try {
        const response = await fetch(url)
        const data: TopTracksResponse = await response.json()

        if (data.error) return []
        return data.toptracks.track || []
      } catch (err) {
        console.error("Error fetching top tracks:", err)
        return []
      }
    }

    const fetchTopAlbums = async (user: string) => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${API_KEY}&format=json&limit=10`

      try {
        const response = await fetch(url)
        const data: TopAlbumsResponse = await response.json()

        if (data.error) return []
        return data.topalbums.album || []
      } catch (err) {
        console.error("Error fetching top albums:", err)
        return []
      }
    }

    const fetchRecentTracks = async (user: string) => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${API_KEY}&format=json&limit=50`

      try {
        const response = await fetch(url)
        const data: RecentTracksResponse = await response.json()

        if (data.error) return []
        return data.recenttracks.track || []
      } catch (err) {
        console.error("Error fetching recent tracks:", err)
        return []
      }
    }

    const calculateMusicInsights = (artists: Artist[], recentTracks: any[], userInfo: any) => {
      const totalPlays = artists.reduce((sum, artist) => sum + Number.parseInt(artist.playcount), 0)
      const avgPlays = totalPlays / artists.length
      const variance =
        artists.reduce((sum, artist) => sum + Math.pow(Number.parseInt(artist.playcount) - avgPlays, 2), 0) /
        artists.length
      const artistDiversity = Math.round(Math.max(0, 100 - (Math.sqrt(variance) / avgPlays) * 20))

      const topArtistPlays = artists.slice(0, 5).reduce((sum, artist) => sum + Number.parseInt(artist.playcount), 0)
      const loyaltyScore = Math.round((topArtistPlays / totalPlays) * 100)

      const explorationScore = Math.round(artistDiversity)
      return {
        totalPlays: userInfo?.totalPlays || totalPlays,
        artistDiversity,
        explorationScore,
        loyaltyScore,
        memberSince: userInfo?.memberSince,
        country: userInfo?.country,
      }
    }

    const fetchTopArtists = async (user: string) => {
      if (!user.trim()) {
        setError("Please enter a username!")
        return
      }

      setLoading(true)
      setError("")
      setGardenCreated(false)

      try {
        const [userInfo, artistsResponse] = await Promise.all([
          fetchUserInfo(user),
          fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${API_KEY}&format=json&limit=25`,
          ),
        ])

        const data: LastFmResponse = await artistsResponse.json()

        if (data.error) {
          setError(`Error: ${data.message}. Please check the username.`)
          setArtists([])
          setUserStats(null)
          setMusicInsights(null)
          return
        }

        const artistsData = data.topartists.artist || []
        const insights = calculateMusicInsights(artistsData, [], userInfo)

        setArtists(artistsData)
        setUserStats(userInfo)
        setMusicInsights(insights)
        setTopTracks([])
        setTopAlbums([])
        setGardenCreated(true)
        setDisplayedUsername(username)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Something went wrong. Please try again later.")
        setArtists([])
        setUserStats(null)
        setMusicInsights(null)
      } finally {
        setLoading(false)
      }
    }

    const handlePlantClick = async (artist: Artist) => {
      setSelectedArtist(artist);
      setIsModalLoading(true);

      try {
        const [artistInfoResponse, topTracksResponse] = await Promise.all([
          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json`),
          fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artist.name)}&api_key=${API_KEY}&format=json&limit=5`),
        ]);

        const artistInfoData = await artistInfoResponse.json();
        const topTracksData = await topTracksResponse.json();

        const topTags = artistInfoData.artist?.tags?.tag?.slice(0, 5) || [];

        setSelectedArtist(artist);
        setArtistDetails({ ...artistInfoData.artist, tags: topTags });
        setArtistTopTracks(topTracksData.toptracks?.track || []);

      } catch (error) {
        console.error("Error fetching artist details:", error);
        setArtistDetails({});
        setArtistTopTracks([]);
      } finally {
        setIsModalLoading(false);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      fetchTopArtists(username)
    }

    return (
      <div className="min-h-screen">
        <div className="absolute top-2 right-4 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          {/* Feedback */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 bg-white/30 text-gray-800 hover:bg-purple-200 hover:text-purple-800 rounded-lg px-3 py-1 shadow-sm transition-all duration-300"
          >
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold text-sm">Feedback & Issues</span>
            </a>
          </Button>

          {/* GitHub */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center justify-center bg-white/30 text-gray-800 hover:bg-purple-200 hover:text-purple-800 rounded-lg p-2 shadow-sm transition-all duration-300"
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="flex items-center"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          </Button>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Sparkles className="w-8 h-8 text-secondary" />
              <h1 className="text-5xl md:text-6xl font-serif font-black">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 hover:scale-105">Garden</span>
                <span onClick={() => window.location.reload()} className="bg-gradient-to-r from-secondary to-purple-500 bg-clip-text text-transparent inline-block transition-all duration-300 hover:scale-105 cursor-pointer">.fm</span>
              </h1>
              <Music className="w-8 h-8 text-accent animate-pulse-slow" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-6 max-w-2xl mx-auto"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cultivate your musical ecosystem. Plant seeds from your{" "}
                <a
                  href="https://last.fm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Last.fm
                </a>{" "}
                listening history and watch your personal garden flourish with every beat,
                melody, and rhythm you cherish.
              </p>
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                href="/info"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-primary/40 text-sm font-semibold 
                          text-primary/90 hover:text-primary hover:border-primary bg-background/40 backdrop-blur-sm 
                          transition-all duration-300 shadow-sm hover:shadow-md"
              >
                How It Works
              </motion.a>*
            </motion.div>
          </div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row max-w-xl mx-auto items-center justify-center gap-4 mb-12"
          >
            <div className="flex-1 w-full">
              <Input
                id="username"
                type="text"
                placeholder="Your Last.fm username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary transition-colors bg-background/50 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !username.trim()}
              className="cursor-pointer h-12 text-lg font-semibold px-8 bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Planting...
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5 mr-2" />
                  Plant My Garden
                </>
              )}
            </Button>
          </motion.form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto p-4 mb-8 bg-destructive/10 border border-destructive/20 rounded-lg text-center"
              >
                <p className="text-destructive text-sm">{error}</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center gap-3 text-lg text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Your musical garden is taking root...
                </div>
              </motion.div>
            )}

            {artists.length > 0 && !loading && (
              <motion.div
                key="garden-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GardenLevel
                  totalPlays={userStats?.totalPlays ?? 0}
                  artistCount={userStats?.artistCount ?? 0}
                  tracksCount={userStats?.tracksCount ?? 0}
                  gardenSize={artists.length}
                  insights={musicInsights}
                  userInfo={userStats?.userInfo}
                />

                <GardenStats artists={artists} userStats={userStats} />

                <div className="space-y-8 mb-12">
                  <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">🌿 {displayedUsername}'s Musical Garden</h2>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {artists.length} flourishing plants
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols- gap-6">
                    <AnimatePresence>
                      {artists.map((artist, index) => (
                        <motion.div
                          key={`${artist.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <PlantCard artist={artist} index={index} onClick={() => handlePlantClick(artist)} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {musicInsights && (
                  <div className="space-y-8 mb-12">
                    <MusicInsights insights={musicInsights} topTracks={topTracks} topAlbums={topAlbums} />
                    <DataVisualizations artists={artists} topTracks={topTracks} insights={musicInsights} username={username} />
                  </div>
                )}
              </motion.div>
            )}

            {artists.length === 0 && !loading && gardenCreated && (
              <motion.div
                key="no-plants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-lg text-muted-foreground">No plants found for this gardener.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedArtist && (
            <ArtistModal
              artist={selectedArtist}
              onClose={() => setSelectedArtist(null)}
              artistDetails={artistDetails}
              topTracks={artistTopTracks}
              isLoading={isModalLoading}
            />
          )}
        </div>
      </div>
    )
  }