import { request } from "./api";
import type { Ingrediente, IngredientePayload } from "../types/ingrediente";

export function getIngredientes() {
  return request<Ingrediente[]>("/ingredientes/");
}

export function createIngrediente(payload: IngredientePayload) {
  return request<Ingrediente>("/ingredientes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateIngrediente(id: number, payload: IngredientePayload) {
  return request<Ingrediente>(`/ingredientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteIngrediente(id: number) {
  return request<void>(`/ingredientes/${id}`, {
    method: "DELETE",
  });
}