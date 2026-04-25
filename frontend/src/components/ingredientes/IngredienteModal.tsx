import { useEffect, useState } from "react";

import Modal from "../common/Modal";
import FormError from "../common/FormError";
import type { Ingrediente, IngredientePayload } from "../../types/ingrediente";

export interface IngredienteModalProps {
  open: boolean;
  initialData: Ingrediente | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: IngredientePayload) => Promise<void>;
}

export default function IngredienteModal({
  open,
  initialData,
  saving,
  error,
  onClose,
  onSubmit,
}: IngredienteModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    setNombre(initialData?.nombre ?? "");
    setDescripcion(initialData?.descripcion ?? "");
  }, [initialData, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      nombre,
      descripcion: descripcion || null,
    });
  }

  return (
    <Modal
      open={open}
      title={initialData ? "Editar ingrediente" : "Nuevo ingrediente"}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormError message={error} />

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Nombre</label>
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            placeholder="Harina, Leche, Queso, etc."
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Descripción opcional"
            maxLength={255}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200 hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
