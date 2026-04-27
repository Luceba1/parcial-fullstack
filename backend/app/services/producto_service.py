from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.models.categoria import Categoria
from app.models.ingrediente import Ingrediente
from app.models.producto import Producto
from app.models.producto_categoria import ProductoCategoria
from app.models.producto_ingrediente import ProductoIngrediente
from app.schemas.producto_schema import ProductoCreate, ProductoUpdate
from app.uow.unit_of_work import SQLModelUnitOfWork


def _commit_or_raise(uow: SQLModelUnitOfWork, detail: str) -> None:
    try:
        uow.commit()
    except IntegrityError as exc:
        uow.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        ) from exc


def _validar_ids_unicos(ids: list[int], nombre_campo: str) -> None:
    if len(ids) != len(set(ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se permiten ids repetidos en {nombre_campo}.",
        )


def _cargar_relaciones(uow: SQLModelUnitOfWork, producto_id: int) -> Producto:
    statement = (
        select(Producto)
        .options(
            selectinload(Producto.categorias),
            selectinload(Producto.ingredientes),
        )
        .where(Producto.id == producto_id, Producto.activo == True)
    )
    producto = uow.exec(statement).first()
    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado.",
        )
    return producto


def _obtener_categorias(uow: SQLModelUnitOfWork, categoria_ids: list[int]) -> list[Categoria]:
    if not categoria_ids:
        return []

    _validar_ids_unicos(categoria_ids, "categoria_ids")
    statement = select(Categoria).where(Categoria.id.in_(categoria_ids))
    categorias = list(uow.exec(statement).all())

    if len(categorias) != len(categoria_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Una o más categorías no existen.",
        )
    return categorias


def _obtener_ingredientes(uow: SQLModelUnitOfWork, ingrediente_ids: list[int]) -> list[Ingrediente]:
    if not ingrediente_ids:
        return []

    _validar_ids_unicos(ingrediente_ids, "ingrediente_ids")
    statement = select(Ingrediente).where(Ingrediente.id.in_(ingrediente_ids))
    ingredientes = list(uow.exec(statement).all())

    if len(ingredientes) != len(ingrediente_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uno o más ingredientes no existen.",
        )
    return ingredientes


def listar(
    uow: SQLModelUnitOfWork,
    search: str | None = None,
    page: int = 1,
    size: int = 10,
) -> list[Producto]:
    statement = select(Producto).where(Producto.activo == True).options(
        selectinload(Producto.categorias),
        selectinload(Producto.ingredientes),
    )

    if search:
        pattern = f"%{search}%"
        statement = statement.where(
            or_(
                Producto.nombre.ilike(pattern),
                Producto.descripcion.ilike(pattern),
            )
        )

    statement = statement.order_by(Producto.id.desc()).offset((page - 1) * size).limit(size)
    return list(uow.exec(statement).all())


def obtener_por_id(uow: SQLModelUnitOfWork, producto_id: int) -> Producto:
    return _cargar_relaciones(uow, producto_id)


def crear(uow: SQLModelUnitOfWork, payload: ProductoCreate) -> Producto:
    categorias = _obtener_categorias(uow, payload.categoria_ids)
    ingredientes = _obtener_ingredientes(uow, payload.ingrediente_ids)

    producto = Producto(
        nombre=payload.nombre,
        descripcion=payload.descripcion,
        precio_base=payload.precio_base,
        imagenes_url=payload.imagenes_url,
        stock_cantidad=payload.stock_cantidad,
        disponible=payload.disponible,
    )
    producto.categorias = categorias
    producto.ingredientes = ingredientes

    uow.add(producto)
    _commit_or_raise(uow, "No se pudo crear el producto.")
    uow.refresh(producto)

    return _cargar_relaciones(uow, producto.id)


def actualizar(
    uow: SQLModelUnitOfWork,
    producto_id: int,
    payload: ProductoUpdate,
) -> Producto:
    producto = _cargar_relaciones(uow, producto_id)
    cambios = payload.model_dump(exclude_unset=True)

    if "nombre" in cambios:
        producto.nombre = cambios["nombre"]
    if "descripcion" in cambios:
        producto.descripcion = cambios["descripcion"]
    if "precio_base" in cambios:
        producto.precio_base = cambios["precio_base"]
    if "imagenes_url" in cambios:
        producto.imagenes_url = cambios["imagenes_url"]
    if "stock_cantidad" in cambios:
        producto.stock_cantidad = cambios["stock_cantidad"]
    if "disponible" in cambios:
        producto.disponible = cambios["disponible"]
    if "categoria_ids" in cambios and cambios["categoria_ids"] is not None:
        producto.categorias = _obtener_categorias(uow, cambios["categoria_ids"])
    if "ingrediente_ids" in cambios and cambios["ingrediente_ids"] is not None:
        producto.ingredientes = _obtener_ingredientes(uow, cambios["ingrediente_ids"])

    uow.add(producto)
    _commit_or_raise(uow, "No se pudo actualizar el producto.")
    uow.refresh(producto)

    return _cargar_relaciones(uow, producto.id)


def eliminar(uow: SQLModelUnitOfWork, producto_id: int) -> None:
    producto = _cargar_relaciones(uow, producto_id)

    producto.activo = False
    uow.add(producto)
    _commit_or_raise(uow, "No se pudo eliminar el producto.")
