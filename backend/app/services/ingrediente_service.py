from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.models.ingrediente import Ingrediente
from app.models.producto_ingrediente import ProductoIngrediente
from app.schemas.ingrediente_schema import IngredienteCreate, IngredienteUpdate
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


def listar(uow: SQLModelUnitOfWork) -> list[Ingrediente]:
    statement = select(Ingrediente).where(Ingrediente.activo == True).order_by(Ingrediente.nombre)
    return list(uow.exec(statement).all())


def obtener_por_id(uow: SQLModelUnitOfWork, ingrediente_id: int) -> Ingrediente:
    ingrediente = uow.get(Ingrediente, ingrediente_id)
    if ingrediente is None or not ingrediente.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingrediente no encontrado.",
        )
    return ingrediente


def crear(uow: SQLModelUnitOfWork, payload: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente(**payload.model_dump())
    uow.add(ingrediente)
    _commit_or_raise(uow, "No se pudo crear el ingrediente.")
    uow.refresh(ingrediente)
    return ingrediente


def actualizar(
    uow: SQLModelUnitOfWork,
    ingrediente_id: int,
    payload: IngredienteUpdate,
) -> Ingrediente:
    ingrediente = obtener_por_id(uow, ingrediente_id)
    cambios = payload.model_dump(exclude_unset=True)

    for campo, valor in cambios.items():
        setattr(ingrediente, campo, valor)

    uow.add(ingrediente)
    _commit_or_raise(uow, "No se pudo actualizar el ingrediente.")
    uow.refresh(ingrediente)
    return ingrediente


def eliminar(uow: SQLModelUnitOfWork, ingrediente_id: int) -> None:
    ingrediente = obtener_por_id(uow, ingrediente_id)

    relacionada = uow.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.ingrediente_id == ingrediente_id)
    ).first()

    if relacionada is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el ingrediente porque está asociado a productos.",
        )

    ingrediente.activo = False
    uow.add(ingrediente)
    _commit_or_raise(uow, "No se pudo eliminar el ingrediente.")
