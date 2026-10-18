import type { Metadata } from "next";
import MiCuenta from "@/components/mi-cuenta";

export const metadata: Metadata = {
  title: "Mis pedidos",
  description: "Consulta el estado de tus pedidos Phantom Protein y su seguimiento Starken.",
  robots: { index: false, follow: false },
};

export default function MiCuentaPage() {
  return <div className="min-h-[65vh] bg-black"><MiCuenta /></div>;
}
