import { useState } from "react";

import CategoriaModal from "../components/categorias/CategoriaModal";
import CategoriaTable from "../components/categorias/CategoriaTable";
import PageContainer from "../components/layout/PageContainer";
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from "../hooks/useCategorias";
import type { Categoria, CategoriaPayload } from "../types/categoria";

export default function CategoriasPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Categoria | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const categoriasQuery = useCategorias();
  const crearMutation = useCrearCategoria();
  const actualizarMutation = useActualizarCategoria();
  const eliminarMutation = useEliminarCategoria();
  const deleting = eliminarMutation.isPending;

  function handleNew() {
    setSelected(null);
    setFormError(null);
    setOpen(true);
  }

  function handleEdit(categoria: Categoria) {
    setSelected(categoria);
    setFormError(null);
    setOpen(true);
  }

  function handleClose() {
    if (crearMutation.isPending || actualizarMutation.isPending) {
      return;
    }

    setOpen(false);
    setSelected(null);
    setFormError(null);
  }

  async function handleSubmit(payload: CategoriaPayload) {
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

  async function handleDelete(categoria: Categoria) {
    if (deleting) return;

    const confirmacion = window.confirm(
      `¿Seguro que querés eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmacion) return;

    try {
      await eliminarMutation.mutateAsync(categoria.id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <PageContainer
      title="Categorías"
      subtitle="ABM de categorías con modal, tabla y consumo real desde FastAPI."
      actions={
        <button
          type="button"
          onClick={handleNew}
          disabled={deleting}
          className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Nueva categoría
        </button>
      }
    >
      {categoriasQuery.isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Cargando categorías...
        </div>
      ) : null}

      {categoriasQuery.isError ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
          {categoriasQuery.error instanceof Error
            ? categoriasQuery.error.message
            : "Ocurrió un error al cargar las categorías."}
        </div>
      ) : null}

      {categoriasQuery.data ? (
        <CategoriaTable
          items={categoriasQuery.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : null}

      <CategoriaModal
        open={open}
        initialData={selected}
        saving={crearMutation.isPending || actualizarMutation.isPending}
        error={formError}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
