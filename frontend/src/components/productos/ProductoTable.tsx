import { Link } from "react-router-dom";

import type { Producto } from "../../types/producto";

export interface ProductoTableProps {
  items: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export default function ProductoTable({
  items,
  onEdit,
  onDelete,
}: ProductoTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Nombre</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Categorías</th>
              <th className="px-5 py-4">Ingredientes</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((producto) => (
              <tr key={producto.id} className="border-t border-white/5 align-top">
                <td className="px-5 py-4 text-slate-300">{producto.id}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{producto.nombre}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {producto.descripcion || "Sin descripción"}
                  </p>
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-300">
                  ${producto.precio.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-slate-300">
                  {producto.categorias.length
                    ? producto.categorias.map((categoria) => categoria.nombre).join(", ")
                    : "Sin categorías"}
                </td>
                <td className="px-5 py-4 text-slate-300">
                  {producto.ingredientes.length
                    ? producto.ingredientes.map((ingrediente) => ingrediente.nombre).join(", ")
                    : "Sin ingredientes"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      to={`/productos/${producto.id}`}
                      className="rounded-xl bg-sky-500/15 px-3 py-2 font-medium text-sky-200 hover:bg-sky-500/25"
                    >
                      Ver detalle
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(producto)}
                      className="rounded-xl bg-amber-500/15 px-3 py-2 font-medium text-amber-200 hover:bg-amber-500/25"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(producto)}
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
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  No hay productos cargados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
