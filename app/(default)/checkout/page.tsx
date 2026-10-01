import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
    robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="bg-black px-6 py-32">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="mb-3 text-3xl text-white [font-family:var(--font-anton)] md:text-4xl">
          FINALIZAR <span className="text-yellow-400">COMPRA</span>
        </h1>
      </div>
      <CheckoutForm />
    </section>
  );
}
