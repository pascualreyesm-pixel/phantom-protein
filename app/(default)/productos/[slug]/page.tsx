import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductoDetalle from "@/components/producto-detalle";
import { getGrupoProducto } from "@/lib/catalogo";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variante?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grupo = getGrupoProducto(slug);
  if (!grupo) return { title: "Producto no encontrado" };
  return {
    title: grupo.nombre,
    description: grupo.descripcion,
    alternates: { canonical: `/productos/${grupo.slug}` },
    openGraph: {
      title: `${grupo.nombre} | Phantom Protein`,
      description: grupo.descripcion,
      url: `/productos/${grupo.slug}`,
      siteName: "Phantom Protein",
      locale: "es_CL",
      type: "website",
      images: [{ url: grupo.imagen, alt: grupo.nombre }],
    },
  };
}

export default async function ProductoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const variante = Array.isArray(query.variante) ? query.variante[0] : query.variante;
  const grupo = getGrupoProducto(slug);
  if (!grupo) notFound();
  const varianteValida = variante && grupo.productoIds.includes(variante) ? variante : undefined;
  return <ProductoDetalle key={`${slug}-${varianteValida ?? ""}`} slug={slug} varianteInicial={varianteValida} />;
}
