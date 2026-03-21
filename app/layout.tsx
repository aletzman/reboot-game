import type { Metadata } from "next";
import { Geist, Monda, Orbitron, Share_Tech_Mono } from "next/font/google";
import { Header } from "@/components/ui/Header";
import CRTOverlay from "@/components/ui/CRTOverlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dataMono = Share_Tech_Mono({
  variable: "--font-data-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const fontTitle = Orbitron({
  variable: "--font-data-title"
})
export const metadata: Metadata = {
  title: "Reboot",
  description: "Reboot is a game about the end of the world",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${dataMono.variable} ${fontTitle.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CRTOverlay />
        <Header />
        {children}
      </body>
    </html>
  );
}
