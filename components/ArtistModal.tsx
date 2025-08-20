"use client"

import { motion } from "framer-motion"
import { X, Globe, Play, ListMusic, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Artist {
    name: string
    playcount: string
    url: string
    image?: Array<{ "#text": string; size: string }>
}

interface ArtistModalProps {
    artist: Artist
    onClose: () => void
    artistDetails: any
    topTracks: any[]
    isLoading: boolean
}

// Funzione per formattare i numeri grandi in un formato più leggibile
const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
};

export const ArtistModal = ({ artist, onClose, artistDetails, topTracks, isLoading }: ArtistModalProps) => {

    const artistImage = artistDetails?.image?.find((img: any) => img.size === "extralarge")?.["#text"] || "/placeholder-artist.svg"

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-2xl bg-card rounded-xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-muted-foreground hover:bg-muted"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>

                {isLoading ? (
                    <div className="flex items-center justify-center h-80 sm:h-96 p-8">
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                            </motion.div>
                            <span className="text-sm sm:text-base text-muted-foreground">Caricamento dettagli artista...</span>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl max-h-[90vh] flex flex-col">
                        <div className="relative flex-shrink-0">
                            <img
                                src={artistImage}
                                alt={artist.name}
                                className="w-full h-48 sm:h-64 object-cover rounded-t-xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white drop-shadow-lg">
                                    {artist.name}
                                </h2>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-accent py-1 px-3 text-xs sm:text-sm font-semibold text-white shadow-md mt-1">
                                    <Play className="w-3 h-3" />
                                    <span>{formatNumber(Number(artist.playcount))} total plays</span>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-grow p-4 sm:p-6">
                            <div className="text-center mb-6">
                                <Button asChild className="w-full">
                                    <a href={artist.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Last.fm
                                    </a>
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {artistDetails?.tags && artistDetails.tags.length > 0 && (
                                    <>
                                        <h3 className="text-lg sm:text-xl font-bold font-serif text-primary">
                                            <Tag className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Top Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {artistDetails.tags.map((tag: any, index: number) => (
                                                <Badge key={index} variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-xs sm:text-sm">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                {topTracks.length > 0 && (
                                    <>
                                        <h3 className="text-lg sm:text-xl font-bold font-serif text-primary">
                                            <ListMusic className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Top Tracks
                                        </h3>
                                        <ul className="space-y-2">
                                            {topTracks.map((track, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm sm:text-base text-foreground">
                                                    <span className="font-bold text-primary">{index + 1}.</span>
                                                    <span className="truncate">{track.name}</span>
                                                    <div className="ml-auto inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-primary/20 text-primary text-xs sm:text-sm">
                                                        <Play className="w-2 h-2 sm:w-3 sm:h-3" />
                                                        <span>{formatNumber(Number(track.playcount))}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}