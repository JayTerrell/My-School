import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Libre_Franklin, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});
const franklin = Libre_Franklin({ subsets: ["latin"], variable: "--font-franklin", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Athenaeum — Independent Programs of Study", template: "%s · Athenaeum" },
  description:
    "Full degree programs taught from approved sources, assessed by named reviewers, and open to public inspection.",
};

export const viewport: Viewport = { themeColor: "#F2EEE4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${franklin.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
