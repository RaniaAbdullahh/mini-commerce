from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.order_schema import CreateOrder, OrderOut
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("", response_model=OrderOut)
def create_order(payload: CreateOrder, db: Session = Depends(get_db)):
    return OrderService.create_order(db, payload)


@router.get("/tax")
def expose_tax():
    return OrderService.expose_tax()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db)):
    return OrderService.get_order(db, order_id)


@router.get("", response_model=list[OrderOut])
def list_orders(limit: int = 100, db: Session = Depends(get_db)):
    return OrderService.list_orders(db, limit)
