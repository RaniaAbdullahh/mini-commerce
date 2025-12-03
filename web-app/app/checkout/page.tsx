
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { apiGet, apiPost, SALES_API } from "@/lib/api";

const TAX_RATE = 0.15; // 15% tax for example

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [taxRate, setTaxRate] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiGet(`${SALES_API}/orders/tax`);
      console.log("11111vvvvvv111",data)
      setTaxRate(data);
    };
  
    fetchData();
  }, []);
  // Calculate subtotal
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const totalWithTax = parseFloat((subtotal + taxAmount).toFixed(2));

  const submitOrder = async () => {
    setError(null);
    setLoading(true);
    try {
      const newUserId = uuidv4();
      const payload = {
        user_id: newUserId,
        items: state.items.map((i) => ({
          variant_id: i.variant_id,
          quantity: i.quantity,
        })),
        total_amount: subtotal,
        tax_amount: taxAmount,
        total_with_tax: totalWithTax,
      };

      const orderResponse = await apiPost(`${SALES_API}/orders`, payload);

      setOrder(orderResponse); // show confirmation
      clearCart();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Render cart items
  const renderCartItems = () =>
    state.items.map((item) => (
      <div key={item.variant_id} className="flex justify-between border-b py-2">
        <span>
          {item.quantity} × {item.name}
        </span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-6">Checkout</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {order ? (
        // Confirmation view
        <div className="border p-6 rounded shadow">
          <h2 className="text-xl mb-4">Order Placed Successfully!</h2>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> ${order.total_with_tax.toFixed(2)}
          </p>

          <h3 className="mt-4 font-semibold">Items:</h3>
          <ul className="mb-4">
            {order.items.map((i: any) => (
              <li key={i.variant_id}>
                {i.quantity} × {i.variant_id} = ${i.subtotal.toFixed(2)}
              </li>
            ))}
          </ul>

          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        // Checkout view
        <>
          <div className="border rounded p-4 mb-4">
            <h2 className="font-semibold mb-2">Your Cart</h2>
            {state.items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {renderCartItems()}
                <div className="flex justify-between mt-2 font-semibold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Tax ({TAX_RATE * 100}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${totalWithTax.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <button
            disabled={loading || state.items.length === 0}
            onClick={submitOrder}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
