from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.models.ingrediente import Ingrediente
from app.schemas.ingrediente_schema import IngredienteCreate, IngredienteUpdate
from app.uow.unit_of_work import SQLModelUnitOfWork


def _integrity_error(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=detail,
    )


def listar(uow: SQLModelUnitOfWork) -> list[Ingrediente]:
    return uow.ingredientes.list_active()


def obtener_por_id(uow: SQLModelUnitOfWork, ingrediente_id: int) -> Ingrediente:
    ingrediente = uow.ingredientes.get_active_by_id(ingrediente_id)
    if ingrediente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingrediente no encontrado.",
        )
    return ingrediente


def crear(uow: SQLModelUnitOfWork, payload: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente(**payload.model_dump())
    try:
        return uow.ingredientes.create(ingrediente)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo crear el ingrediente.") from exc


def actualizar(
    uow: SQLModelUnitOfWork,
    ingrediente_id: int,
    payload: IngredienteUpdate,
) -> Ingrediente:
    ingrediente = obtener_por_id(uow, ingrediente_id)
    cambios = payload.model_dump(exclude_unset=True)

    for campo, valor in cambios.items():
        setattr(ingrediente, campo, valor)

    try:
        return uow.ingredientes.update(ingrediente)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo actualizar el ingrediente.") from exc


def eliminar(uow: SQLModelUnitOfWork, ingrediente_id: int) -> None:
    ingrediente = obtener_por_id(uow, ingrediente_id)

    if uow.ingredientes.has_productos(ingrediente_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el ingrediente porque está asociado a productos.",
        )

    ingrediente.activo = False
    try:
        uow.ingredientes.update(ingrediente)
    except IntegrityError as exc:
        raise _integrity_error("No se pudo eliminar el ingrediente.") from exc
