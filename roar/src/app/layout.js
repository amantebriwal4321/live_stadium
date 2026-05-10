import { Inter } from "next/font/google";
import "./globals.css";
import { MatchProvider } from "../context/MatchContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "ROAR — Feel the Match. Find Your People.",
  description: "Real-time cricket fan experience powered by AI. Live emotion stream, tribal narration, and the Ghost Ball — IPL 2026.",
  keywords: "cricket, IPL, fan experience, real-time, AI, ROAR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <MatchProvider>
          {children}
        </MatchProvider>
      </body>
    </html>
  );
}
