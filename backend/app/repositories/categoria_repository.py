from sqlmodel import Session, select

from app.models.categoria import Categoria
from app.models.producto_categoria import ProductoCategoria
from app.repositories.base_repository import BaseRepository


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def list_active(self) -> list[Categoria]:
        statement = (
            select(Categoria)
            .where(Categoria.activo == True)  # noqa: E712
            .order_by(Categoria.nombre)
        )
        return list(self.session.exec(statement).all())

    def get_active_by_id(self, categoria_id: int) -> Categoria | None:
        categoria = self.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            return None
        return categoria

    def get_active_by_ids(self, categoria_ids: list[int]) -> list[Categoria]:
        if not categoria_ids:
            return []
        statement = select(Categoria).where(
            Categoria.id.in_(categoria_ids),  # type: ignore[attr-defined]
            Categoria.activo == True,  # noqa: E712
        )
        return list(self.session.exec(statement).all())

    def has_productos(self, categoria_id: int) -> bool:
        statement = select(ProductoCategoria).where(
            ProductoCategoria.categoria_id == categoria_id
        )
        return self.session.exec(statement).first() is not None
