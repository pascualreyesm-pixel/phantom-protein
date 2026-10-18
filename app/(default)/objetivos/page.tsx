import type { Metadata } from "next";
import LineaObjetivos from "@/components/linea-objetivos";

export const metadata: Metadata = {
  title: "Compra por objetivo",
  description:
    "Encuentra la línea Phantom Protein que acompaña tu enfoque: proteína, creatina y colágeno + açaí.",
  alternates: { canonical: "/objetivos" },
};

export default function ObjetivosPage() {
  return <LineaObjetivos />;
}
