"use client";

import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import { productos, Producto } from "./productos";

type ItemGuardado = { id: string; cantidad: number };

type Estado = { items: ItemGuardado[] };

type Accion =
  | { type: "AGREGAR"; id: string; cantidad: number }
  | { type: "QUITAR"; id: string }
  | { type: "ACTUALIZAR_CANTIDAD"; id: string; cantidad: number }
  | { type: "VACIAR" }
  | { type: "CARGAR"; items: ItemGuardado[] };

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.type) {
    case "AGREGAR": {
      const existente = estado.items.find((i) => i.id === accion.id);
      if (existente) {
        return {
          items: estado.items.map((i) =>
            i.id === accion.id ? { ...i, cantidad: i.cantidad + accion.cantidad } : i
          ),
        };
      }
      return { items: [...estado.items, { id: accion.id, cantidad: accion.cantidad }] };
    }
    case "QUITAR":
      return { items: estado.items.filter((i) => i.id !== accion.id) };
    case "ACTUALIZAR_CANTIDAD":
      return {
        items: estado.items.map((i) =>
          i.id === accion.id ? { ...i, cantidad: Math.max(1, accion.cantidad) } : i
        ),
      };
    case "VACIAR":
      return { items: [] };
    case "CARGAR":
      return { items: accion.items };
    default:
      return estado;
  }
}

export type ItemCarrito = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type CarritoContextType = {
  items: ItemCarrito[];
  agregar: (producto: Producto, cantidad?: number) => void;
  quitar: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
  subtotal: number;
  cantidadTotal: number;
};

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const guardado = localStorage.getItem("phantom-carrito");
    if (guardado) {
      try {
        const items = JSON.parse(guardado);
        // Solo nos importa id + cantidad, aunque el carrito viejo
        // guardado en el navegador traiga campos antiguos de más.
        dispatch({
          type: "CARGAR",
          items: items.map((i: any) => ({ id: i.id, cantidad: i.cantidad })),
        });
      } catch {
        // ignorar carrito corrupto
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("phantom-carrito", JSON.stringify(estado.items));
  }, [estado.items]);

  // El precio, nombre e imagen SIEMPRE se leen del catálogo actual
  // (lib/productos.ts) — nunca quedan congelados en el carrito.
  const items: ItemCarrito[] = estado.items
    .map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      if (!producto) return null;
      return {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: item.cantidad,
      };
    })
    .filter((i): i is ItemCarrito => i !== null);

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregar: (producto, cantidad = 1) =>
          dispatch({ type: "AGREGAR", id: producto.id, cantidad }),
        quitar: (id) => dispatch({ type: "QUITAR", id }),
        actualizarCantidad: (id, cantidad) =>
          dispatch({ type: "ACTUALIZAR_CANTIDAD", id, cantidad }),
        vaciar: () => dispatch({ type: "VACIAR" }),
        subtotal,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
