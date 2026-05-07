import type { Categoria } from "./categoria";
import type { Ingrediente } from "./ingrediente";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categorias: Pick<Categoria, "id" | "nombre">[];
  ingredientes: Pick<Ingrediente, "id" | "nombre">[];
}

export interface ProductoPayload {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria_ids: number[];
  ingrediente_ids: number[];
}
