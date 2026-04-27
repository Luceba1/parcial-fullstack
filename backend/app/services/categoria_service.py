from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.models.categoria import Categoria
from app.models.producto_categoria import ProductoCategoria
from app.schemas.categoria_schema import CategoriaCreate, CategoriaUpdate
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


def listar(uow: SQLModelUnitOfWork) -> list[Categoria]:
    statement = select(Categoria).where(Categoria.activo == True).order_by(Categoria.nombre)
    return list(uow.exec(statement).all())


def obtener_por_id(uow: SQLModelUnitOfWork, categoria_id: int) -> Categoria:
    categoria = uow.get(Categoria, categoria_id)
    if categoria is None or not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada.",
        )
    return categoria


def crear(uow: SQLModelUnitOfWork, payload: CategoriaCreate) -> Categoria:
    categoria = Categoria(**payload.model_dump())
    uow.add(categoria)
    _commit_or_raise(uow, "No se pudo crear la categoría.")
    uow.refresh(categoria)
    return categoria


def actualizar(
    uow: SQLModelUnitOfWork,
    categoria_id: int,
    payload: CategoriaUpdate,
) -> Categoria:
    categoria = obtener_por_id(uow, categoria_id)
    cambios = payload.model_dump(exclude_unset=True)

    for campo, valor in cambios.items():
        setattr(categoria, campo, valor)

    uow.add(categoria)
    _commit_or_raise(uow, "No se pudo actualizar la categoría.")
    uow.refresh(categoria)
    return categoria


def eliminar(uow: SQLModelUnitOfWork, categoria_id: int) -> None:
    categoria = obtener_por_id(uow, categoria_id)

    relacionada = uow.exec(
        select(ProductoCategoria).where(ProductoCategoria.categoria_id == categoria_id)
    ).first()

    if relacionada is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar la categoría porque está asociada a productos.",
        )

    categoria.activo = False
    uow.add(categoria)
    _commit_or_raise(uow, "No se pudo eliminar la categoría.")
