import { useMemo, useState } from "react";

import PageContainer from "../components/layout/PageContainer";
import ProductoModal from "../components/productos/ProductoModal";
import ProductoTable from "../components/productos/ProductoTable";
import { useCategorias } from "../hooks/useCategorias";
import { useIngredientes } from "../hooks/useIngredientes";
import {
  useActualizarProducto,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from "../hooks/useProductos";
import type { Producto, ProductoPayload } from "../types/producto";

const PAGE_SIZE = 10;

export default function ProductosPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Producto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [page, setPage] = useState(1);

  const categoriasQuery = useCategorias();
  const ingredientesQuery = useIngredientes();
  const productosQuery = useProductos(currentSearch, page, PAGE_SIZE);

  const crearMutation = useCrearProducto();
  const actualizarMutation = useActualizarProducto();
  const eliminarMutation = useEliminarProducto();

  const isSaving = crearMutation.isPending || actualizarMutation.isPending;
  const isDeleting = eliminarMutation.isPending;

  const canGoNext = useMemo(() => {
    return (productosQuery.data?.length ?? 0) === PAGE_SIZE;
  }, [productosQuery.data]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setCurrentSearch(search);
  }

  function handleNew() {
    setSelected(null);
    setFormError(null);
    setOpen(true);
  }

  function handleEdit(producto: Producto) {
    setSelected(producto);
    setFormError(null);
    setOpen(true);
  }

  function handleClose() {
    if (isSaving) {
      return;
    }

    setOpen(false);
    setSelected(null);
    setFormError(null);
  }

  async function handleSubmit(payload: ProductoPayload) {
    try {
      if (selected) {
        await actualizarMutation.mutateAsync({ id: selected.id, payload });
      } else {
        await crearMutation.mutateAsync(payload);
      }
      handleClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Ocurrió un error al guardar.");
    }
  }

  async function handleDelete(producto: Producto) {
    if (isDeleting) return;

    const confirmacion = window.confirm(
      `¿Seguro que querés eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmacion) return;

    try {
      await eliminarMutation.mutateAsync(producto.id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <PageContainer
      title="Productos"
      subtitle="Listado con búsqueda, paginación simple, detalle, categorías e ingredientes relacionados."
      actions={
        <button
          type="button"
          onClick={handleNew}
          disabled={isDeleting || categoriasQuery.isLoading || ingredientesQuery.isLoading}
          className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Nuevo producto
        </button>
      }
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSearchSubmit}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o descripción"
            className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={productosQuery.isFetching}
            className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Buscar
          </button>
        </form>
      </div>

      {productosQuery.isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Cargando productos...
        </div>
      ) : null}

      {productosQuery.isError ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
          {productosQuery.error instanceof Error
            ? productosQuery.error.message
            : "Ocurrió un error al cargar los productos."}
        </div>
      ) : null}

      {productosQuery.data ? (
        <>
          <ProductoTable
            items={productosQuery.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || productosQuery.isFetching}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              Página anterior
            </button>
            <p className="text-sm text-slate-300">
              Página {page}{productosQuery.isFetching ? " · actualizando..." : ""}
            </p>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!canGoNext || productosQuery.isFetching}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              Página siguiente
            </button>
          </div>
        </>
      ) : null}

      <ProductoModal
        open={open}
        initialData={selected}
        categorias={categoriasQuery.data ?? []}
        ingredientes={ingredientesQuery.data ?? []}
        saving={isSaving}
        error={formError}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
