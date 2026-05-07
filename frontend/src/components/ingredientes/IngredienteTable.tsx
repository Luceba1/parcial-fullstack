import type { Ingrediente } from "../../types/ingrediente";

export interface IngredienteTableProps {
  items: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (ingrediente: Ingrediente) => void;
}

export default function IngredienteTable({
  items,
  onEdit,
  onDelete,
}: IngredienteTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Nombre</th>
              <th className="px-5 py-4">Descripción</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ingrediente) => (
              <tr key={ingrediente.id} className="border-t border-white/5">
                <td className="px-5 py-4 text-slate-300">{ingrediente.id}</td>
                <td className="px-5 py-4 font-semibold text-white">{ingrediente.nombre}</td>
                <td className="px-5 py-4 text-slate-300">
                  {ingrediente.descripcion || "Sin descripción"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(ingrediente)}
                      className="rounded-xl bg-amber-500/15 px-3 py-2 font-medium text-amber-200 hover:bg-amber-500/25"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(ingrediente)}
                      className="rounded-xl bg-rose-500/15 px-3 py-2 font-medium text-rose-200 hover:bg-rose-500/25"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No hay ingredientes cargados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
