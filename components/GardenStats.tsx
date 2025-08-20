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

// Funzione helper per creare l'animazione di conteggio
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

  // Usa il nuovo hook per i numeri che devono essere animati
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


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music className="w-4 h-4" />
              Total Plays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <motion.span>{animatedTotalPlays}</motion.span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {userStats ? "Entire profile" : "Displayed artists"} • ~{Math.round((totalPlays * 3.5) / 60)} hours
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
      >
        <Card className="border-0 bg-card/80 backdrop-blur-sm card-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Garden Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">🌳 Trees</span>
                <Badge variant="outline" className="text-xs">
                  <motion.span>{animatedTrees}</motion.span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">🌻 Flowers</span>
                <Badge variant="outline" className="text-xs">
                  <motion.span>{animatedFlowers}</motion.span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">🌱 Sprouts</span>
                <Badge variant="outline" className="text-xs">
                  <motion.span>{animatedSprouts}</motion.span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}