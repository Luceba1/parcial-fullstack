from __future__ import annotations

from typing import Optional

from sqlmodel import Field, SQLModel


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: Optional[int] = Field(
        default=None,
        foreign_key="producto.id",
        primary_key=True,
    )
    categoria_id: Optional[int] = Field(
        default=None,
        foreign_key="categoria.id",
        primary_key=True,
    )
