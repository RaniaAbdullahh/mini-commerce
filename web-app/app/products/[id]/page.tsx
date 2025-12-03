// app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CATALOG_API, apiGet } from "@/lib/api";

export default function ProductPage() {
    const params = useParams();
  const { id } = params;
  console.log(1111,id)
  const [product, setProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const { addItem } = useCart();
  const router = useRouter();
  useEffect(() => {
    apiGet(`${CATALOG_API}/products/${id}`)
      .then((d) => setProduct(d.data.product ?? d))
      .catch(() => {});
  }, [id]);

  if (!product) return <div className="p-8">Loading...</div>;
  return (
    <div className="p-8">
      <div className="flex gap-8">
        <img
          src={product.imageUrl ?? "/placeholder.png"}
          alt={product.name}
          className="w-96 h-96 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          <div className="mt-6">
            <h3 className="font-semibold">Variants</h3>
            <div className="flex gap-3 mt-2">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-2 border rounded ${
                    selectedVariant?.id === v.id ? "border-blue-600" : ""
                  }`}
                >
                  {v.color ?? "—"} / {v.size ?? "—"} • ${v.price} • stock{" "}
                  {v.stock}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              onClick={() => {
                if (!selectedVariant) return;
                addItem({
                  variant_id: selectedVariant.id,
                  product_id: product.id,
                  name: product.name,
                  price: Number(selectedVariant.price),
                  quantity: 1,
                  size: selectedVariant.size,
                  color: selectedVariant.color,
                });
                router.push("/cart");
              }}
              className="bg-black text-white px-5 py-2 rounded disabled:opacity-60"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
