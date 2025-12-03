"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <Link href="/" className="text-lg font-bold">MiniCommerce</Link>

      <nav className="flex items-center gap-4">
        <Link href="/products">Products</Link>
        <Link href="/cart" className="relative">
          Cart
          <span className="ml-2 inline-block bg-blue-500 text-white text-xs px-2 rounded">
            {totalItems}
          </span>
        </Link>
      </nav>
    </header>
  );
}
