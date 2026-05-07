import { useEffect, useState } from "react";

import Modal from "../common/Modal";
import FormError from "../common/FormError";
import type { Categoria } from "../../types/categoria";
import type { Ingrediente } from "../../types/ingrediente";
import type { Producto, ProductoPayload } from "../../types/producto";

export interface ProductoModalProps {
  open: boolean;
  initialData: Producto | null;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: ProductoPayload) => Promise<void>;
}

export default function ProductoModal({
  open,
  initialData,
  categorias,
  ingredientes,
  saving,
  error,
  onClose,
  onSubmit,
}: ProductoModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("0");
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [ingredienteIds, setIngredienteIds] = useState<number[]>([]);

  useEffect(() => {
    setNombre(initialData?.nombre ?? "");
    setDescripcion(initialData?.descripcion ?? "");
    setPrecio(initialData ? String(initialData.precio) : "0");
    setCategoriaIds(initialData?.categorias.map((item) => item.id) ?? []);
    setIngredienteIds(initialData?.ingredientes.map((item) => item.id) ?? []);
  }, [initialData, open]);

  function toggleSelection(
    currentValues: number[],
    value: number,
    setter: (newValues: number[]) => void
  ) {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value));
    } else {
      setter([...currentValues, value]);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      nombre,
      descripcion: descripcion || null,
      precio: Number(precio),
      categoria_ids: categoriaIds,
      ingrediente_ids: ingredienteIds,
    });
  }

  return (
    <Modal
      open={open}
      title={initialData ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormError message={error} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-200">Nombre</label>
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              placeholder="Pizza muzzarella, Café latte..."
              required
              minLength={2}
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-200">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              placeholder="Descripción opcional"
              maxLength={255}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="mb-3 text-sm font-semibold text-white">Categorías</h4>
            <div className="space-y-2">
              {categorias.map((categoria) => (
                <label
                  key={categoria.id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2 text-sm text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={categoriaIds.includes(categoria.id)}
                    onChange={() => toggleSelection(categoriaIds, categoria.id, setCategoriaIds)}
                  />
                  {categoria.nombre}
                </label>
              ))}
              {!categorias.length ? (
                <p className="text-sm text-slate-400">No hay categorías disponibles.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="mb-3 text-sm font-semibold text-white">Ingredientes</h4>
            <div className="space-y-2">
              {ingredientes.map((ingrediente) => (
                <label
                  key={ingrediente.id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2 text-sm text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={ingredienteIds.includes(ingrediente.id)}
                    onChange={() =>
                      toggleSelection(ingredienteIds, ingrediente.id, setIngredienteIds)
                    }
                  />
                  {ingrediente.nombre}
                </label>
              ))}
              {!ingredientes.length ? (
                <p className="text-sm text-slate-400">No hay ingredientes disponibles.</p>
              ) : null}
            </div>
          </div>
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
