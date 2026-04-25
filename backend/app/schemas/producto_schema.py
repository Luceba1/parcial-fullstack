from __future__ import annotations

from typing import Optional

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.schemas.categoria_schema import CategoriaSimpleRead
from app.schemas.ingrediente_schema import IngredienteSimpleRead


class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    precio: float = Field(gt=0)
    categoria_ids: list[int] = Field(default_factory=list)
    ingrediente_ids: list[int] = Field(default_factory=list)


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    precio: Optional[float] = Field(default=None, gt=0)
    categoria_ids: Optional[list[int]] = None
    ingrediente_ids: Optional[list[int]] = None


class ProductoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: float


class ProductoReadDetail(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    categorias: list[CategoriaSimpleRead] = Field(default_factory=list)
    ingredientes: list[IngredienteSimpleRead] = Field(default_factory=list)


ProductoReadDetail.model_rebuild()
