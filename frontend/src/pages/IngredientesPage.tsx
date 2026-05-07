import { useState } from "react";

import IngredienteModal from "../components/ingredientes/IngredienteModal";
import IngredienteTable from "../components/ingredientes/IngredienteTable";
import PageContainer from "../components/layout/PageContainer";
import {
  useActualizarIngrediente,
  useCrearIngrediente,
  useEliminarIngrediente,
  useIngredientes,
} from "../hooks/useIngredientes";
import type { Ingrediente, IngredientePayload } from "../types/ingrediente";

export default function IngredientesPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ingrediente | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const ingredientesQuery = useIngredientes();
  const crearMutation = useCrearIngrediente();
  const actualizarMutation = useActualizarIngrediente();
  const eliminarMutation = useEliminarIngrediente();
  const deleting = eliminarMutation.isPending;

  function handleNew() {
    setSelected(null);
    setFormError(null);
    setOpen(true);
  }

  function handleEdit(ingrediente: Ingrediente) {
    setSelected(ingrediente);
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

  async function handleSubmit(payload: IngredientePayload) {
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

  async function handleDelete(ingrediente: Ingrediente) {
    if (deleting) return;

    const confirmacion = window.confirm(
      `¿Seguro que querés eliminar el ingrediente "${ingrediente.nombre}"?`
    );

    if (!confirmacion) return;

    try {
      await eliminarMutation.mutateAsync(ingrediente.id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <PageContainer
      title="Ingredientes"
      subtitle="ABM de ingredientes con tabla, acciones y modal tipado en TypeScript."
      actions={
        <button
          type="button"
          onClick={handleNew}
          disabled={deleting}
          className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Nuevo ingrediente
        </button>
      }
    >
      {ingredientesQuery.isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Cargando ingredientes...
        </div>
      ) : null}

      {ingredientesQuery.isError ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">
          {ingredientesQuery.error instanceof Error
            ? ingredientesQuery.error.message
            : "Ocurrió un error al cargar los ingredientes."}
        </div>
      ) : null}

      {ingredientesQuery.data ? (
        <IngredienteTable
          items={ingredientesQuery.data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : null}

      <IngredienteModal
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
