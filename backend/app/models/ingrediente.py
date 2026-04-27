from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional, List

from sqlmodel import Field, Relationship, SQLModel

from app.models.producto_ingrediente import ProductoIngrediente

if TYPE_CHECKING:
    from app.models.producto import Producto


class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingrediente"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True, min_length=2, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    es_alergeno: bool = Field(default=False)
    activo: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    productos: List["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model=ProductoIngrediente,
    )