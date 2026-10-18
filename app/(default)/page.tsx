import type { Metadata } from "next";
import HeroHome from "@/components/hero-home";
import Productos from "@/components/productos";
import VideoOjos from "@/components/video-ojos";
import Marca from "@/components/marca";
import PorQuePhantom from "@/components/por-que-phantom";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Phantom Protein: proteína de clara de huevo, creatina y colágeno + açaí para tu rutina de rendimiento.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Phantom Protein | Rendimiento de verdad",
    description: "Proteína de clara de huevo, creatina y colágeno + açaí. Conoce la línea Phantom Protein.",
    url: "/",
    siteName: "Phantom Protein",
    locale: "es_CL",
    type: "website",
  },
};

export default function Home() {
  return <><HeroHome /><Productos /><VideoOjos /><PorQuePhantom /><Marca /></>;
}
