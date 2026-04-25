export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface IngredientePayload {
  nombre: string;
  descripcion?: string | null;
}
