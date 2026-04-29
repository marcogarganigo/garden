"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Tag, ChevronLeft, Sparkles, Zap, Leaf, Rose, ChevronDown } from "lucide-react"

const changelogEntries = [
    {
        date: "April 29, 2026",
        version: "v1.1.0",
        title: "Level cap removed & reference guide",
        description: "Removed the level 100 cap, gardeners can now level up indefinitely. Added a new section to the Info page showing all playcount thresholds and stages.",
        updates: [
            "Infinite Growth: Removed the level 100 cap, gardeners can now level up indefinitely.",
            "Plant Growth Reference: Added a new section to the Info page showing all playcount thresholds and stages.",
            "New Changelog Page: Launched the official changelog to document the growth of Garden.fm."
        ],
        type: "major"
    },
    {
        date: "April 28, 2026",
        version: "v1.0.0",
        title: "Garden.fm Launch",
        description: "Initial release of Garden.fm – transform your Last.fm history into a flourishing digital garden.",
        updates: [],
        type: "launch"
    }
]

const ITEMS_PER_PAGE = 5

const Changelog = () => {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

    const visibleEntries = changelogEntries.slice(0, visibleCount)
    const hasMore = visibleCount < changelogEntries.length

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }

    return (
        <div className="min-h-screen bg-transparent text-foreground pb-20">
            <div className="container mx-auto px-4 py-8">
                <div className="text-left mb-12">
                    <Link href="/">
                        <Button className="cursor-pointer group" variant="outline">
                            <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to garden
                        </Button>
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-black mb-4 py-2 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent leading-tight">
                                🌿 Project Changelog
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Follow the growth and evolution of Garden.fm
                            </p>
                        </motion.div>
                    </header>

                    <div className="space-y-12 relative">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 ml-5 -translate-x-px md:mx-auto md:translate-x-0 w-1 bg-gradient-to-b from-transparent via-primary/40 to-transparent origin-top"
                        />
                        {visibleEntries.map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                            >
                                {/* Timeline point */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    {entry.type === 'major' ? <Rose className="w-5 h-5 text-red-500" /> :
                                        entry.type === 'minor' ? <Leaf className="w-5 h-5 text-green-500" /> : <Zap className="w-5 h-5 text-blue-500" />
                                    }
                                </div>

                                {/* Content */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <time className="text-sm font-medium text-muted-foreground">{entry.date}</time>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                            entry.type === 'major' ? 'bg-yellow-100 text-yellow-800' : 
                                            entry.type === 'launch' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {entry.version}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-foreground">{entry.title}</h3>
                                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                                        {entry.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {entry.updates.map((update, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                {update}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {hasMore && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-12 text-center"
                            >
                                <Button
                                    onClick={handleLoadMore}
                                    variant="outline"
                                    className="cursor-pointer group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <ChevronDown className="w-4 h-4 mr-2 transition-transform group-hover:translate-y-1" />
                                    Show Older Updates
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <footer className="mt-20 text-center">
                        <p className="text-muted-foreground flex items-center justify-center gap-2">
                            More updates coming soon <Sparkles className="w-4 h-4 text-yellow-500" />
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Changelog
