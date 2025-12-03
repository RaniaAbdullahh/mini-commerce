# Mini-Commerce Web App

## Project Overview
Mini-Commerce is a small e-commerce web application that allows users to:

- Browse products with pagination and search
- View product details
- Add items to a shopping cart
- Checkout and place orders
- View inline order confirmation

The web app communicates with the **Catalog Service** (for products) and **Sales Service** (for orders) via REST APIs.

**Technologies used:**

- Next.js 13 (App Router)
- React & TypeScript
- Tailwind CSS for styling
- Context API for cart state management
- Axios or fetch for API calls

---

## Features

1. **Product Listing**
   - Pagination support
   - Search bar to filter products
   - Product images, names, and descriptions

2. **Product Details**
   - Show variants, images, and detailed info

3. **Cart Management**
   - Add/remove products
   - Update quantities
   - Calculate subtotal, tax, and total

4. **Checkout**
   - Place order with cart items
   - Inline order confirmation showing order ID, totals, and status

5. **Routing**
   - Product listing page
   - Product details page
   - Checkout page
   - Optional: order confirmation page

---

## Installation

```bash
# Clone the repository
git clone <web-app-repo-url>
cd mini-commerce
