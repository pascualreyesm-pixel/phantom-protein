export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number; // CLP
  imagen: string;
  detalles: string[];
  descripcion: string;
};

/** Catálogo fuente de verdad: el carrito y el servidor de pedidos leen estos precios. */
export const productos: Producto[] = [
  {
    id: "proteina-vainilla",
    nombre: "Proteína de Clara de Huevo — Vainilla 1,5 kg",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-vainilla.png",
    detalles: ["25,1 g de proteína por porción", "Sabor vainilla", "Sin azúcar añadida"],
    descripcion:
      "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor vainilla. Cada porción aporta 25,1 g de proteína. Revisa la información nutricional del envase para conocer el detalle por porción.",
  },
  {
    id: "proteina-chocolate",
    nombre: "Proteína de Clara de Huevo — Chocolate 1,5 kg",
    categoria: "Proteína",
    precio: 59990,
    imagen: "/images/phantom/product-chocolate.png",
    detalles: ["25,2 g de proteína por porción", "Sabor chocolate", "Sin azúcar añadida"],
    descripcion:
      "Proteína en polvo de clara de huevo deshidratada y pasteurizada, sabor chocolate. Cada porción aporta 25,2 g de proteína. Revisa la información nutricional del envase para conocer el detalle por porción.",
  },
  {
    id: "creatina",
    nombre: "Creatina Monohidrato 300 g",
    categoria: "Rendimiento",
    precio: 15990,
    imagen: "/images/phantom/product-creatina.png",
    detalles: ["Creatina monohidratada", "300 g", "Uso diario"],
    descripcion:
      "Creatina monohidratada en formato de 300 g. Sigue la porción y las indicaciones de uso señaladas en el envase.",
  },
  {
    id: "colageno-acai",
    nombre: "Colágeno + Açaí 300 g",
    categoria: "Bienestar",
    precio: 20990,
    imagen: "/images/phantom/product-colageno.png",
    detalles: ["Colágeno + açaí", "300 g", "Fácil de incorporar a la rutina"],
    descripcion:
      "Fórmula en polvo de colágeno + açaí en formato de 300 g. Revisa el envase para consultar ingredientes, información nutricional y recomendaciones de uso.",
  },
];

export const COSTO_ENVIO = 3990; // CLP. Confirmar tarifa final antes de vender.
