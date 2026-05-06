"use client"

import { motion } from "framer-motion"
import { X, Globe, Loader2, Trophy, Medal, Star, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

export const ArtistModal = ({ artist, onClose, artistDetails, topTracks, isLoading }: ArtistModalProps) => {

    const getRankingData = (userPlaycount: number, globalListeners: number, globalPlaycount: number) => {
        const avgScrobblesPerListener = globalPlaycount / globalListeners;

        let percentile = 100;
        let rankTitle = "Casual Listener";
        let icon = <Users className="w-8 h-8 text-gray-400" />;
        let color = "text-gray-400";

        if (userPlaycount > avgScrobblesPerListener * 50) {
            percentile = 0.1;
            rankTitle = "God Tier Fan";
            icon = <Trophy className="w-12 h-12 text-yellow-500" />;
            color = "text-yellow-500";
        } else if (userPlaycount > avgScrobblesPerListener * 20) {
            percentile = 1;
            rankTitle = "Elite Superfan";
            icon = <Medal className="w-10 h-10 text-purple-500" />;
            color = "text-purple-500";
        } else if (userPlaycount > avgScrobblesPerListener * 5) {
            percentile = 5;
            rankTitle = "Dedicated Listener";
            icon = <Star className="w-8 h-8 text-blue-500" />;
            color = "text-blue-500";
        } else if (userPlaycount > avgScrobblesPerListener) {
            percentile = 20;
            rankTitle = "Above Average";
            icon = <TrendingUp className="w-8 h-8 text-green-500" />;
            color = "text-green-500";
        } else {
            percentile = 100 - (userPlaycount / avgScrobblesPerListener) * 80;
        }

        const estimatedRank = Math.max(1, Math.floor(globalListeners * (percentile / 100)));
        const percentageOfTotal = ((userPlaycount / globalPlaycount) * 100).toFixed(6);

        return {
            percentile: percentile < 1 ? percentile : Math.round(percentile),
            rank: estimatedRank,
            rankTitle,
            icon,
            color,
            percentageOfTotal,
            avgScrobblesPerListener: Math.round(avgScrobblesPerListener)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl bg-card rounded-xl shadow-2xl relative border border-primary/20 flex flex-col max-h-[85vh] md:max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="absolute cursor-pointer top-4 right-4 z-50 rounded-full w-10 h-10 shadow-md bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </Button>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[400px] p-8">
                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="w-12 h-12 text-primary" />
                                </motion.div>
                                <span className="text-muted-foreground">Calculating your global ranking...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-10 bg-background/95 backdrop-blur-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-primary/10 gap-6 pt-12 md:pt-0">
                                <div className="flex-1 w-full">
                                    <h2 className="text-4xl md:text-6xl font-black font-serif text-foreground mb-4 leading-tight">
                                        {artist.name}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            Artist Statistics
                                        </span>
                                        <Button asChild variant="link" size="sm" className="h-auto p-0 text-primary/60 hover:text-primary transition-colors">
                                            <a href={artist.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Last.fm Profile</span>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {(() => {
                                const globalListeners = parseInt(artistDetails?.stats?.listeners || "0");
                                const globalPlaycount = parseInt(artistDetails?.stats?.playcount || "0");
                                const userPlaycount = parseInt(artist.playcount);

                                if (!globalListeners || !globalPlaycount) {
                                    return <div className="text-center py-10 text-muted-foreground">Could not load global statistics.</div>;
                                }

                                const stats = getRankingData(userPlaycount, globalListeners, globalPlaycount);

                                return (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-2">
                                            <Trophy className="w-6 h-6 text-yellow-500" />
                                            <h3 className="text-xl font-serif text-primary">Your Global Ranking</h3>
                                        </div>

                                        <Card className="bg-background/40 border-primary/10 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden group rounded-xl">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className={`mb-4 transform group-hover:scale-110 transition-transform duration-500`}>
                                                {stats.icon}
                                            </div>
                                            <h3 className={`text-3xl font-black mb-2 ${stats.color}`}>{stats.rankTitle}</h3>
                                            <p className="text-sm text-muted-foreground">Based on global Last.fm data</p>
                                        </Card>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Card className="bg-background/40 border-primary/10 p-5 relative overflow-hidden rounded-xl">
                                                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                                    <Star className="w-4 h-4" /> Top Percentile
                                                </h4>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-2xl font-bold text-foreground">Top {stats.percentile}%</span>
                                                </div>
                                                <div className="w-full bg-secondary/20 rounded-full h-2 mt-3 overflow-hidden relative">
                                                    <motion.div
                                                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full absolute left-0 top-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.max(1, 100 - stats.percentile)}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </Card>

                                            <Card className="bg-background/40 border-primary/10 p-5 rounded-xl">
                                                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" /> Your Impact
                                                </h4>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Your Scrobbles</p>
                                                    <p className="text-xl font-bold text-foreground">{userPlaycount.toLocaleString()}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-xs text-muted-foreground mb-1">% of Global Total</p>
                                                    <p className="text-xl font-bold text-foreground">
                                                        {stats.percentageOfTotal}%
                                                    </p>
                                                </div>
                                            </Card>
                                        </div>

                                        <Card className="bg-background/40 border-primary/10 p-5 rounded-xl">
                                            <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> True Global Context
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Global Listeners</span>
                                                    <span className="font-medium">{globalListeners.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Global Scrobbles</span>
                                                    <span className="font-medium">{globalPlaycount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Avg. Scrobbles / Listener</span>
                                                    <span className="font-medium">{stats.avgScrobblesPerListener}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })()}


                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}