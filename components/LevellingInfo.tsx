"use client"

// app/levelling-info/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    TreePine,
    Flower2,
    Flower,
    Rose,
    Leaf,
    Sprout,
    TreeDeciduous,
    ChevronLeft
} from "lucide-react";

const LevellingInfoPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-left top-0 mb-6">
                <Link href="/">
                    <Button className="cursor-pointer group" variant="outline">
                        <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to garden
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl md:text-6xl font-black mb-4 py-2 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent leading-tight">
                        🌿 Garden Guide
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Welcome to the <strong>Garden.fm Guide</strong>. 
                        This page is your reference to understanding how your musical habits are 
                        transformed into a flourishing ecosystem. Discover how the global leveling system 
                        calculates your progress, what your gardener rank means, and how each 
                        plant in your garden evolves based on your listening history.
                    </p>
                </motion.div>
            </div>

            <div className="prose dark:prose-invert max-w-none">

                <h2 className="text-2xl font-semibold mt-8 mb-4">🌱 How Your Global Level Works</h2>

                <p>
                    Your global Garden.fm level is based on an XP system that grows according 
                    to your Last.fm listening history. You earn XP from three main components:
                    <strong> unique tracks</strong>, <strong>unique artists</strong>, and 
                    <strong> variety bonuses</strong>.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">💽 XP from Tracks</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>+1 XP</strong> for every unique track you've listened to</li>
                    <li><strong>+1 bonus XP</strong> for every 20 scrobbles</li>
                </ul>

                <h3 className="text-xl font-semibold mt-8 mb-4">🎤 XP from Unique Artists</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>+2 XP</strong> for each different artist you’ve listened to</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">🌿 Level Calculation</h2>

                <p>Your level is determined by this formula:</p>

                <pre>{`level = floor( sqrt( XP / 10 ) ) + 1`}</pre>

                <p>
                    This creates a smooth progression curve where early levels are quick 
                    to earn, while higher levels require more variety and dedication. 
                    <strong> There is no maximum level</strong>, you can keep cultivating your garden indefinitely!
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">📌 XP Needed for Each Level</h3>

                <p>To know how much XP you need for a specific level:</p>

                <pre>{`XP required for level L = (L - 1)² * 10`}</pre>

                <ul className="list-disc list-inside space-y-2 mt-4">
                    <li>Level 1 → 0 XP</li>
                    <li>Level 2 → 10 XP</li>
                    <li>Level 5 → 160 XP</li>
                    <li>Level 10 → 810 XP</li>
                    <li>Level 50 → 24,010 XP</li>
                    <li>Level 100 → 98,010 XP</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">🌼 Gardener Titles</h2>

                <p>Your level gives you a symbolic gardener rank:</p>

                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Level 1–24:</strong> 🌰 New Gardener</li>
                    <li><strong>Level 25–49:</strong> 🌱 Growing Gardener</li>
                    <li><strong>Level 50–74:</strong> 🌿 Skilled Gardener</li>
                    <li><strong>Level 75–99:</strong> 🌺 Expert Gardener</li>
                    <li><strong>Level 100+:</strong> 🌳 Master Gardener</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">🌲 Plant Evolutions</h2>

                <p>Each artist in your garden grows based on their total playcount:</p>

                <ul className="list-none space-y-4">
                    <li className="flex items-center gap-3">
                        <Sprout className="w-6 h-6 text-amber-600" />
                        <span><strong>0–499 plays:</strong> Sprout</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Leaf className="w-6 h-6 text-lime-600" />
                        <span><strong>500–999 plays:</strong> Fern</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Rose className="w-6 h-6 text-rose-500" />
                        <span><strong>1,000–1,999 plays:</strong> Rose</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Flower className="w-6 h-6 text-pink-500" />
                        <span><strong>2,000–4,999 plays:</strong> Tulip</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Flower2 className="w-6 h-6 text-yellow-500" />
                        <span><strong>5,000–9,999 plays:</strong> Sunflower</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <TreePine className="w-6 h-6 text-green-600" />
                        <span><strong>10,000–19,999 plays:</strong> Mighty Oak</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <TreeDeciduous className="w-6 h-6 text-emerald-600" />
                        <span><strong>20,000+ plays:</strong> Ancient Tree</span>
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">📊 Progress to the Next Level</h2>

                <p>The progress bar is calculated like this:</p>

                <pre>
                    {`currentLevelXP = XP needed for your current level
                    nextLevelXP    = XP needed for the next level
                    progressXP     = currentXP - currentLevelXP
                    neededXP       = nextLevelXP - currentLevelXP`}
                </pre>

                <p>Your bar simply shows how close you are to reaching the next milestone.</p>

                <p className="text-xl mt-10 text-center font-bold text-primary">
                    Happy gardening! 🌷
                </p>

            </div>
        </div>
    );
};

export default LevellingInfoPage;
