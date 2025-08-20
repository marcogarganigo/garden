"use client"

import { motion, useTransform, useMotionValue, animate } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Trophy, Star, Sparkles } from "lucide-react";
import { useEffect } from "react";


interface GardenLevelProps {
  totalPlays: number
  artistCount: number
  tracksCount: number
  gardenSize: number
  insights?: any
  userInfo?: {
    name: string
    image?: Array<{ size: string; "#text": string }>
  }
}

// Helper function to create the counting animation
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

export default function GardenLevel({ totalPlays, artistCount, tracksCount, gardenSize, insights, userInfo }: GardenLevelProps) {
  const calculateXP = () => {
    // Calculate XP based on unique tracks instead of total plays
    const tracksXp = Math.floor(tracksCount / 5)
    const tracksCountXp = tracksCount 
    const artistsXp = artistCount * 2
    return tracksXp + artistsXp + tracksCountXp
  }

  const calculateLevel = (xp: number) => {
    const level = Math.floor(Math.sqrt(xp / 10)) + 1
    return Math.min(level, 100)
  }

  const getXPForLevel = (level: number) => {
    if (level <= 1) return 0
    if (level > 100) return 99 * 99 * 10
    return (level - 1) * (level - 1) * 10
  }

  const getGardenerTitle = (level: number) => {
    if (level >= 100) return "🌳 Master Gardener"
    if (level >= 75) return "🌺 Expert Gardener"
    if (level >= 50) return "🌿 Skilled Gardener"
    if (level >= 25) return "🌱 Growing Gardener"
    return "🌰 New Gardener"
  }

  const currentXP = calculateXP()
  const currentLevel = calculateLevel(currentXP)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  const progressXP = currentXP - currentLevelXP
  const neededXP = nextLevelXP - currentLevelXP
  const progressPercentage = currentLevel >= 100 ? 100 : (progressXP / neededXP) * 100

  const title = getGardenerTitle(currentLevel)

  const profileImage =
    userInfo?.image?.find((img) => img.size === "large")?.["#text"] ||
    userInfo?.image?.find((img) => img.size === "medium")?.["#text"]

  const animatedTracksCount = useAnimatedNumber(tracksCount); // Animation for tracksCount
  const animatedArtistCount = useAnimatedNumber(artistCount);
  const animatedCurrentXP = useAnimatedNumber(currentXP);

  // Animate the progress bar values only if the level is less than 100
  const animatedProgressXP = currentLevel < 100 ? useAnimatedNumber(progressXP) : null;
  const animatedNeededXP = currentLevel < 100 ? useAnimatedNumber(neededXP) : null;

  return (
    <Card className="card-glow border-0 shadow-xl mb-8">
      <CardContent className="p-6">
        {/* Header with a slight motion animation */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            {profileImage ? (
              <img
                src={profileImage || "/placeholder.svg"}
                alt={userInfo?.name || "User"}
                className="w-12 h-12 rounded-full border-2 border-primary/20"
              />
            ) : (
              <div className="p-2 bg-primary/10 rounded-full">
                {currentLevel >= 100 ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : currentLevel >= 75 ? (
                  <Trophy className="w-6 h-6 text-primary" />
                ) : currentLevel >= 50 ? (
                  <Star className="w-6 h-6 text-primary" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
              </div>
            )}
            <div>
              <h3 className="text-xl font-serif font-bold text-primary">Level {currentLevel} Gardener</h3>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>
          {/* XP Badge with a tap animation */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
              <motion.span>{animatedCurrentXP}</motion.span> XP
            </Badge>
          </motion.div>
        </motion.div>

        {currentLevel < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-muted-foreground">
                Progress to <span className="text-primary">Level {currentLevel + 1}</span>
              </span>
              <span className="text-foreground">
                <motion.span>{animatedProgressXP}</motion.span> / <motion.span>{animatedNeededXP}</motion.span> XP
              </span>
            </div>
            {/* Animated progress bar with Framer Motion */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(progressXP / neededXP) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-3 rounded-full bg-primary/20"
            >
              <div
                className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                style={{ width: `100%` }}
              />
            </motion.div>
          </div>
        )}

        {currentLevel >= 100 && (
          <motion.div
            className="text-center py-2 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <p>🏆 Max Level Reached!</p>

          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
          {/* Statistics without entry animation to avoid conflicting with the count */}
          <motion.div
            className="text-center"
          >
            <div className="text-2xl font-bold text-primary"><motion.span>{animatedTracksCount}</motion.span></div>
            <div className="text-xs text-muted-foreground">Unique Tracks</div>
          </motion.div>
          <motion.div
            className="text-center"
          >
            <div className="text-2xl font-bold text-secondary"><motion.span>{animatedArtistCount}</motion.span></div>
            <div className="text-xs text-muted-foreground">Artists Unlocked</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}