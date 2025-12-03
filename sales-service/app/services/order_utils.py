from typing import List
from app.core.config import settings

TAX_RATE = settings.TAX_RATE  # 15% tax


def calculate_order_totals(items: List[dict]) -> dict:
    """
    Calculate subtotal, tax, and total_with_tax for a list of items.
    Each item dict should have: 'price' and 'quantity'.

    Returns:
        dict: {'subtotal': float, 'tax': float, 'total': float}
    """
    subtotal = sum(float(item['price']) * int(item['quantity'])
                   for item in items)
    tax_amount = round(subtotal * TAX_RATE, 2)
    total_with_tax = round(subtotal + tax_amount, 2)

    return {
        "subtotal": round(subtotal, 2),
        "tax_amount": tax_amount,
        "total_with_tax": total_with_tax
    }
