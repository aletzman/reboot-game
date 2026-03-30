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

// TODO: Agregar el dominio real, la imagen de open graph y el handle de twitter
export const metadata: Metadata = {
  title: {
    default: "REBOOT | Sobrevive programando",
    template: "%s | REBOOT"
  },
  description: "El mundo terminó hace 2,847 días. Accede a la terminal FRAG, programa las rutas de tu dron usando lógica real y aprende los fundamentos de la programación para sobrevivir.",
  keywords: [
    "juego educativo",
    "aprender a programar",
    "lógica de programación",
    "javascript",
    "juego de supervivencia",
    "coding game",
    "terminal retro"
  ],
  authors: [{ name: "BitCoder" }],
  creator: "BitCoder",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://tudominio.com",
    title: "REBOOT | Aprende a programar desde el búnker",
    description: "Conéctate a la terminal FRAG. Un juego de supervivencia donde tu código es la única herramienta para mantenerte con vida.",
    siteName: "REBOOT",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Interfaz de la terminal FRAG en REBOOT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REBOOT | Sobrevive programando",
    description: "El mundo terminó hace 2,847 días. ¿Tienes la lógica necesaria para sobrevivir?",
    images: ["/og-image.jpg"],
    creator: "@tuUsuarioDeTwitter", // <-- Tu handle si tienes uno para la marca
  },
  icons: {
    icon: "/logo.svg",
  },
  themeColor: "#05070a",
  colorScheme: "dark",
};

import { NavigationFooter } from "@/components/ui/NavigationFooter";

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
      <body className=" flex flex-col h-svh">
        {/* <CRTOverlay /> */}
        <Header />
        <main className="mt-(--header-height) max-h-[calc(100svh-var(--header-height))] pb-16 custom-scrollbar overflow-y-auto">
          {children}
        </main>
        <NavigationFooter />
      </body>
    </html>
  );
}
