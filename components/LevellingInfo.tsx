// app/levelling-info/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LevellingInfoPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-left top-0 mb-6">
                <Link href="/">
                    <Button className="cursor-pointer" variant="outline">
                        Back to garden
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Welcome to Garden.fm!</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Think of your listening habits as the seeds that grow your musical garden. 
                    The more variety you listen to, the more your garden flourishes. 
                    Here's how the global levelling system works.
                </p>
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
                    The maximum level is <strong>100</strong>.
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
                    <li><strong>Level 100:</strong> 🌳 Master Gardener</li>
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
