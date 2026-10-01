import type { Metadata } from "next";
import Productos from "@/components/productos";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Conoce la línea de productos Phantom Protein: proteína, creatina y colágeno.",
  alternates: {
    canonical: "/productos",
  },
};

export default function ProductosPage() {
  return <Productos />;
}