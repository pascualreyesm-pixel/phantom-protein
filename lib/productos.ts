export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number; // CLP
  imagen: string;
  detalles: string[];
  descripcion: string;
};

export const productos: Producto[] = [
  {
    id: "proteina-vainilla",
    nombre: "Proteína Vainilla",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-vainilla.png",
    detalles: ["25 g de proteína por porción", "Alta biodisponibilidad", "Sin azúcar añadida"],
    descripcion:
      "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor vainilla. Textura fina y de mezcla uniforme, sin azúcar añadida y sin sellos. Cada porción aporta 25 g de proteína de alto valor biológico.",
  },
  {
    id: "proteina-chocolate",
    nombre: "Proteína Chocolate",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-chocolate.png",
    detalles: ["25 g de proteína por porción", "Alta biodisponibilidad", "Sin azúcar añadida"],
    descripcion:
      "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor chocolate. Textura fina y de mezcla uniforme, sin azúcar añadida y sin sellos. Cada porción aporta 25 g de proteína de alto valor biológico.",
  },
  {
    id: "creatina",
    nombre: "Creatina",
    categoria: "Rendimiento",
    precio: 19990,
    imagen: "/images/phantom/product-creatina.png",
    detalles: ["Sin sabor", "Fácil de mezclar", "Alta pureza"],
    descripcion:
      "Creatina monohidratada, sin sabor. Se disuelve fácilmente en agua, jugo o tu batido de proteína sin alterar el sabor. Formato de alta pureza, pensado para uso diario.",
  },
  {
    id: "colageno-acai",
    nombre: "Colágeno Açaí",
    categoria: "Recuperación",
    precio: 29990,
    imagen: "/images/phantom/product-colageno.png",
    detalles: ["Sabor açaí", "Uso diario", "Fácil de mezclar"],
    descripcion:
      "Colágeno hidrolizado sabor açaí, de uso diario. Fácil de mezclar, pensado para incorporarse a tu rutina junto a tu desayuno o batido favorito.",
  },
];

export const COSTO_ENVIO = 3990; // CLP — tarifa plana de ejemplo, ajústala
