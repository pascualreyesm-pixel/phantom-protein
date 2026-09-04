import type { Metadata } from "next";
import Hero from "@/components/hero-home";
import Novedades from "@/components/novedades";
import Productos from "@/components/productos";
import Marca from "@/components/marca";
import Cta from "@/components/cta";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Phantom Protein: proteína, creatina y colágeno de alta calidad. 25 g de proteína por porción, sin azúcar añadida.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Phantom Protein | La proteína de mayor poder biológico",
    description:
      "Proteína, creatina y colágeno premium. Alta biodisponibilidad, sin azúcar añadida, sin sellos.",
    url: "/",
    siteName: "Phantom Protein",
    locale: "es_CL",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Novedades />
      <Productos />
      <Marca />
      <Cta />
    </>
  );
}
