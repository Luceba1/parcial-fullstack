from typing import Annotated

from fastapi import APIRouter, Depends, Path, Response, status

from app.schemas.categoria_schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.services import categoria_service
from app.uow.unit_of_work import SQLModelUnitOfWork, get_uow

router = APIRouter(prefix="/categorias", tags=["Categorías"])

UowDep = Annotated[SQLModelUnitOfWork, Depends(get_uow)]


@router.get("/", response_model=list[CategoriaRead], status_code=status.HTTP_200_OK)
def listar_categorias(uow: UowDep) -> list[CategoriaRead]:
    return categoria_service.listar(uow)


@router.get("/{categoria_id}", response_model=CategoriaRead, status_code=status.HTTP_200_OK)
def obtener_categoria(
    uow: UowDep,
    categoria_id: int = Path(..., ge=1),
) -> CategoriaRead:
    return categoria_service.obtener_por_id(uow, categoria_id)


@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(payload: CategoriaCreate, uow: UowDep) -> CategoriaRead:
    return categoria_service.crear(uow, payload)


@router.put("/{categoria_id}", response_model=CategoriaRead, status_code=status.HTTP_200_OK)
def actualizar_categoria(
    payload: CategoriaUpdate,
    uow: UowDep,
    categoria_id: int = Path(..., ge=1),
) -> CategoriaRead:
    return categoria_service.actualizar(uow, categoria_id, payload)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    uow: UowDep,
    categoria_id: int = Path(..., ge=1),
) -> Response:
    categoria_service.eliminar(uow, categoria_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
