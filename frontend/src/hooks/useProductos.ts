import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  updateProducto,
} from "../services/productoService";

export function useProductos(search: string, page: number, size: number) {
  return useQuery({
    queryKey: ["productos", search, page, size],
    queryFn: () => getProductos(search, page, size),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProductoById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateProducto>[1] }) =>
      updateProducto(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
      await queryClient.invalidateQueries({ queryKey: ["producto", variables.id] });
    },
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}
