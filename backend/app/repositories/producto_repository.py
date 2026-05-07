from sqlalchemy import or_
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.models.producto import Producto
from app.repositories.base_repository import BaseRepository


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def list_active_with_relations(
        self,
        search: str | None = None,
        page: int = 1,
        size: int = 10,
    ) -> list[Producto]:
        statement = (
            select(Producto)
            .where(Producto.activo == True)  # noqa: E712
            .options(
                selectinload(Producto.categorias),
                selectinload(Producto.ingredientes),
            )
        )

        if search:
            pattern = f"%{search}%"
            statement = statement.where(
                or_(
                    Producto.nombre.ilike(pattern),
                    Producto.descripcion.ilike(pattern),
                )
            )

        statement = statement.order_by(Producto.id.desc()).offset((page - 1) * size).limit(size)
        return list(self.session.exec(statement).all())

    def get_active_with_relations(self, producto_id: int) -> Producto | None:
        statement = (
            select(Producto)
            .where(
                Producto.id == producto_id,
                Producto.activo == True,  # noqa: E712
            )
            .options(
                selectinload(Producto.categorias),
                selectinload(Producto.ingredientes),
            )
        )
        return self.session.exec(statement).first()
