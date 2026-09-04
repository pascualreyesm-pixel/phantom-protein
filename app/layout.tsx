import "./css/style.css";

import { Inter, Anton, Lacquer } from "next/font/google";
import type { Metadata } from "next";
import { CarritoProvider } from "@/lib/carrito-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const lacquer = Lacquer({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lacquer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phantomprotein.cl"),
  title: {
    default: "Phantom Protein | La proteína de mayor poder biológico",
    template: "%s | Phantom Protein",
  },
  description:
    "Proteína de clara de huevo de alta biodisponibilidad, sin azúcar añadida y sin sellos. 25 g de proteína por porción, diseñada para rendimiento real.",
  keywords: [
    "proteína de clara de huevo",
    "suplementos Chile",
    "proteína sin sellos",
    "Phantom Protein",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${anton.variable} ${lacquer.variable} bg-black font-inter tracking-tight text-white antialiased`}
      >
        <CarritoProvider>
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            {children}
          </div>
        </CarritoProvider>
      </body>
    </html>
  );
}
