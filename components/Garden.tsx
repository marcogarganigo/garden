"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Music, Sparkles, Leaf, MessageSquare, Zap, Link, X, User } from "lucide-react"
import { GitHubIcon } from "@/components/icons/Github"
import PlantCard from "./PlantCard"
import GardenStats from "./GardenStats"
import MusicInsights from "./MusicInsights"
import DataVisualizations from "./DataVisualizations"
import GardenLevel from "./GardenLevel"
import { ArtistModal } from "./ArtistModal"
import bush from "../public/bush-right.png";

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

  useEffect(() => {
    const savedUsername = localStorage.getItem("garden-username");
    if (savedUsername) {
      setUsername(savedUsername);
      fetchTopArtists(savedUsername);
    }

    // Show the new feature notification when the component mounts if not dismissed
    const toastDismissed = localStorage.getItem("stats-toast-dismissed-v3");
    if (!toastDismissed) {
      setTimeout(() => {
        toast("🌍 Artist Rankings & Persistence!", {
          id: "stats-update-toast",
          description: "Garden.fm now remembers your profile and shows your true global percentile for every artist.",
          action: {
            label: "Changelog",
            onClick: () => {
              localStorage.setItem("stats-toast-dismissed-v3", "true");
              window.location.href = "/changelog";
            },
          },
          onDismiss: () => localStorage.setItem("stats-toast-dismissed-v3", "true"),
          onAutoClose: () => localStorage.setItem("stats-toast-dismissed-v3", "true"),
          duration: Infinity,
        });
      }, 1000);
    }
  }, []);

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
      setDisplayedUsername(user)
      localStorage.setItem("garden-username", user)
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
    <div className="min-h-screen flex flex-col relative">
      <AnimatePresence>
        {gardenCreated && userStats?.userInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] hidden md:block"
          >
            <a
              href={`https://www.last.fm/user/${userStats.userInfo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-background/80 backdrop-blur-xl p-1.5 pr-4 rounded-full border border-primary/20 shadow-xl hover:shadow-primary/10 hover:border-primary/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center shrink-0">
                {userStats.userInfo.image?.find((img: any) => img.size === "medium")?.["#text"] ? (
                  <img
                    src={userStats.userInfo.image.find((img: any) => img.size === "medium")?.["#text"]}
                    alt={userStats.userInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground leading-none mb-0.5">Gardener</span>
                <span className="text-sm font-black text-foreground leading-none group-hover:text-primary transition-colors">{userStats.userInfo.name}</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <Sparkles className="w-7 h-7 text-secondary animate-pulse" />

            <div className="flex items-end font-serif font-black leading-none">

              {/* Garden.fm */}
              <div className="flex items-end">

                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-5xl md:text-7xl font-black tracking-[-0.02em]
                              bg-gradient-to-b from-green-500 via-green-700 to-green-900
                              bg-clip-text text-transparent
                              drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                >
                  Garden
                </motion.span>

                <motion.span
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  className="ml-1 text-3xl md:text-5xl font-bold 
                              bg-gradient-to-br from-secondary to-purple-500 
                              bg-clip-text text-transparent 
                              cursor-pointer translate-y-[-4px]"
                >
                  .fm
                </motion.span>

              </div>

              {/* rose */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-rose-500 ml-3 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(244,63,94,0))",
                    "drop-shadow(0 0 8px rgba(244,63,94,0.35))",
                    "drop-shadow(0 0 0px rgba(244,63,94,0))",
                  ],
                }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.3 },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <motion.path
                  d="M17 10h-1a4 4 0 1 1 4-4v.534"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.path
                  d="M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.1 }}
                />
                <motion.path
                  d="M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                />
                <motion.path
                  d="M9.77 12C4 15 2 22 2 22"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
                <motion.circle
                  cx="17"
                  cy="8"
                  r="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />
              </motion.svg>

            </div>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Music className="w-7 h-7 text-accent" />
            </motion.div>
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
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                href="info"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-primary/40 text-sm font-semibold 
                            text-primary/90 hover:text-primary hover:border-primary bg-background/40 backdrop-blur-sm 
                            transition-all duration-300 shadow-sm hover:shadow-md"
              >
                How It Works
              </motion.a>

              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                href="changelog"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-secondary/40 text-sm font-semibold 
                            text-secondary/90 hover:text-secondary hover:border-secondary bg-background/40 backdrop-blur-sm 
                            transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Zap className="w-4 h-4 mr-2 text-secondary" />
                Changelog
              </motion.a>
            </div>
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
                  <h2 className="text-3xl font-serif font-bold text-primary mb-4 flex items-center justify-center gap-3">
                    🌿 {displayedUsername}'s Musical Garden
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem("garden-username");
                        window.location.reload();
                      }}
                      className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                      title="Forget this gardener"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </h2>
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
      <footer className="mt-24 overflow-hidden bg-transparent">
        <img
          src={bush.src}
          alt="Bush"
          width="200"
          className="absolute bottom-0 right-12 "
        />

        <div className="relative container mx-auto px-4 py-20 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Your garden isn’t finished — it grows with you 🌱
          </p>

          {/* Signs in the garden */}
          <div className="flex flex-wrap items-center justify-center gap-6">


            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-lg shadow-lg hover:bg-white"
            >
              <GitHubIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">GitHub</span>
            </a>

            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-200/60 px-4 py-2 rounded-lg shadow-lg hover:bg-green-200"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold text-sm">Feedback</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
