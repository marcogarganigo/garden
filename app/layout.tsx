// app/layout.tsx
import { ReactNode } from "react";
import Script from "next/script";
import { Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

export const dynamic = "force-static";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${montserrat.variable} antialiased`}
    >
      <head>
        {/* Title & Description */}
        <title>Garden.fm - Your Personal Music Garden</title>
        <meta name="description" content="Garden.fm is your personal space to discover, listen, and cultivate music in a unique sound garden." />
        <meta name="keywords" content="music, garden.fm, lastfm, last.fm playlist, online music, audio streaming" />
        <meta name="author" content="marcogarganigo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content="Garden.fm - Your Personal Music Garden" />
        <meta property="og:description" content="Discover and listen to music in a unique sound garden." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marcogarganigo.github.io" />
        {/*<meta property="og:image" content="https://marcogarganigo.github.io/preview.png" />*/}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Garden.fm - Your Personal Music Garden" />
        <meta name="twitter:description" content="Discover and listen to music in a unique sound garden." />
        {/*<meta name="twitter:image" content="https://marcogarganigo.github.io/preview.png" />*/}

        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-K8BNTKYNTH`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K8BNTKYNTH', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body>
        <div className="min-h-screen garden-bg">{children}</div>
      </body>
    </html>
  );
}
