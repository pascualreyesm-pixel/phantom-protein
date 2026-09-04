import { Suspense } from "react";
import type { Metadata } from "next";
import ConfirmacionContenido from "@/components/confirmacion-contenido";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export default function ConfirmacionPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-6">
      <Suspense fallback={null}>
        <ConfirmacionContenido />
      </Suspense>
    </section>
  );
}
