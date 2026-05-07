from collections.abc import Generator
from types import TracebackType

from sqlmodel import Session

from app.core.db import engine
from app.repositories.categoria_repository import CategoriaRepository
from app.repositories.ingrediente_repository import IngredienteRepository
from app.repositories.producto_repository import ProductoRepository


class SQLModelUnitOfWork:
    session: Session
    categorias: CategoriaRepository
    ingredientes: IngredienteRepository
    productos: ProductoRepository

    def __enter__(self) -> "SQLModelUnitOfWork":
        self.session = Session(engine)
        self.categorias = CategoriaRepository(self.session)
        self.ingredientes = IngredienteRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()


def get_uow() -> Generator[SQLModelUnitOfWork, None, None]:
    with SQLModelUnitOfWork() as uow:
        yield uow
