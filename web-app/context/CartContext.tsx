"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { CartItem } from "@/types/cart";

type State = {
  items: CartItem[];
};

type Action =
  | { type: "HYDRATE"; payload: State }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { variant_id: string } }
  | { type: "UPDATE_QTY"; payload: { variant_id: string; quantity: number } }
  | { type: "CLEAR" };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM": {
      const exists = state.items.find(i => i.variant_id === action.payload.variant_id);
      if (exists) {
        return {
          items: state.items.map(i =>
            i.variant_id === action.payload.variant_id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter(i => i.variant_id !== action.payload.variant_id) };
    case "UPDATE_QTY":
      return {
        items: state.items.map(i =>
          i.variant_id === action.payload.variant_id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: State;
  addItem: (item: CartItem) => void;
  removeItem: (variant_id: string) => void;
  updateQty: (variant_id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch (e) {
      
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (variant_id: string) => dispatch({ type: "REMOVE_ITEM", payload: { variant_id } });
  const updateQty = (variant_id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { variant_id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
