import { request } from "./api";
import type { Categoria, CategoriaPayload } from "../types/categoria";

export function getCategorias() {
  return request<Categoria[]>("/categorias/");
}

export function createCategoria(payload: CategoriaPayload) {
  return request<Categoria>("/categorias/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCategoria(id: number, payload: CategoriaPayload) {
  return request<Categoria>(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCategoria(id: number) {
  return request<void>(`/categorias/${id}`, {
    method: "DELETE",
  });
}