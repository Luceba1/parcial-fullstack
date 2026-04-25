from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Response, status

from app.schemas.producto_schema import ProductoCreate, ProductoReadDetail, ProductoUpdate
from app.services import producto_service
from app.uow.unit_of_work import SQLModelUnitOfWork, get_uow

router = APIRouter(prefix="/productos", tags=["Productos"])

UowDep = Annotated[SQLModelUnitOfWork, Depends(get_uow)]


@router.get("/", response_model=list[ProductoReadDetail], status_code=status.HTTP_200_OK)
def listar_productos(
    uow: UowDep,
    search: Annotated[str | None, Query(max_length=100)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=50)] = 10,
) -> list[ProductoReadDetail]:
    return producto_service.listar(uow, search=search, page=page, size=size)


@router.get("/{producto_id}", response_model=ProductoReadDetail, status_code=status.HTTP_200_OK)
def obtener_producto(
    uow: UowDep,
    producto_id: int = Path(..., ge=1),
) -> ProductoReadDetail:
    return producto_service.obtener_por_id(uow, producto_id)


@router.post("/", response_model=ProductoReadDetail, status_code=status.HTTP_201_CREATED)
def crear_producto(payload: ProductoCreate, uow: UowDep) -> ProductoReadDetail:
    return producto_service.crear(uow, payload)


@router.put("/{producto_id}", response_model=ProductoReadDetail, status_code=status.HTTP_200_OK)
def actualizar_producto(
    payload: ProductoUpdate,
    uow: UowDep,
    producto_id: int = Path(..., ge=1),
) -> ProductoReadDetail:
    return producto_service.actualizar(uow, producto_id, payload)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    uow: UowDep,
    producto_id: int = Path(..., ge=1),
) -> Response:
    producto_service.eliminar(uow, producto_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
