from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.schemas.categoria_schema import CategoriaSimpleRead
from app.schemas.ingrediente_schema import IngredienteSimpleRead


class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    precio_base: Decimal = Field(default=0, max_digits=10, decimal_places=2, ge=0)
    imagenes_url: list[str] = Field(default_factory=list)
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    categoria_ids: list[int] = Field(default_factory=list)
    ingrediente_ids: list[int] = Field(default_factory=list)


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    precio_base: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=2, ge=0)
    imagenes_url: Optional[list[str]] = None
    stock_cantidad: Optional[int] = Field(default=None, ge=0)
    disponible: Optional[bool] = None
    categoria_ids: Optional[list[int]] = None
    ingrediente_ids: Optional[list[int]] = None


class ProductoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_base: Decimal
    imagenes_url: list[str] = Field(default_factory=list)
    stock_cantidad: int
    disponible: bool
    created_at: datetime


class ProductoReadDetail(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_base: Decimal
    imagenes_url: list[str] = Field(default_factory=list)
    stock_cantidad: int
    disponible: bool
    created_at: datetime
    categorias: list[CategoriaSimpleRead] = Field(default_factory=list)
    ingredientes: list[IngredienteSimpleRead] = Field(default_factory=list)


ProductoReadDetail.model_rebuild()
