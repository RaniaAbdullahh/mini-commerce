// app/cart/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { state, removeItem, updateQty, totalPrice } = useCart();

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Cart</h1>

      {state.items.length === 0 && <p>Your cart is empty. <Link href="/products">Shop now</Link></p>}

      <div className="space-y-4">
        {state.items.map(item => (
          <div key={item.variant_id} className="flex justify-between items-center border p-3">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-600">{item.size} • {item.color}</div>
              <div className="text-sm">Price: ${item.price}</div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateQty(item.variant_id, Math.max(1, Number(e.target.value)))}
                className="w-16 border rounded px-2 py-1"
              />
              <div>${(item.price * item.quantity).toFixed(2)}</div>
              <button className="text-red-600" onClick={() => removeItem(item.variant_id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-lg">Total: ${totalPrice.toFixed(2)}</div>
        <Link href="/checkout">
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Checkout</button>
        </Link>
      </div>
    </div>
  );
}
