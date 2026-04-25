import type { Categoria } from "../../types/categoria";

export interface CategoriaTableProps {
  items: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

export default function CategoriaTable({
  items,
  onEdit,
  onDelete,
}: CategoriaTableProps) {
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
            {items.map((categoria) => (
              <tr key={categoria.id} className="border-t border-white/5">
                <td className="px-5 py-4 text-slate-300">{categoria.id}</td>
                <td className="px-5 py-4 font-semibold text-white">{categoria.nombre}</td>
                <td className="px-5 py-4 text-slate-300">
                  {categoria.descripcion || "Sin descripción"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(categoria)}
                      className="rounded-xl bg-amber-500/15 px-3 py-2 font-medium text-amber-200 hover:bg-amber-500/25"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(categoria)}
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
                  No hay categorías cargadas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
