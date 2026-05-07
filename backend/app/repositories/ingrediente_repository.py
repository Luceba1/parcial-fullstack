from sqlmodel import Session, select

from app.models.ingrediente import Ingrediente
from app.models.producto_ingrediente import ProductoIngrediente
from app.repositories.base_repository import BaseRepository


class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(session, Ingrediente)

    def list_active(self) -> list[Ingrediente]:
        statement = (
            select(Ingrediente)
            .where(Ingrediente.activo == True)  # noqa: E712
            .order_by(Ingrediente.nombre)
        )
        return list(self.session.exec(statement).all())

    def get_active_by_id(self, ingrediente_id: int) -> Ingrediente | None:
        ingrediente = self.get_by_id(ingrediente_id)
        if ingrediente is None or not ingrediente.activo:
            return None
        return ingrediente

    def get_active_by_ids(self, ingrediente_ids: list[int]) -> list[Ingrediente]:
        if not ingrediente_ids:
            return []
        statement = select(Ingrediente).where(
            Ingrediente.id.in_(ingrediente_ids),  # type: ignore[attr-defined]
            Ingrediente.activo == True,  # noqa: E712
        )
        return list(self.session.exec(statement).all())

    def has_productos(self, ingrediente_id: int) -> bool:
        statement = select(ProductoIngrediente).where(
            ProductoIngrediente.ingrediente_id == ingrediente_id
        )
        return self.session.exec(statement).first() is not None
