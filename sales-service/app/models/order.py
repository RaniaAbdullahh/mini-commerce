import enum
import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    CANCELLED = "CANCELLED"
    SHIPPED = "SHIPPED"
    COMPLETED = "COMPLETED"


class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    total_amount = Column(Float, default=0.0, nullable=False)  # sub total
    tax_amount = Column(Float, default=0.0, nullable=False)    # tax
    # total including tax
    total_with_tax = Column(Float, default=0.0, nullable=False)
    status = Column(Enum(OrderStatus),
                    default=OrderStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    items = relationship("OrderItem", back_populates="order",
                         cascade="all, delete-orphan")
