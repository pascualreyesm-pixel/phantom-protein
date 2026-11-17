import { productos, type Producto } from "@/lib/productos";

export type VarianteProducto = { id: string; etiqueta: string };
export type GrupoProducto = {
  slug: string;
  nombre: string;
  etiqueta: string;
  descripcion: string;
  imagen: string;
  productoIds: string[];
  variantes?: VarianteProducto[];
  galeriaExtra: string[];
  detalles: string[];
  objetivo: string;
  objetivoTexto: string;
  objetivoImagen: string;
};

/** Agrupa las variantes visibles sin cambiar los IDs persistidos en el carrito. */
export const catalogoProductos: GrupoProducto[] = [
  {
    slug: "proteina",
    nombre: "Phantom Protein",
    etiqueta: "PROTEÍNA DE CLARA DE HUEVO · 1,5 KG",
    descripcion: "Proteína de clara de huevo deshidratada y pasteurizada. Escoge tu sabor: vainilla o chocolate.",
    imagen: "/images/phantom/product-vainilla.png",
    productoIds: ["proteina-vainilla", "proteina-chocolate"],
    variantes: [
      { id: "proteina-vainilla", etiqueta: "Vainilla" },
      { id: "proteina-chocolate", etiqueta: "Chocolate" },
    ],
    galeriaExtra: ["/images/phantom/escena-proteina.webp", "/images/phantom/hero-producto-remolino.png"],
    detalles: ["25 g de proteína por porción", "Sin azúcar añadida", "Formato de 1,5 kg"],
    objetivo: "MASA MUSCULAR Y RECUPERACIÓN",
    objetivoTexto: "Proteína",
    objetivoImagen: "/images/phantom/escena-proteina.webp",
  },
  {
    slug: "creatina",
    nombre: "Creatina Monohidrato",
    etiqueta: "CREATINA · 300 G",
    descripcion: "Creatina monohidratada 100% en formato de 300 g para integrarla a tu rutina.",
    imagen: "/images/phantom/product-creatina.png",
    productoIds: ["creatina"],
    galeriaExtra: ["/images/phantom/escena-creatina.webp"],
    detalles: ["Creatina monohidratada 100%", "300 g", "Sin ingredientes añadidos"],
    objetivo: "FUERZA Y RENDIMIENTO",
    objetivoTexto: "Creatina",
    objetivoImagen: "/images/phantom/escena-creatina.webp",
  },
  {
    slug: "colageno",
    nombre: "Colágeno + Açaí",
    etiqueta: "COLÁGENO + AÇAÍ · 300 G",
    descripcion: "Colágeno + açaí en formato de 300 g. Consulta el envase para información nutricional y recomendaciones.",
    imagen: "/images/phantom/product-colageno.png",
    productoIds: ["colageno-acai"],
    galeriaExtra: ["/images/phantom/escena-colageno.webp"],
    detalles: ["Colágeno + açaí", "300 g", "Fácil de incorporar a la rutina"],
    objetivo: "PIEL, CABELLO Y ARTICULACIONES",
    objetivoTexto: "Colágeno",
    objetivoImagen: "/images/phantom/escena-colageno.webp",
  },
  {
    slug: "pack-proteina-creatina",
    nombre: "Pack Proteína + Creatina",
    etiqueta: "PACK ESPECIAL · 1,5 KG + 300 G",
    descripcion: "Una proteína Phantom de 1,5 kg a elección de sabor + creatina monohidratada 100% de 300 g. Precio especial $69.300.",
    imagen: "/images/phantom/hero-conoce.webp",
    productoIds: ["pack-proteina-creatina-vainilla", "pack-proteina-creatina-chocolate"],
    variantes: [
      { id: "pack-proteina-creatina-vainilla", etiqueta: "Proteína Vainilla" },
      { id: "pack-proteina-creatina-chocolate", etiqueta: "Proteína Chocolate" },
    ],
    galeriaExtra: ["/images/phantom/product-vainilla.png", "/images/phantom/product-chocolate.png", "/images/phantom/product-creatina.png"],
    detalles: ["Proteína Phantom 1,5 kg", "Creatina monohidratada 100% · 300 g", "Ahorra $6.680 frente a comprar por separado"],
    objetivo: "PACK DE RENDIMIENTO",
    objetivoTexto: "Pack proteína + creatina",
    objetivoImagen: "/images/phantom/hero-conoce.webp",
  },
];

export function getGrupoProducto(slug: string) {
  return catalogoProductos.find((producto) => producto.slug === slug);
}

export function getProducto(id: string): Producto | undefined {
  return productos.find((producto) => producto.id === id);
}

export function getProductoPrincipal(grupo: GrupoProducto): Producto | undefined {
  return getProducto(grupo.productoIds[0]);
}
