from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    def __init__(self, session: Session, model: type[ModelType]):
        self.session = session
        self.model = model

    def get_by_id(self, entity_id: int) -> ModelType | None:
        return self.session.get(self.model, entity_id)

    def list_all(self) -> list[ModelType]:
        statement = select(self.model)
        return list(self.session.exec(statement).all())

    def create(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        self.session.flush()
        self.session.refresh(entity)
        return entity

    def update(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        self.session.flush()
        self.session.refresh(entity)
        return entity

    def hard_delete(self, entity: ModelType) -> None:
        self.session.delete(entity)
        self.session.flush()
