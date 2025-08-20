// app/levelling-info/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assicurati di avere questo import se usi Shadcn/ui

const LevellingInfoPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-left top-0">
                <Link href="/">
                    <Button className="cursor-pointer" variant="outline">Back to garden</Button>
                </Link>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Benvenuto su Garden.fm!</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Immagina i tuoi artisti preferiti come semi nel tuo giardino musicale. Più li ascolti, più il tuo giardino cresce e fiorisce. Questo è il nostro sistema di livellamento, una sorta di **livello dell'artista** per i tuoi gusti musicali.
                </p>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mt-8 mb-4">Come Funziona</h2>
                <p>
                    Il livello di ogni artista che ascolti è determinato dal numero di riproduzioni (scrobble) che hai su Last.fm. All'inizio, ogni artista è al **livello 1**, come un piccolo germoglio.
                </p>
                <p>
                    Man mano che ascolti di più un artista, guadagni **punti esperienza (XP)**, che lo faranno salire di livello. Più alto è il livello, più punti sono necessari per passare al successivo, proprio come in un videogioco. A ogni livello raggiunto, l'artista "sboccia" con un fiore più grande e colorato, rendendo il tuo giardino sempre più rigoglioso.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Punti Esperienza Richiesti</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>**Livello 1:** 0 XP (sbloccato con il primo ascolto)</li>
                    <li>**Livello 2:** 20 XP</li>
                    <li>**Livello 3:** 50 XP</li>
                    <li>**Livello 4:** 100 XP</li>
                    <li>**Livello 5:** 250 XP</li>
                    <li>...e così via!</li>
                </ul>
                <h3 className="text-xl font-semibold mt-8 mb-4">Punti Esperienza Richiesti</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>**Livello 1:** 0 XP (sbloccato con il primo ascolto)</li>
                    <li>**Livello 2:** 20 XP</li>
                    <li>**Livello 3:** 50 XP</li>
                    <li>**Livello 4:** 100 XP</li>
                    <li>**Livello 5:** 250 XP</li>
                    <li>...e così via!</li>
                </ul>

                <h3 className="text-xl font-semibold mt-8 mb-4">Punti Esperienza Richiesti</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>**Livello 1:** 0 XP (sbloccato con il primo ascolto)</li>
                    <li>**Livello 2:** 20 XP</li>
                    <li>**Livello 3:** 50 XP</li>
                    <li>**Livello 4:** 100 XP</li>
                    <li>**Livello 5:** 250 XP</li>
                    <li>...e così via!</li>
                </ul>

                <h3 className="text-xl font-semibold mt-8 mb-4">Punti Esperienza Richiesti</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>**Livello 1:** 0 XP (sbloccato con il primo ascolto)</li>
                    <li>**Livello 2:** 20 XP</li>
                    <li>**Livello 3:** 50 XP</li>
                    <li>**Livello 4:** 100 XP</li>
                    <li>**Livello 5:** 250 XP</li>
                    <li>...e così via!</li>
                </ul>



                <p className="mt-8">
                    Il tuo obiettivo è far crescere il tuo giardino musicale, coltivando gli artisti che ami di più e scoprendone di nuovi. Tieni d'occhio i tuoi progressi e guarda come il tuo giardino fiorisce con ogni nota che ascolti.
                </p>

                <p className="text-xl mt-8 text-center font-bold text-primary">Buon giardinaggio musicale! 🎶</p>
            </div>
        </div>
    );
};

export default LevellingInfoPage;