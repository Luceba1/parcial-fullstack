from collections.abc import Generator

from sqlmodel import Session

from app.core.db import engine


class SQLModelUnitOfWork:
    session: Session

    def __enter__(self) -> "SQLModelUnitOfWork":
        self.session = Session(engine)
        return self

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        if exc_type is not None:
            self.rollback()
        self.session.close()

    def commit(self) -> None:
        self.session.commit()

    def rollback(self) -> None:
        self.session.rollback()


def get_uow() -> Generator[SQLModelUnitOfWork, None, None]:
    with SQLModelUnitOfWork() as uow:
        yield uow
