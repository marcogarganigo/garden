// app/layout.tsx
import type { ReactNode } from "react";
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${openSans.variable} ${montserrat.variable} antialiased`}
    >
      <body>
        <div className="min-h-screen garden-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
