import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey(
        "orders.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    order = relationship("Order", back_populates="items")
