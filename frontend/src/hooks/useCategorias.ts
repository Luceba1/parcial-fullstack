import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../services/categoriaService";

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });
}

export function useCrearCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useActualizarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateCategoria>[1] }) =>
      updateCategoria(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useEliminarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}
