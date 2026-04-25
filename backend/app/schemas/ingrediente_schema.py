from typing import Optional

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class IngredienteCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=255)


class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=255)


class IngredienteRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str] = None


class IngredienteSimpleRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
