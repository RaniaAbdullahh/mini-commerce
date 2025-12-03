"use client";
// // app/products/page.tsx
import { CATALOG_API, apiGet } from "@/lib/api";
// import Image from "next/image";
// import Link from "next/link";

// export default async function ProductsPage() {
//   const data = await apiGet(`${CATALOG_API}/products`);
//   const products = data.data ?? data;

//   return (
//     <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {products.map((p: any) => (
//         <Link
//           key={p.id}
//           href={`/products/${p.id}`}
//           className="border rounded p-4 shadow"
//         >
//           <img
//             src={p.imageUrl ?? "./placeholder.png"}
//             alt={p.name}
//             className="w-full h-48 object-cover"
//           />
//           <h3 className="mt-2 font-semibold">{p.name}</h3>
//         </Link>
//       ))}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import Link from "next/link";

const PAGE_SIZE = 9; // default page size

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: PAGE_SIZE.toString(),
        ...(search && { search }),
      });

      const res = await fetch(`${CATALOG_API}/products?${params}`);
      const data = await res.json();

      setProducts(data.data ?? data);
      setTotalCount(data.totalCount ?? data.data?.length ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on new search
          }}
          placeholder="Search products..."
          className="border p-2 rounded w-full sm:w-1/2"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="border rounded p-4 shadow"
            >
              <img
                src={p.imageUrl ?? "./placeholder.png"}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                page === idx + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
