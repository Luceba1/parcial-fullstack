from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.models.categoria import Categoria
from app.schemas.categoria_schema import CategoriaCreate, CategoriaUpdate
from app.uow.unit_of_work import SQLModelUnitOfWork


def _integrity_error(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=detail,
    )


def listar(uow: SQLModelUnitOfWork) -> list[Categoria]:
    return uow.categorias.list_active()


def obtener_por_id(uow: SQLModelUnitOfWork, categoria_id: int) -> Categoria:
    categoria = uow.categorias.get_active_by_id(categoria_id)
    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada.",
        )
    return categoria


def crear(uow: SQLModelUnitOfWork, payload: CategoriaCreate) -> Categoria:
    categoria = Categoria(**payload.model_dump())
    try:
        return uow.categorias.create(categoria)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo crear la categoría.") from exc


def actualizar(
    uow: SQLModelUnitOfWork,
    categoria_id: int,
    payload: CategoriaUpdate,
) -> Categoria:
    categoria = obtener_por_id(uow, categoria_id)
    cambios = payload.model_dump(exclude_unset=True)

    for campo, valor in cambios.items():
        setattr(categoria, campo, valor)

    try:
        return uow.categorias.update(categoria)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo actualizar la categoría.") from exc


def eliminar(uow: SQLModelUnitOfWork, categoria_id: int) -> None:
    categoria = obtener_por_id(uow, categoria_id)

    if uow.categorias.has_productos(categoria_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar la categoría porque está asociada a productos.",
        )

    categoria.activo = False
    try:
        uow.categorias.update(categoria)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo eliminar la categoría.") from exc
