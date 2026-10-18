import type { Metadata } from "next";
import CuentaAuth from "@/components/cuenta-auth";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Crea tu cuenta Phantom Protein, inicia sesión y consulta tus pedidos.",
  robots: { index: false, follow: false },
};

export default function CuentaPage() {
  return <div className="min-h-[65vh] bg-black"><CuentaAuth /></div>;
}
