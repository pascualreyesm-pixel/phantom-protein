export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number; // CLP
  precioReferencia?: number; // Precio sumado de los productos vendidos en pack
  imagen: string;
  detalles: string[];
  descripcion: string;
  ingredientes?: string;
  alergenos?: string;
};

/** Catálogo fuente de verdad: carrito, checkout y servidor de pedidos usan estos valores. */
export const productos: Producto[] = [
  {
    id: "proteina-vainilla",
    nombre: "Proteína de Clara de Huevo — Vainilla 1,5 kg",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-vainilla.png",
    detalles: ["25,1 g de proteína por porción", "Sabor vainilla", "Sin azúcar añadida"],
    descripcion: "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor vainilla. Cada porción aporta 25,1 g de proteína. Revisa la información nutricional del envase para conocer el detalle por porción.",
    ingredientes: "Albúmina deshidratada pasteurizada, suero de leche, mono y diglicéridos de ácidos grasos, L-leucina, saborizante idéntico al natural, maltodextrina, extracto de levadura, dióxido de silicio y sucralosa.",
    alergenos: "Contiene huevo y leche.",
  },
  {
    id: "proteina-chocolate",
    nombre: "Proteína de Clara de Huevo — Chocolate 1,5 kg",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-chocolate.png",
    detalles: ["25,2 g de proteína por porción", "Sabor chocolate", "Sin azúcar añadida"],
    descripcion: "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor chocolate. Cada porción aporta 25,2 g de proteína. Revisa la información nutricional del envase para conocer el detalle por porción.",
    ingredientes: "Albúmina deshidratada pasteurizada, suero de leche, mono y diglicéridos de ácidos grasos, L-leucina, saborizante idéntico al natural, colorante caramelo, cacao en polvo, ácido cítrico, dióxido de silicio y sucralosa.",
    alergenos: "La fórmula incluye albúmina de huevo y suero de leche.",
  },
  {
    id: "creatina",
    nombre: "Creatina Monohidrato 300 g",
    categoria: "Rendimiento",
    precio: 15990,
    imagen: "/images/phantom/product-creatina.png",
    detalles: ["Creatina monohidratada 100%", "300 g", "Sin ingredientes añadidos"],
    descripcion: "Creatina monohidratada 100% en formato de 300 g. Sigue la porción y las indicaciones de uso señaladas en el envase.",
    ingredientes: "Creatina monohidratada 100%.",
    alergenos: "No se declaran otros ingredientes en la fórmula informada.",
  },
  {
    id: "colageno-acai",
    nombre: "Colágeno + Açaí 300 g",
    categoria: "Bienestar",
    precio: 20990,
    imagen: "/images/phantom/product-colageno.png",
    detalles: ["Colágeno + açaí", "300 g", "Fácil de incorporar a la rutina"],
    descripcion: "Fórmula en polvo de colágeno + açaí en formato de 300 g. Revisa el envase para consultar la información nutricional y recomendaciones de uso.",
    ingredientes: "Colágeno hidrolizado, glicinato de magnesio, maltodextrina, glicina, ácido cítrico, saborizante idéntico al natural, açaí en polvo, ácido ascórbico, sucralosa, dióxido de silicio, colorantes (caramelo y carmoisina) y biotina.",
    alergenos: "Según la información entregada, no contiene alérgenos declarados.",
  },
  {
    id: "pack-proteina-creatina-vainilla",
    nombre: "Pack Phantom — Proteína Vainilla + Creatina",
    categoria: "Packs",
    precio: 69300,
    precioReferencia: 75980,
    imagen: "/images/phantom/hero-conoce.webp",
    detalles: ["Proteína Vainilla 1,5 kg", "Creatina monohidratada 300 g", "Precio especial de pack: ahorra $6.680"],
    descripcion: "Pack especial Phantom que combina una proteína de clara de huevo sabor vainilla de 1,5 kg y una creatina monohidratada 100% de 300 g. Precio cerrado de $69.300.",
    ingredientes: "Proteína sabor vainilla: albúmina deshidratada pasteurizada, suero de leche, mono y diglicéridos de ácidos grasos, L-leucina, saborizante idéntico al natural, maltodextrina, extracto de levadura, dióxido de silicio y sucralosa. Creatina: creatina monohidratada 100%.",
    alergenos: "La proteína contiene huevo y leche.",
  },
  {
    id: "pack-proteina-creatina-chocolate",
    nombre: "Pack Phantom — Proteína Chocolate + Creatina",
    categoria: "Packs",
    precio: 69300,
    precioReferencia: 75980,
    imagen: "/images/phantom/hero-conoce.webp",
    detalles: ["Proteína Chocolate 1,5 kg", "Creatina monohidratada 300 g", "Precio especial de pack: ahorra $6.680"],
    descripcion: "Pack especial Phantom que combina una proteína de clara de huevo sabor chocolate de 1,5 kg y una creatina monohidratada 100% de 300 g. Precio cerrado de $69.300.",
    ingredientes: "Proteína sabor chocolate: albúmina deshidratada pasteurizada, suero de leche, mono y diglicéridos de ácidos grasos, L-leucina, saborizante idéntico al natural, colorante caramelo, cacao en polvo, ácido cítrico, dióxido de silicio y sucralosa. Creatina: creatina monohidratada 100%.",
    alergenos: "La proteína contiene huevo y leche.",
  },
];

export const COSTO_ENVIO = 3990; // CLP. Confirmar tarifa final antes de vender.
