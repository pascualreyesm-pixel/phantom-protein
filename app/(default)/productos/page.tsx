import type { Metadata } from "next";
import Productos from "@/components/productos";

export const metadata: Metadata = {
  title: "Suplementos",
  description: "Explora proteína de clara de huevo, creatina monohidrato y colágeno + açaí de Phantom Protein.",
  alternates: { canonical: "/productos" },
};

export default function ProductosPage() {
  return <Productos titulo="NUESTROS PRODUCTOS" />;
}
