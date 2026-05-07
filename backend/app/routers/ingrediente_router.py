from typing import Annotated

from fastapi import APIRouter, Depends, Path, Response, status

from app.schemas.ingrediente_schema import (
    IngredienteCreate,
    IngredienteRead,
    IngredienteUpdate,
)
from app.services import ingrediente_service
from app.uow.unit_of_work import SQLModelUnitOfWork, get_uow

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

UowDep = Annotated[SQLModelUnitOfWork, Depends(get_uow)]


@router.get("/", response_model=list[IngredienteRead], status_code=status.HTTP_200_OK)
def listar_ingredientes(uow: UowDep) -> list[IngredienteRead]:
    return ingrediente_service.listar(uow)


@router.get("/{ingrediente_id}", response_model=IngredienteRead, status_code=status.HTTP_200_OK)
def obtener_ingrediente(
    uow: UowDep,
    ingrediente_id: int = Path(..., ge=1),
) -> IngredienteRead:
    return ingrediente_service.obtener_por_id(uow, ingrediente_id)


@router.post("/", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente(payload: IngredienteCreate, uow: UowDep) -> IngredienteRead:
    return ingrediente_service.crear(uow, payload)


@router.put("/{ingrediente_id}", response_model=IngredienteRead, status_code=status.HTTP_200_OK)
def actualizar_ingrediente(
    payload: IngredienteUpdate,
    uow: UowDep,
    ingrediente_id: int = Path(..., ge=1),
) -> IngredienteRead:
    return ingrediente_service.actualizar(uow, ingrediente_id, payload)


@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(
    uow: UowDep,
    ingrediente_id: int = Path(..., ge=1),
) -> Response:
    ingrediente_service.eliminar(uow, ingrediente_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
