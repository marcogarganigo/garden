"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


// Importo icone lucide (colorate via Tailwind)
import {
  TreePine,
  Flower2,
  Flower,
  Rose,
  Leaf,
  Sprout,
  TreeDeciduous
} from "lucide-react"

interface Artist {
  name: string
  playcount: string
  url: string
  image?: Array<{ "#text": string; size: string }>
}

interface PlantCardProps {
  artist: Artist
  index: number
  onClick: () => void
}

export default function PlantCard({ artist, index, onClick }: PlantCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const playcount = Number.parseInt(artist.playcount)

  // Mapping playcount → icona, colore e descrizione
  const getPlantData = (count: number) => {
    if (count >= 20000) {
      return { icon: TreeDeciduous, size: "w-12 h-12", type: "Ancient Tree", color: "text-emerald-600", badge: "bg-emerald-500" }
    } else if (count >= 10000) {
      return { icon: TreePine, size: "w-12 h-12", type: "Mighty Oak", color: "text-green-600", badge: "bg-green-500" }
    } else if (count >= 5000) {
      return { icon: Flower2, size: "w-10 h-10", type: "Sunflower", color: "text-yellow-500", badge: "bg-yellow-400" }
    } else if (count >= 2000) {
      return { icon: Flower, size: "w-9 h-9", type: "Tulip", color: "text-pink-500", badge: "bg-pink-400" }
    } else if (count >= 1000) {
      return { icon: Rose, size: "w-9 h-9", type: "Rose", color: "text-rose-500", badge: "bg-rose-400" }
    } else if (count >= 500) {
      return { icon: Leaf, size: "w-8 h-8", type: "Fern", color: "text-lime-600", badge: "bg-lime-400" }
    } else {
      return { icon: Sprout, size: "w-7 h-7", type: "Sprout", color: "text-amber-600", badge: "bg-amber-600" }
    }
  }

  const plantData = getPlantData(playcount)
  const Icon = plantData.icon
  const animationDelay = `${index * 0.1}s`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, z: 10 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <Card
        className="group transition-all duration-500 hover:shadow-2xl hover:scale-105 border-0 bg-card/80 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ animationDelay }}
      >
        <CardContent className="p-4 text-center space-y-3">
          {/* Plant Icon with subtle hover animation */}
          <motion.div
            animate={isHovered ? { scale: 1.15, rotate: 2 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <Icon className={`${plantData.size} ${plantData.color}`} />
          </motion.div>

          {/* Sparkle Effect on Hover */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-2 text-yellow-400 sparkle">✨</div>
              <div className="absolute bottom-2 left-2 text-yellow-400 sparkle" style={{ animationDelay: "0.5s" }}>
                ✨
              </div>
            </div>
          )}

          {/* Artist Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight text-card-foreground line-clamp-2">
              {artist.name}
            </h3>
            <div className="space-y-1">
              <Badge variant="secondary" className={`text-xs ${plantData.badge} text-white border-0`}>
                {plantData.type}
              </Badge>
              <p className="text-xs font-semibold text-muted-foreground">
                {playcount.toLocaleString()} plays
              </p>
            </div>
          </div>

          {/* Growth Progress Bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, (playcount / 20000) * 100)}%`,
                transitionDelay: animationDelay,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
