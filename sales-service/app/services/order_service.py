import uuid
import logging
from typing import List
import requests
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order_schema import CreateOrder, OrderOut
from app.core.config import settings
from app.services.order_utils import calculate_order_totals

CATALOG_URL = settings.CATALOG_SERVICE_URL.rstrip('/')
# Configure logging
logger = logging.getLogger("order_service")
logging.basicConfig(level=logging.INFO)


class OrderService:

    @staticmethod
    def expose_tax():
        """
        return tax ammount for frontend 
        """
        return settings.TAX_RATE

    @staticmethod
    def reduce_stock(variant_id: str, quantity: int) -> dict:
        """
        Calls catalog service to reduce stock for a variant.
        Returns the variant data on success.
        Raises HTTPException on failure.
        """
        try:
            resp = requests.patch(
                f"{CATALOG_URL}/variants/{variant_id}/reduce-stock",
                json={"quantity": quantity},
                timeout=5
            )
        except requests.RequestException as e:
            logger.error(
                f"Failed to contact catalog service for variant {variant_id}: {e}")
            raise HTTPException(
                status_code=502, detail=f"Catalog service unreachable: {e}")

        if resp.status_code != 200:
            logger.error(
                f"Unable to reserve stock for variant {variant_id}: {resp.text}")
            raise HTTPException(
                status_code=400,
                detail=f"Unable to reserve stock for variant {variant_id}: {resp.text}"
            )

        variant_data = resp.json().get("data")
        if not variant_data or "price" not in variant_data:
            logger.error(
                f"Catalog service response missing price for variant {variant_id}")
            raise HTTPException(
                status_code=502, detail="Catalog service response missing price")

        logger.info(f"Stock reduced successfully for variant {variant_id}")
        return variant_data

    @staticmethod
    def map_order_to_out(order: Order) -> OrderOut:
        """
        Maps a SQLAlchemy Order model to a Pydantic OrderOut schema.
        """
        return OrderOut(
            id=order.id,
            user_id=order.user_id,
            total_amount=order.total_amount,
            tax_amount=order.tax_amount,
            total_with_tax=order.total_with_tax,
            status=order.status.value,
            items=order.items,
        )

    @staticmethod
    def create_order(db: Session, payload: CreateOrder) -> OrderOut:
        """
        Creates a new order:
        1. Reduces stock in catalog service
        2. Calculates totals and taxes
        3. Saves order and order items to DB
        """
        order = Order(
            id=str(uuid.uuid4()),
            user_id=payload.user_id,
            status=OrderStatus.PENDING
        )
        db.add(order)
        db.flush()  # ensure order.id is available

        order_items_data = []

        for item in payload.items:
            variant_data = OrderService.reduce_stock(
                item.variant_id, item.quantity)
            price = float(variant_data["price"])
            subtotal = price * item.quantity

            order_item = OrderItem(
                id=str(uuid.uuid4()),
                order_id=order.id,
                variant_id=item.variant_id,
                quantity=item.quantity,
                price=price,
                subtotal=subtotal
            )
            db.add(order_item)
            order_items_data.append(
                {"price": price, "quantity": item.quantity})

        # Calculate totals & taxes
        totals = calculate_order_totals(order_items_data)
        order.total_amount = totals["subtotal"]
        order.tax_amount = totals["tax_amount"]
        order.total_with_tax = totals["total_with_tax"]

        db.commit()
        db.refresh(order)
        logger.info(
            f"Order {order.id} created successfully for user {order.user_id}")
        return OrderService.map_order_to_out(order)

    @staticmethod
    def get_order(db: Session, order_id: str) -> OrderOut:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            logger.warning(f"Order {order_id} not found")
            raise HTTPException(status_code=404, detail="Order not found")
        return OrderService.map_order_to_out(order)

    @staticmethod
    def list_orders(db: Session, limit: int = 100) -> List[OrderOut]:
        orders = db.query(Order).order_by(
            Order.created_at.desc()).limit(limit).all()
        logger.info(f"Listing {len(orders)} orders")
        return [OrderService.map_order_to_out(order) for order in orders]
