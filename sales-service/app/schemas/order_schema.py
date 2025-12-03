from pydantic import BaseModel, Field
from typing import List


class OrderItemCreate(BaseModel):
    variant_id: str
    quantity: int = Field(..., gt=0)


class CreateOrder(BaseModel):
    user_id: str
    items: List[OrderItemCreate]


class OrderItemOut(BaseModel):
    variant_id: str
    quantity: int
    price: float
    subtotal: float

    class Config:
        orm_mode = True


class OrderOut(BaseModel):
    id: str
    user_id: str
    total_amount: float
    tax_amount: float
    total_with_tax: float
    status: str
    items: List[OrderItemOut]

    class Config:
        orm_mode = True
