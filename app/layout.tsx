// app/layout.tsx

import type ReactType from "react";
import { Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import KoFiWidget from '@/components/KoFiWidget'

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

export default function RootLayout({
  children,
}: {
  children: ReactType.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${openSans.variable} ${montserrat.variable} antialiased`}
    >
      <head>
        <title>Garden.fm</title>
      </head>
      <body suppressHydrationWarning>
        <div className="min-h-screen garden-bg">
          {children}
        </div>
        <KoFiWidget />
      </body>
    </html>
  );
}

export const metadata = {
  generator: 'v0.app'
};