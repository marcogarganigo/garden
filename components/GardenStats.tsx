"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Music, Award, Zap } from "lucide-react"
import { motion, useTransform, useMotionValue, animate } from "framer-motion"
import { useEffect } from "react"

interface Artist {
  name: string
  playcount: string
}

interface GardenStatsProps {
  artists: Artist[]
  userStats?: { totalPlays: number; artistCount: number } | null
}

function useAnimatedNumber(value: number) {
  const motionValue = useMotionValue(0);
  const roundedValue = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const duration = value > 10000 ? 0.8 : 1.5;
    const controls = animate(motionValue, value, { duration: duration, ease: "easeInOut" });
    return controls.stop;
  }, [motionValue, value]);

  return roundedValue;
}


export default function GardenStats({ artists, userStats }: GardenStatsProps) {
  const totalPlays =
    userStats?.totalPlays || artists.reduce((sum, artist) => sum + Number.parseInt(artist.playcount), 0)
  const topArtist = artists[0]
  const averagePlays = userStats
    ? Math.round(userStats.totalPlays / userStats.artistCount)
    : Math.round(totalPlays / artists.length)

  // Categorize plants
  const plantCategories = {
    trees: artists.filter((a) => Number.parseInt(a.playcount) >= 5000).length,
    flowers: artists.filter((a) => Number.parseInt(a.playcount) >= 1000 && Number.parseInt(a.playcount) < 5000).length,
    sprouts: artists.filter((a) => Number.parseInt(a.playcount) < 1000).length,
  }

  const animatedTotalPlays = useAnimatedNumber(totalPlays);
  const animatedAveragePlays = useAnimatedNumber(averagePlays);
  const animatedTopArtistPlays = useAnimatedNumber(Number.parseInt(topArtist?.playcount || "0"));
  const animatedTrees = useAnimatedNumber(plantCategories.trees);
  const animatedFlowers = useAnimatedNumber(plantCategories.flowers);
  const animatedSprouts = useAnimatedNumber(plantCategories.sprouts);


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const totalMinutes = Math.floor(totalPlays * 3.5)
  const remainingMinutes = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingHours = totalHours % 24
  const days = Math.floor(totalHours / 24)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.5 }}
        className="lg:col-span-2"
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music className="w-4 h-4" />
              Total Plays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary mb-1">
              <motion.span>{animatedTotalPlays}</motion.span>
              <span className="text-xs font-medium text-muted-foreground ml-2">plays</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex flex-col items-center justify-center bg-primary/5 py-3 rounded-xl border border-primary/10 px-2">
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider mb-1">Minutes</span>
                <span className="text-sm font-black text-primary truncate w-full text-center">{totalMinutes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-secondary/5 py-3 rounded-xl border border-secondary/10 px-2">
                <span className="text-[10px] font-bold text-secondary/70 uppercase tracking-wider mb-1">Hours</span>
                <span className="text-sm font-black text-secondary truncate w-full text-center">{totalHours.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-accent/5 py-3 rounded-xl border border-accent/10 px-2">
                <span className="text-[10px] font-bold text-accent/70 uppercase tracking-wider mb-1">Days</span>
                <span className="text-sm font-black text-accent truncate w-full text-center">{days.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/60 text-center mt-4 font-medium italic">
              {userStats ? "Based on your full Last.fm profile history" : "Based on top artists shown in your garden"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Top Artist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary line-clamp-1">{topArtist?.name}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <motion.span>{animatedTopArtistPlays}</motion.span> plays
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Average Plays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              <motion.span>{animatedAveragePlays}</motion.span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per artist {userStats ? `(${userStats.artistCount.toLocaleString()} total)` : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4, duration: 0.5 }}
        className="lg:col-span-4"
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Garden Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">🌳 Trees</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black"><motion.span>{animatedTrees}</motion.span></span>
                   <Badge variant="outline" className="text-[10px]">Mature artists</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">🌻 Flowers</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black"><motion.span>{animatedFlowers}</motion.span></span>
                   <Badge variant="outline" className="text-[10px]">Growing artists</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">🌱 Sprouts</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black"><motion.span>{animatedSprouts}</motion.span></span>
                   <Badge variant="outline" className="text-[10px]">New discoveries</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}