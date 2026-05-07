import { request } from "./api";
import type { Producto, ProductoPayload } from "../types/producto";

export function getProductos(search = "", page = 1, size = 10) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", String(page));
  params.set("size", String(size));

  return request<Producto[]>(`/productos/?${params.toString()}`);
}

export function getProductoById(id: number) {
  return request<Producto>(`/productos/${id}`);
}

export function createProducto(payload: ProductoPayload) {
  return request<Producto>("/productos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProducto(id: number, payload: ProductoPayload) {
  return request<Producto>(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProducto(id: number) {
  return request<void>(`/productos/${id}`, {
    method: "DELETE",
  });
}
