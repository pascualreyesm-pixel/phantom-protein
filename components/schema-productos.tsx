import { productos } from "@/lib/productos";

export default function SchemaProductos() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: productos.map((p, i) => ({
      "@type": "Product",
      position: i + 1,
      name: p.nombre,
      description: p.descripcion,
      image: `https://phantomprotein.cl${p.imagen}`,
      offers: {
        "@type": "Offer",
        priceCurrency: "CLP",
        price: p.precio,
        availability: "https://schema.org/InStock",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
