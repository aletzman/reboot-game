import type { Metadata } from "next";
import { Teko, Monda, Orbitron, Share_Tech_Mono, Rubik_Mono_One } from "next/font/google";
import { Header } from "@/components/ui/Header";
import CRTOverlay from "@/components/ui/CRTOverlay";
import "./globals.css";

const geistSans = Monda({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dataMono = Share_Tech_Mono({
  variable: "--font-data-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const fontTitle = Teko({
  variable: "--font-data-title",
  weight: ["500", "600", "700"],
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
        {/*<CRTOverlay />*/}
        <Header />
        <div className="h-[calc(100vh-47px)] overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
