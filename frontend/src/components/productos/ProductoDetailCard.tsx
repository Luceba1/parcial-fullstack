import type { Producto } from "../../types/producto";

interface ProductoDetailCardProps {
  producto: Producto;
}

export default function ProductoDetailCard({ producto }: ProductoDetailCardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr_1fr]">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Producto</p>
        <h3 className="mt-2 text-3xl font-bold text-white">{producto.nombre}</h3>
        <p className="mt-4 text-sm text-slate-300">
          {producto.descripcion || "Este producto no tiene descripción."}
        </p>
        <div className="mt-6 inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
          Precio: ${producto.precio.toFixed(2)}
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h4 className="text-lg font-semibold text-white">Categorías</h4>
        <ul className="mt-4 space-y-3">
          {producto.categorias.length ? (
            producto.categorias.map((categoria) => (
              <li
                key={categoria.id}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-200"
              >
                {categoria.nombre}
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-400">Sin categorías asociadas.</li>
          )}
        </ul>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h4 className="text-lg font-semibold text-white">Ingredientes</h4>
        <ul className="mt-4 space-y-3">
          {producto.ingredientes.length ? (
            producto.ingredientes.map((ingrediente) => (
              <li
                key={ingrediente.id}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-200"
              >
                {ingrediente.nombre}
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-400">Sin ingredientes asociados.</li>
          )}
        </ul>
      </article>
    </div>
  );
}
